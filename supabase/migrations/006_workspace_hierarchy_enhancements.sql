-- Workspace & Hierarchy Enhancements
-- Adds workspace metadata, advanced task fields, folder permissions, and activity logs

------------------------------------------------------------
-- Workspace metadata updates
------------------------------------------------------------

ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS parent_workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

-- Generate slugs for existing workspaces if missing
WITH generated AS (
  SELECT
    id,
    CASE
      WHEN trimmed = '' THEN 'workspace-' || SUBSTRING(id::TEXT FROM 1 FOR 8)
      ELSE trimmed
    END AS base_slug
  FROM (
    SELECT id,
           LOWER(REGEXP_REPLACE(name, '[^a-z0-9]+', '-', 'g')) AS trimmed
    FROM workspaces
  ) t
), numbered AS (
  SELECT
    id,
    base_slug,
    ROW_NUMBER() OVER (PARTITION BY base_slug ORDER BY id) AS rn
  FROM generated
), final AS (
  SELECT
    id,
    CASE
      WHEN rn = 1 THEN base_slug
      ELSE base_slug || '-' || rn::TEXT
    END AS slug
  FROM numbered
)
UPDATE workspaces w
SET slug = final.slug
FROM final
WHERE w.id = final.id
  AND w.slug IS NULL;

ALTER TABLE workspaces
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_slug_format CHECK (slug ~ '^[a-z0-9-]+$');

ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_slug_unique UNIQUE (slug);

ALTER TABLE workspaces
  ADD CONSTRAINT workspaces_parent_not_self CHECK (parent_workspace_id IS NULL OR parent_workspace_id <> id);

CREATE INDEX IF NOT EXISTS idx_workspaces_parent ON workspaces(parent_workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_archived ON workspaces(is_archived);

------------------------------------------------------------
-- Workspace role catalog updates
------------------------------------------------------------

INSERT INTO workspace_roles (key, name, description, priority, is_default)
VALUES
  ('editor', 'Editor', 'Manage workspace content without administrative privileges', 70, FALSE),
  ('guest', 'Guest', 'Limited access for external collaborators', 5, FALSE)
ON CONFLICT (key) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    priority = EXCLUDED.priority,
    is_default = EXCLUDED.is_default;

-- Permission presets for new roles
INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'editor', perm
FROM UNNEST(ARRAY[
  'workspace.view',
  'members.view',
  'members.leave',
  'folders.read',
  'folders.create',
  'folders.update',
  'folders.delete',
  'folders.move',
  'folders.reorder',
  'categories.read',
  'categories.create',
  'categories.update',
  'tasks.read',
  'tasks.create',
  'tasks.update',
  'tasks.move',
  'tasks.reorder',
  'tasks.delete_own',
  'tasks.assign',
  'comments.read',
  'comments.create',
  'comments.update_own',
  'comments.delete_own',
  'attachments.read',
  'attachments.create',
  'attachments.delete_own'
]::TEXT[]) AS t(perm)
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'guest', perm
FROM UNNEST(ARRAY[
  'workspace.view',
  'members.view',
  'members.leave',
  'folders.read',
  'tasks.read',
  'comments.read',
  'attachments.read'
]::TEXT[]) AS t(perm)
ON CONFLICT DO NOTHING;

------------------------------------------------------------
-- Workspace members metadata
------------------------------------------------------------

ALTER TABLE workspace_members
  ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE workspace_members
  ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE workspace_members
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_workspace_members_last_active ON workspace_members(last_active_at);

------------------------------------------------------------
-- Workspace folders enhancements
------------------------------------------------------------

ALTER TABLE workspace_folders
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT;

ALTER TABLE workspace_folders
  ADD CONSTRAINT workspace_folders_depth_check CHECK (depth BETWEEN 0 AND 20);

CREATE INDEX IF NOT EXISTS idx_workspace_folders_archived ON workspace_folders(workspace_id, is_archived);

------------------------------------------------------------
-- Folder-level permissions
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS folder_permissions (
  folder_id UUID NOT NULL REFERENCES workspace_folders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'admin')),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (folder_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_folder_permissions_user ON folder_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_folder_permissions_folder ON folder_permissions(folder_id);

ALTER TABLE folder_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY folder_permissions_select ON folder_permissions
FOR SELECT
USING (
  auth.uid() = user_id
  OR has_workspace_permission(
    (SELECT workspace_id FROM workspace_folders wf WHERE wf.id = folder_id),
    'workspace.manage_permissions'
  )
);

CREATE POLICY folder_permissions_insert ON folder_permissions
FOR INSERT
WITH CHECK (
  has_workspace_permission(
    (SELECT workspace_id FROM workspace_folders wf WHERE wf.id = folder_permissions.folder_id),
    'workspace.manage_permissions'
  )
);

CREATE POLICY folder_permissions_update ON folder_permissions
FOR UPDATE
USING (
  has_workspace_permission(
    (SELECT workspace_id FROM workspace_folders wf WHERE wf.id = folder_permissions.folder_id),
    'workspace.manage_permissions'
  )
)
WITH CHECK (
  has_workspace_permission(
    (SELECT workspace_id FROM workspace_folders wf WHERE wf.id = folder_permissions.folder_id),
    'workspace.manage_permissions'
  )
);

CREATE POLICY folder_permissions_delete ON folder_permissions
FOR DELETE
USING (
  has_workspace_permission(
    (SELECT workspace_id FROM workspace_folders wf WHERE wf.id = folder_permissions.folder_id),
    'workspace.manage_permissions'
  )
);

------------------------------------------------------------
-- Activity logging
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  changes JSONB,
  request_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_logs_select ON activity_logs
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'workspace.view')
);

CREATE POLICY activity_logs_insert ON activity_logs
FOR INSERT
WITH CHECK (
  auth.role() = 'service_role'
  OR has_workspace_permission(workspace_id, 'workspace.manage_settings')
);

------------------------------------------------------------
-- Task metadata enhancements
------------------------------------------------------------

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS actual_hours NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS completion_percentage INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_template BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_completion_percentage_check CHECK (completion_percentage BETWEEN 0 AND 100);

ALTER TABLE tasks
  ADD CONSTRAINT tasks_estimated_hours_check CHECK (estimated_hours IS NULL OR estimated_hours >= 0);

ALTER TABLE tasks
  ADD CONSTRAINT tasks_actual_hours_check CHECK (actual_hours IS NULL OR actual_hours >= 0);

ALTER TABLE tasks
  ADD CONSTRAINT tasks_parent_not_self CHECK (parent_task_id IS NULL OR parent_task_id <> id);

ALTER TABLE tasks
  DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE tasks
  ADD CONSTRAINT tasks_status_check CHECK (status IN ('todo', 'in_progress', 'done', 'blocked', 'archived'));

CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_archived ON tasks(workspace_id, is_archived);

------------------------------------------------------------
-- Data hygiene for new columns
------------------------------------------------------------

UPDATE workspace_members
SET permissions = '{}'::jsonb
WHERE permissions IS NULL;

UPDATE tasks
SET completion_percentage = COALESCE(completion_percentage, 0),
    tags = COALESCE(tags, ARRAY[]::TEXT[]),
    custom_fields = COALESCE(custom_fields, '{}'::jsonb),
    is_template = COALESCE(is_template, FALSE),
    is_archived = COALESCE(is_archived, FALSE);


