-- Dual Dashboard Foundation Migration
-- Introduces workspace hierarchy, permission matrix, folder tree support, and refreshed RLS.

------------------------------------------------------------
-- Workspace enhancements
------------------------------------------------------------

ALTER TABLE workspaces
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'team', 'public'));

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

------------------------------------------------------------
-- Role & permission reference tables
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workspace_roles (
  key TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO workspace_roles (key, name, description, priority, is_default)
VALUES
  ('owner', 'Owner', 'Full control over the workspace', 100, FALSE),
  ('admin', 'Admin', 'Manage workspace settings and members', 80, FALSE),
  ('member', 'Member', 'Collaborate on workspace content', 50, TRUE),
  ('viewer', 'Viewer', 'Read-only access', 10, FALSE)
ON CONFLICT (key) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    priority = EXCLUDED.priority,
    is_default = EXCLUDED.is_default;

CREATE TABLE IF NOT EXISTS workspace_permissions (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO workspace_permissions (key, category, description)
VALUES
  ('workspace.view', 'workspace', 'View workspace metadata'),
  ('workspace.update', 'workspace', 'Update workspace settings'),
  ('workspace.delete', 'workspace', 'Delete the workspace'),
  ('workspace.manage_settings', 'workspace', 'Manage workspace configuration'),
  ('workspace.manage_permissions', 'workspace', 'Manage role and permission assignments'),
  ('workspace.manage_members', 'workspace', 'Manage workspace members'),
  ('workspace.invite_members', 'workspace', 'Invite new members to the workspace'),
  ('workspace.transfer_ownership', 'workspace', 'Transfer workspace ownership'),
  ('members.view', 'members', 'View workspace members'),
  ('members.leave', 'members', 'Leave the workspace'),
  ('folders.read', 'folders', 'Read folder hierarchy'),
  ('folders.create', 'folders', 'Create folders'),
  ('folders.update', 'folders', 'Update folders'),
  ('folders.delete', 'folders', 'Delete folders'),
  ('folders.move', 'folders', 'Change folder parents'),
  ('folders.reorder', 'folders', 'Reorder folders within a parent'),
  ('categories.read', 'categories', 'View categories'),
  ('categories.create', 'categories', 'Create categories'),
  ('categories.update', 'categories', 'Update categories'),
  ('categories.delete', 'categories', 'Delete categories'),
  ('tasks.read', 'tasks', 'View tasks'),
  ('tasks.create', 'tasks', 'Create tasks'),
  ('tasks.update', 'tasks', 'Update tasks'),
  ('tasks.move', 'tasks', 'Move tasks between folders'),
  ('tasks.reorder', 'tasks', 'Reorder tasks in a list'),
  ('tasks.delete_own', 'tasks', 'Delete tasks created by the user'),
  ('tasks.delete_any', 'tasks', 'Delete any task'),
  ('tasks.assign', 'tasks', 'Assign tasks to members'),
  ('comments.read', 'comments', 'Read task comments'),
  ('comments.create', 'comments', 'Create comments'),
  ('comments.update_own', 'comments', 'Update own comments'),
  ('comments.update_any', 'comments', 'Update any comment'),
  ('comments.delete_own', 'comments', 'Delete own comments'),
  ('comments.delete_any', 'comments', 'Delete any comment'),
  ('attachments.read', 'attachments', 'View attachments'),
  ('attachments.create', 'attachments', 'Upload attachments'),
  ('attachments.delete_own', 'attachments', 'Delete own attachments'),
  ('attachments.delete_any', 'attachments', 'Delete any attachment')
ON CONFLICT (key) DO UPDATE
SET category = EXCLUDED.category,
    description = EXCLUDED.description;

CREATE TABLE IF NOT EXISTS workspace_role_permissions_global (
  role_key TEXT NOT NULL REFERENCES workspace_roles(key) ON DELETE CASCADE,
  permission_key TEXT NOT NULL REFERENCES workspace_permissions(key) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (role_key, permission_key)
);

CREATE TABLE IF NOT EXISTS workspace_role_permissions (
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role_key TEXT NOT NULL REFERENCES workspace_roles(key) ON DELETE CASCADE,
  permission_key TEXT NOT NULL REFERENCES workspace_permissions(key) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (workspace_id, role_key, permission_key)
);

CREATE TABLE IF NOT EXISTS workspace_member_permissions (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL REFERENCES workspace_permissions(key) ON DELETE CASCADE,
  granted BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE (workspace_id, user_id, permission_key)
);

-- Seed global role permissions
INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'owner', perm
FROM unnest(ARRAY[
  'workspace.view',
  'workspace.update',
  'workspace.delete',
  'workspace.manage_settings',
  'workspace.manage_permissions',
  'workspace.manage_members',
  'workspace.invite_members',
  'workspace.transfer_ownership',
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
  'categories.delete',
  'tasks.read',
  'tasks.create',
  'tasks.update',
  'tasks.move',
  'tasks.reorder',
  'tasks.delete_own',
  'tasks.delete_any',
  'tasks.assign',
  'comments.read',
  'comments.create',
  'comments.update_own',
  'comments.update_any',
  'comments.delete_own',
  'comments.delete_any',
  'attachments.read',
  'attachments.create',
  'attachments.delete_own',
  'attachments.delete_any'
]::TEXT[]) AS t(perm)
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'admin', perm
FROM unnest(ARRAY[
  'workspace.view',
  'workspace.update',
  'workspace.manage_settings',
  'workspace.manage_permissions',
  'workspace.manage_members',
  'workspace.invite_members',
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
  'categories.delete',
  'tasks.read',
  'tasks.create',
  'tasks.update',
  'tasks.move',
  'tasks.reorder',
  'tasks.delete_own',
  'tasks.delete_any',
  'tasks.assign',
  'comments.read',
  'comments.create',
  'comments.update_own',
  'comments.update_any',
  'comments.delete_own',
  'comments.delete_any',
  'attachments.read',
  'attachments.create',
  'attachments.delete_own',
  'attachments.delete_any'
]::TEXT[]) AS t(perm)
ON CONFLICT DO NOTHING;

INSERT INTO workspace_role_permissions_global (role_key, permission_key)
SELECT 'member', perm
FROM unnest(ARRAY[
  'workspace.view',
  'members.view',
  'members.leave',
  'folders.read',
  'folders.create',
  'folders.update',
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
SELECT 'viewer', perm
FROM unnest(ARRAY[
  'workspace.view',
  'members.view',
  'members.leave',
  'folders.read',
  'categories.read',
  'tasks.read',
  'comments.read',
  'attachments.read'
]::TEXT[]) AS t(perm)
ON CONFLICT DO NOTHING;

-- Align existing workspace members with role catalog
UPDATE workspace_members
SET role = COALESCE(role, 'member');

ALTER TABLE workspace_members
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN role SET DEFAULT 'member';

ALTER TABLE workspace_members
  ADD CONSTRAINT workspace_members_role_fk
  FOREIGN KEY (role) REFERENCES workspace_roles(key)
  ON UPDATE CASCADE ON DELETE RESTRICT;

------------------------------------------------------------
-- Workspace folders with hierarchy metadata
------------------------------------------------------------

CREATE TABLE IF NOT EXISTS workspace_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES workspace_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  path UUID[] NOT NULL,
  depth INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT workspace_folders_slug_not_empty CHECK (btrim(slug) <> '')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_folders_name_unique
  ON workspace_folders (workspace_id, parent_id, lower(name));

CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_folders_slug_unique
  ON workspace_folders (workspace_id, parent_id, lower(slug));

CREATE INDEX IF NOT EXISTS idx_workspace_folders_workspace
  ON workspace_folders (workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_folders_parent
  ON workspace_folders (parent_id);

CREATE INDEX IF NOT EXISTS idx_workspace_folders_path
  ON workspace_folders USING GIN (path);

CREATE INDEX IF NOT EXISTS idx_workspace_folders_position
  ON workspace_folders (workspace_id, parent_id, position);

------------------------------------------------------------
-- Folder helper functions & triggers
------------------------------------------------------------

CREATE OR REPLACE FUNCTION workspace_folders_before_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent_workspace UUID;
  v_parent_path UUID[];
  v_parent_depth INTEGER;
  v_new_slug TEXT;
  v_position INTEGER;
  v_actor UUID := auth.uid();
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.id IS NULL THEN
      NEW.id := uuid_generate_v4();
    END IF;
    NEW.created_at := COALESCE(NEW.created_at, NOW());
    NEW.created_by := COALESCE(NEW.created_by, v_actor);
  ELSE
    NEW.created_at := OLD.created_at;
    NEW.created_by := OLD.created_by;
  END IF;

  NEW.updated_at := NOW();
  NEW.updated_by := v_actor;

  IF NEW.workspace_id IS NULL THEN
    RAISE EXCEPTION 'workspace_id is required';
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.workspace_id <> OLD.workspace_id THEN
    RAISE EXCEPTION 'Cannot move folders between workspaces';
  END IF;

  IF NEW.parent_id IS NOT NULL THEN
    SELECT workspace_id, path, depth
      INTO v_parent_workspace, v_parent_path, v_parent_depth
    FROM workspace_folders
    WHERE id = NEW.parent_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Parent folder % does not exist', NEW.parent_id;
    END IF;

    IF v_parent_workspace <> NEW.workspace_id THEN
      RAISE EXCEPTION 'Parent folder % belongs to a different workspace', NEW.parent_id;
    END IF;

    IF TG_OP = 'UPDATE' THEN
      IF NEW.id = NEW.parent_id THEN
        RAISE EXCEPTION 'Folder cannot be its own parent';
      END IF;
      IF NEW.id = ANY(v_parent_path) THEN
        RAISE EXCEPTION 'Cannot move folder into its own subtree';
      END IF;
    END IF;

    NEW.path := v_parent_path || NEW.id;
    NEW.depth := v_parent_depth + 1;
  ELSE
    NEW.parent_id := NULL;
    NEW.path := ARRAY[NEW.id];
    NEW.depth := 0;
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.parent_id IS DISTINCT FROM OLD.parent_id THEN
    NEW.position := NULL;
  END IF;

  IF NEW.position IS NULL THEN
    SELECT COALESCE(MAX(position) + 1, 0) INTO v_position
    FROM workspace_folders
    WHERE workspace_id = NEW.workspace_id
      AND parent_id IS NOT DISTINCT FROM NEW.parent_id
      AND id <> NEW.id;
    NEW.position := v_position;
  END IF;

  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' THEN
    v_new_slug := lower(regexp_replace(NEW.name, '[^a-z0-9]+', '-', 'g'));
    v_new_slug := regexp_replace(v_new_slug, '(^-|-$)', '', 'g');
    IF v_new_slug = '' THEN
      v_new_slug := 'folder-' || substring(NEW.id::TEXT FROM 1 FOR 8);
    END IF;
    NEW.slug := v_new_slug;
  ELSE
    NEW.slug := lower(NEW.slug);
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION workspace_folders_after_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old_path_length INTEGER := cardinality(OLD.path);
  v_suffix UUID[];
BEGIN
  IF NEW.path IS DISTINCT FROM OLD.path THEN
    UPDATE workspace_folders AS wf
    SET path = NEW.path || COALESCE(wf.path[v_old_path_length + 1:cardinality(wf.path)], '{}'::UUID[]),
        depth = cardinality(NEW.path || COALESCE(wf.path[v_old_path_length + 1:cardinality(wf.path)], '{}'::UUID[])) - 1,
        updated_at = NOW(),
        updated_by = auth.uid()
    WHERE wf.workspace_id = NEW.workspace_id
      AND wf.path[1:v_old_path_length] = OLD.path
      AND wf.id <> NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS workspace_folders_before_write ON workspace_folders;
CREATE TRIGGER workspace_folders_before_write
  BEFORE INSERT OR UPDATE ON workspace_folders
  FOR EACH ROW
  EXECUTE FUNCTION workspace_folders_before_write();

DROP TRIGGER IF EXISTS workspace_folders_after_update ON workspace_folders;
CREATE TRIGGER workspace_folders_after_update
  AFTER UPDATE ON workspace_folders
  FOR EACH ROW
  EXECUTE FUNCTION workspace_folders_after_update();

------------------------------------------------------------
-- Workspace folder helper functions
------------------------------------------------------------

------------------------------------------------------------
-- Workspace permission helpers
------------------------------------------------------------

CREATE OR REPLACE FUNCTION has_workspace_permission(p_workspace_id UUID, p_permission TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_permission TEXT := lower(p_permission);
  v_override BOOLEAN;
  v_role TEXT;
BEGIN
  IF p_workspace_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF auth.role() = 'service_role' THEN
    RETURN TRUE;
  END IF;

  IF v_user IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT wmp.granted
    INTO v_override
  FROM workspace_member_permissions wmp
  WHERE wmp.workspace_id = p_workspace_id
    AND wmp.user_id = v_user
    AND wmp.permission_key = v_permission;

  IF v_override IS NOT NULL THEN
    RETURN v_override;
  END IF;

  SELECT wm.role
    INTO v_role
  FROM workspace_members wm
  WHERE wm.workspace_id = p_workspace_id
    AND wm.user_id = v_user;

  IF v_role IS NULL THEN
    RETURN FALSE;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM workspace_role_permissions wrp
    WHERE wrp.workspace_id = p_workspace_id
      AND wrp.role_key = v_role
      AND wrp.permission_key = v_permission
  ) THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM workspace_role_permissions_global wrpg
    WHERE wrpg.role_key = v_role
      AND wrpg.permission_key = v_permission
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_workspace_folder_tree(p_workspace_id UUID)
RETURNS TABLE (
  id UUID,
  workspace_id UUID,
  parent_id UUID,
  name TEXT,
  slug TEXT,
  depth INTEGER,
  "position" INTEGER,
  path UUID[],
  is_archived BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT has_workspace_permission(p_workspace_id, 'folders.read') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT wf.id,
         wf.workspace_id,
         wf.parent_id,
         wf.name,
         wf.slug,
         wf.depth,
         wf.position,
         wf.path,
         wf.is_archived
  FROM workspace_folders wf
  WHERE wf.workspace_id = p_workspace_id
  ORDER BY wf.path;
END;
$$;

CREATE OR REPLACE FUNCTION get_folder_breadcrumbs(p_folder_id UUID)
RETURNS TABLE (
  id UUID,
  workspace_id UUID,
  name TEXT,
  slug TEXT,
  depth INTEGER,
  "position" INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_target workspace_folders%ROWTYPE;
BEGIN
  SELECT * INTO v_target
  FROM workspace_folders
  WHERE id = p_folder_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF NOT has_workspace_permission(v_target.workspace_id, 'folders.read') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT wf.id,
         wf.workspace_id,
         wf.name,
         wf.slug,
         wf.depth,
         wf.position
  FROM workspace_folders wf
  WHERE wf.id = ANY(v_target.path)
  ORDER BY wf.depth;
END;
$$;

------------------------------------------------------------
-- Workspace permission helpers
------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_effective_workspace_permissions(p_workspace_id UUID)
RETURNS TABLE (permission_key TEXT, granted_by TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN QUERY
    SELECT wp.key, 'service_role'
    FROM workspace_permissions wp;
    RETURN;
  END IF;

  IF v_user IS NULL THEN
    RETURN;
  END IF;

  IF NOT has_workspace_permission(p_workspace_id, 'workspace.view') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT wmp.permission_key,
         CASE WHEN wmp.granted THEN 'override:granted' ELSE 'override:denied' END
  FROM workspace_member_permissions wmp
  WHERE wmp.workspace_id = p_workspace_id
    AND wmp.user_id = v_user;

  RETURN QUERY
  SELECT DISTINCT wrpg.permission_key,
                  'role:' || wm.role || ':global'
  FROM workspace_members wm
  JOIN workspace_role_permissions_global wrpg
    ON wrpg.role_key = wm.role
  WHERE wm.workspace_id = p_workspace_id
    AND wm.user_id = v_user
    AND NOT EXISTS (
      SELECT 1
      FROM workspace_member_permissions wmp
      WHERE wmp.workspace_id = p_workspace_id
        AND wmp.user_id = v_user
        AND wmp.permission_key = wrpg.permission_key
    );

  RETURN QUERY
  SELECT DISTINCT wrp.permission_key,
                  'role:' || wrp.role_key || ':workspace'
  FROM workspace_role_permissions wrp
  JOIN workspace_members wm
    ON wm.workspace_id = wrp.workspace_id
   AND wm.role = wrp.role_key
  WHERE wrp.workspace_id = p_workspace_id
    AND wm.user_id = v_user
    AND NOT EXISTS (
      SELECT 1
      FROM workspace_member_permissions wmp
      WHERE wmp.workspace_id = p_workspace_id
        AND wmp.user_id = v_user
        AND wmp.permission_key = wrp.permission_key
    );
END;
$$;

------------------------------------------------------------
-- Workspace membership automation
------------------------------------------------------------

CREATE OR REPLACE FUNCTION ensure_workspace_owner_membership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO workspace_members (workspace_id, user_id, role, joined_at)
  VALUES (NEW.id, NEW.owner_id, 'owner', COALESCE(NEW.created_at, NOW()))
  ON CONFLICT (workspace_id, user_id) DO UPDATE
  SET role = 'owner';

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_workspace_owner_membership ON workspaces;
CREATE TRIGGER ensure_workspace_owner_membership
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION ensure_workspace_owner_membership();

CREATE OR REPLACE FUNCTION cleanup_workspace_member_permissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM workspace_member_permissions
  WHERE workspace_id = OLD.workspace_id
    AND user_id = OLD.user_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS cleanup_workspace_member_permissions ON workspace_members;
CREATE TRIGGER cleanup_workspace_member_permissions
  AFTER DELETE ON workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_workspace_member_permissions();

------------------------------------------------------------
-- Task folder relationship
------------------------------------------------------------

ALTER TABLE tasks
  ADD COLUMN folder_id UUID REFERENCES workspace_folders(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_folder ON tasks(folder_id);

CREATE OR REPLACE FUNCTION tasks_validate_folder()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_folder_workspace UUID;
BEGIN
  IF NEW.folder_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT workspace_id
    INTO v_folder_workspace
  FROM workspace_folders
  WHERE id = NEW.folder_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Folder % does not exist', NEW.folder_id;
  END IF;

  IF v_folder_workspace <> NEW.workspace_id THEN
    RAISE EXCEPTION 'Folder % belongs to a different workspace', NEW.folder_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tasks_validate_folder ON tasks;
CREATE TRIGGER tasks_validate_folder
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION tasks_validate_folder();

------------------------------------------------------------
-- Row Level Security updates
------------------------------------------------------------

ALTER TABLE workspace_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_member_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_role_permissions_global ENABLE ROW LEVEL SECURITY;

-- Drop legacy policies
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Workspace owners can update workspaces" ON workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete workspaces" ON workspaces;

DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Owners and admins can add workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Owners and admins can update member roles" ON workspace_members;
DROP POLICY IF EXISTS "Owners and admins can remove members" ON workspace_members;

DROP POLICY IF EXISTS "Users can view workspace categories" ON categories;
DROP POLICY IF EXISTS "Workspace members can create categories" ON categories;
DROP POLICY IF EXISTS "Workspace members can update categories" ON categories;
DROP POLICY IF EXISTS "Owners and admins can delete categories" ON categories;

DROP POLICY IF EXISTS "Users can view workspace tasks" ON tasks;
DROP POLICY IF EXISTS "Workspace members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Workspace members can update tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks or admins can delete any" ON tasks;

DROP POLICY IF EXISTS "Users can view task comments" ON comments;
DROP POLICY IF EXISTS "Workspace members can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

DROP POLICY IF EXISTS "Users can view task attachments" ON attachments;
DROP POLICY IF EXISTS "Workspace members can upload attachments" ON attachments;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON attachments;

-- Workspaces
CREATE POLICY "workspace_select" ON workspaces
FOR SELECT
USING (
  owner_id = auth.uid()
  OR has_workspace_permission(id, 'workspace.view')
);

CREATE POLICY "workspace_insert" ON workspaces
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "workspace_update" ON workspaces
FOR UPDATE
USING (has_workspace_permission(id, 'workspace.update'))
WITH CHECK (has_workspace_permission(id, 'workspace.update'));

CREATE POLICY "workspace_delete" ON workspaces
FOR DELETE
USING (has_workspace_permission(id, 'workspace.delete'));

-- Workspace members
CREATE POLICY "workspace_members_select" ON workspace_members
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'members.view')
);

CREATE POLICY "workspace_members_insert" ON workspace_members
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'workspace.manage_members')
  AND (
    role <> 'owner'
    OR has_workspace_permission(workspace_id, 'workspace.transfer_ownership')
  )
);

CREATE POLICY "workspace_members_update" ON workspace_members
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'workspace.manage_members')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'workspace.manage_members')
  AND (
    role <> 'owner'
    OR has_workspace_permission(workspace_id, 'workspace.transfer_ownership')
  )
);

CREATE POLICY "workspace_members_delete" ON workspace_members
FOR DELETE
USING (
  user_id = auth.uid()
  OR has_workspace_permission(workspace_id, 'workspace.manage_members')
);

-- Categories
CREATE POLICY "categories_select" ON categories
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'categories.read')
);

CREATE POLICY "categories_insert" ON categories
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'categories.create')
);

CREATE POLICY "categories_update" ON categories
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'categories.update')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'categories.update')
);

CREATE POLICY "categories_delete" ON categories
FOR DELETE
USING (
  has_workspace_permission(workspace_id, 'categories.delete')
);

-- Tasks
CREATE POLICY "tasks_select" ON tasks
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'tasks.read')
);

CREATE POLICY "tasks_insert" ON tasks
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'tasks.create')
  AND created_by = auth.uid()
);

CREATE POLICY "tasks_update" ON tasks
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'tasks.update')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'tasks.update')
);

CREATE POLICY "tasks_delete" ON tasks
FOR DELETE
USING (
  (created_by = auth.uid() AND has_workspace_permission(workspace_id, 'tasks.delete_own'))
  OR has_workspace_permission(workspace_id, 'tasks.delete_any')
);

-- Comments
CREATE POLICY "comments_select" ON comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM tasks
    WHERE tasks.id = comments.task_id
      AND has_workspace_permission(tasks.workspace_id, 'comments.read')
  )
);

CREATE POLICY "comments_insert" ON comments
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM tasks
    WHERE tasks.id = comments.task_id
      AND has_workspace_permission(tasks.workspace_id, 'comments.create')
  )
);

CREATE POLICY "comments_update" ON comments
FOR UPDATE
USING (
  (user_id = auth.uid() AND has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = comments.task_id),
      'comments.update_own'
  )) OR has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = comments.task_id),
      'comments.update_any'
  )
)
WITH CHECK (
  (user_id = auth.uid() AND has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = comments.task_id),
      'comments.update_own'
  )) OR has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = comments.task_id),
      'comments.update_any'
  )
);

CREATE POLICY "comments_delete" ON comments
FOR DELETE
USING (
  (user_id = auth.uid() AND has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = comments.task_id),
      'comments.delete_own'
  )) OR has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = comments.task_id),
      'comments.delete_any'
  )
);

-- Attachments
CREATE POLICY "attachments_select" ON attachments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM tasks
    WHERE tasks.id = attachments.task_id
      AND has_workspace_permission(tasks.workspace_id, 'attachments.read')
  )
);

CREATE POLICY "attachments_insert" ON attachments
FOR INSERT
WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM tasks
    WHERE tasks.id = attachments.task_id
      AND has_workspace_permission(tasks.workspace_id, 'attachments.create')
  )
);

CREATE POLICY "attachments_delete" ON attachments
FOR DELETE
USING (
  (uploaded_by = auth.uid() AND has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = attachments.task_id),
      'attachments.delete_own'
  )) OR has_workspace_permission(
      (SELECT workspace_id FROM tasks WHERE tasks.id = attachments.task_id),
      'attachments.delete_any'
  )
);

-- Workspace folders
CREATE POLICY "workspace_folders_select" ON workspace_folders
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'folders.read')
);

CREATE POLICY "workspace_folders_insert" ON workspace_folders
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'folders.create')
  AND created_by = auth.uid()
);

CREATE POLICY "workspace_folders_update" ON workspace_folders
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'folders.update')
  OR has_workspace_permission(workspace_id, 'folders.move')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'folders.update')
  OR has_workspace_permission(workspace_id, 'folders.move')
);

CREATE POLICY "workspace_folders_delete" ON workspace_folders
FOR DELETE
USING (
  has_workspace_permission(workspace_id, 'folders.delete')
);

-- Workspace member permissions overrides
CREATE POLICY "workspace_member_permissions_select" ON workspace_member_permissions
FOR SELECT
USING (
  user_id = auth.uid()
  OR has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

CREATE POLICY "workspace_member_permissions_insert" ON workspace_member_permissions
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

CREATE POLICY "workspace_member_permissions_update" ON workspace_member_permissions
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

CREATE POLICY "workspace_member_permissions_delete" ON workspace_member_permissions
FOR DELETE
USING (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

-- Workspace role permissions (workspace overrides)
CREATE POLICY "workspace_role_permissions_select" ON workspace_role_permissions
FOR SELECT
USING (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

CREATE POLICY "workspace_role_permissions_insert" ON workspace_role_permissions
FOR INSERT
WITH CHECK (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

CREATE POLICY "workspace_role_permissions_update" ON workspace_role_permissions
FOR UPDATE
USING (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
)
WITH CHECK (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

CREATE POLICY "workspace_role_permissions_delete" ON workspace_role_permissions
FOR DELETE
USING (
  has_workspace_permission(workspace_id, 'workspace.manage_permissions')
);

-- Global role permissions & role catalog: service role only
CREATE POLICY "global_role_permissions_access" ON workspace_role_permissions_global
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "workspace_roles_access" ON workspace_roles
FOR SELECT
USING (true);

CREATE POLICY "workspace_permissions_access" ON workspace_permissions
FOR SELECT
USING (true);
