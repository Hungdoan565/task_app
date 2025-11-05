-- Workspace statuses and workflow enhancements
-- Supports customizable Kanban columns and links tasks to per-workspace statuses

------------------------------------------------------------
-- Workspace status catalog
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workspace_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  wip_limit INTEGER,
  position INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT workspace_statuses_key_format CHECK (key ~ '^[a-z0-9_-]+$')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_statuses_workspace_key
  ON workspace_statuses(workspace_id, key);

CREATE INDEX IF NOT EXISTS idx_workspace_statuses_workspace_position
  ON workspace_statuses(workspace_id, position);

CREATE INDEX IF NOT EXISTS idx_workspace_statuses_workspace_active
  ON workspace_statuses(workspace_id, is_active);

DROP TRIGGER IF EXISTS update_workspace_statuses_updated_at ON workspace_statuses;
CREATE TRIGGER update_workspace_statuses_updated_at
  BEFORE UPDATE ON workspace_statuses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- Workspace status helper triggers
------------------------------------------------------------

CREATE OR REPLACE FUNCTION workspace_statuses_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_base_key TEXT;
BEGIN
  IF NEW.workspace_id IS NULL THEN
    RAISE EXCEPTION 'workspace_id is required';
  END IF;

  IF NEW.key IS NULL OR btrim(NEW.key) = '' THEN
    v_base_key := lower(regexp_replace(coalesce(NEW.name, ''), '[^a-z0-9]+', '-', 'g'));
    v_base_key := regexp_replace(v_base_key, '(^-|-$)', '', 'g');
    IF v_base_key = '' THEN
      v_base_key := 'status-' || substr(uuid_generate_v4()::text, 1, 8);
    END IF;
    NEW.key := v_base_key;
  ELSE
    NEW.key := lower(regexp_replace(NEW.key, '[^a-z0-9_-]+', '-', 'g'));
  END IF;

  IF NEW.position IS NULL THEN
    SELECT COALESCE(MAX(position) + 1, 0)
      INTO NEW.position
      FROM workspace_statuses
      WHERE workspace_id = NEW.workspace_id;
  END IF;

  IF NEW.is_default IS NULL THEN
    NEW.is_default := FALSE;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workspace_statuses_before_insert ON workspace_statuses;
CREATE TRIGGER workspace_statuses_before_insert
  BEFORE INSERT ON workspace_statuses
  FOR EACH ROW
  EXECUTE FUNCTION workspace_statuses_before_insert();

CREATE OR REPLACE FUNCTION workspace_statuses_after_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE workspace_statuses
    SET is_default = FALSE
    WHERE workspace_id = NEW.workspace_id
      AND id <> NEW.id
      AND is_default = TRUE;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workspace_statuses_after_insert ON workspace_statuses;
CREATE TRIGGER workspace_statuses_after_insert
  AFTER INSERT ON workspace_statuses
  FOR EACH ROW
  EXECUTE FUNCTION workspace_statuses_after_write();

DROP TRIGGER IF EXISTS workspace_statuses_after_update ON workspace_statuses;
CREATE TRIGGER workspace_statuses_after_update
  AFTER UPDATE ON workspace_statuses
  FOR EACH ROW
  EXECUTE FUNCTION workspace_statuses_after_write();

------------------------------------------------------------
-- Permissions catalog updates for statuses
------------------------------------------------------------

INSERT INTO workspace_permissions (key, category, description)
VALUES
  ('statuses.read', 'tasks', 'View workflow statuses'),
  ('statuses.create', 'tasks', 'Create workflow statuses'),
  ('statuses.update', 'tasks', 'Update workflow statuses'),
  ('statuses.delete', 'tasks', 'Delete workflow statuses')
ON CONFLICT (key) DO UPDATE
SET category = EXCLUDED.category,
    description = EXCLUDED.description;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'owner', perm
FROM unnest(ARRAY[
  'statuses.read',
  'statuses.create',
  'statuses.update',
  'statuses.delete'
]::TEXT[]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'admin', perm
FROM unnest(ARRAY[
  'statuses.read',
  'statuses.create',
  'statuses.update',
  'statuses.delete'
]::TEXT[]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'editor', perm
FROM unnest(ARRAY[
  'statuses.read',
  'statuses.create',
  'statuses.update'
]::TEXT[]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'member', perm
FROM unnest(ARRAY[
  'statuses.read'
]::TEXT[]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'viewer', perm
FROM unnest(ARRAY[
  'statuses.read'
]::TEXT[]) AS perm
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'guest', perm
FROM unnest(ARRAY[
  'statuses.read'
]::TEXT[]) AS perm
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- Row Level Security for workspace_statuses
------------------------------------------------------------

ALTER TABLE workspace_statuses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS workspace_statuses_select ON workspace_statuses;
CREATE POLICY workspace_statuses_select ON workspace_statuses
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'statuses.read')
);

DROP POLICY IF EXISTS workspace_statuses_insert ON workspace_statuses;
CREATE POLICY workspace_statuses_insert ON workspace_statuses
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'statuses.create')
);

DROP POLICY IF EXISTS workspace_statuses_update ON workspace_statuses;
CREATE POLICY workspace_statuses_update ON workspace_statuses
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'statuses.update')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'statuses.update')
);

DROP POLICY IF EXISTS workspace_statuses_delete ON workspace_statuses;
CREATE POLICY workspace_statuses_delete ON workspace_statuses
FOR DELETE
USING (
  has_workspace_permission(workspace_id, 'statuses.delete')
);

------------------------------------------------------------
-- Default status seeding
------------------------------------------------------------

CREATE OR REPLACE FUNCTION seed_default_workspace_statuses(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_statuses CONSTANT JSONB := '[
    {"key": "todo", "name": "Chờ xử lý", "color": "#6366f1", "position": 0, "is_default": true},
    {"key": "in_progress", "name": "Đang thực hiện", "color": "#f59e0b", "position": 1},
    {"key": "review", "name": "Chờ duyệt", "color": "#7c3aed", "position": 2},
    {"key": "blocked", "name": "Bị chặn", "color": "#ef4444", "position": 3},
    {"key": "done", "name": "Hoàn thành", "color": "#22c55e", "position": 4},
    {"key": "archived", "name": "Đã lưu trữ", "color": "#475569", "position": 5, "is_active": false}
  ]'::JSONB;
BEGIN
  IF p_workspace_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO workspace_statuses (workspace_id, key, name, color, position, is_default, is_active)
  SELECT
    p_workspace_id,
    (value ->> 'key')::TEXT,
    (value ->> 'name')::TEXT,
    (value ->> 'color')::TEXT,
    COALESCE((value ->> 'position')::INT, 0),
    COALESCE((value ->> 'is_default')::BOOLEAN, FALSE),
    COALESCE((value ->> 'is_active')::BOOLEAN, TRUE)
  FROM jsonb_array_elements(default_statuses) AS value
  ON CONFLICT (workspace_id, key) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION ensure_workspace_default_statuses()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM seed_default_workspace_statuses(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_workspace_default_statuses ON workspaces;
CREATE TRIGGER ensure_workspace_default_statuses
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION ensure_workspace_default_statuses();

DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT id FROM workspaces LOOP
    PERFORM seed_default_workspace_statuses(rec.id);
  END LOOP;
END $$;

------------------------------------------------------------
-- Tasks status linkage
------------------------------------------------------------

ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks
  ALTER COLUMN status SET DEFAULT 'todo';

UPDATE tasks
SET status = COALESCE(NULLIF(status, ''), 'todo');

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS status_id UUID;

UPDATE tasks AS t
SET status_id = ws.id
FROM workspace_statuses AS ws
WHERE ws.workspace_id = t.workspace_id
  AND ws.key = t.status;

UPDATE tasks AS t
SET status_id = (
  SELECT id
  FROM workspace_statuses ws
  WHERE ws.workspace_id = t.workspace_id
  ORDER BY ws.is_default DESC, ws.position ASC
  LIMIT 1
)
WHERE status_id IS NULL;

ALTER TABLE tasks
  ALTER COLUMN status_id SET NOT NULL;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_status_id_fkey
    FOREIGN KEY (status_id) REFERENCES workspace_statuses(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_tasks_status_id ON tasks(status_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_status ON tasks(workspace_id, status_id);

CREATE OR REPLACE FUNCTION tasks_sync_status_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status workspace_statuses%ROWTYPE;
BEGIN
  IF NEW.status_id IS NOT NULL THEN
    SELECT * INTO v_status
    FROM workspace_statuses
    WHERE id = NEW.status_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Status id % không tồn tại', NEW.status_id;
    END IF;

    NEW.workspace_id := COALESCE(NEW.workspace_id, v_status.workspace_id);
    NEW.status := v_status.key;
    RETURN NEW;
  END IF;

  IF NEW.status IS NULL OR btrim(NEW.status) = '' THEN
    SELECT * INTO v_status
    FROM workspace_statuses
    WHERE workspace_id = NEW.workspace_id
    ORDER BY is_default DESC, position ASC
    LIMIT 1;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Workspace % chưa được cấu hình trạng thái', NEW.workspace_id;
    END IF;

    NEW.status_id := v_status.id;
    NEW.status := v_status.key;
    RETURN NEW;
  END IF;

  SELECT * INTO v_status
  FROM workspace_statuses
  WHERE workspace_id = NEW.workspace_id AND key = NEW.status
  ORDER BY position ASC
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Status % không tồn tại trong workspace %', NEW.status, NEW.workspace_id;
  END IF;

  NEW.status_id := v_status.id;
  NEW.status := v_status.key;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tasks_sync_status_fields ON tasks;
CREATE TRIGGER tasks_sync_status_fields
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION tasks_sync_status_fields();

-- End of migration
