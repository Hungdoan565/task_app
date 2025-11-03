-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view all profiles (needed for assigning tasks)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- WORKSPACES POLICIES
-- ============================================

-- Users can view workspaces they are members of
CREATE POLICY "Users can view workspaces they belong to"
  ON workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Users can create new workspaces
CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only workspace owners can update workspaces
CREATE POLICY "Workspace owners can update workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = owner_id);

-- Only workspace owners can delete workspaces
CREATE POLICY "Workspace owners can delete workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- WORKSPACE MEMBERS POLICIES
-- ============================================

-- Users can view members of workspaces they belong to
CREATE POLICY "Users can view workspace members"
  ON workspace_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
    )
  );

-- Workspace owners and admins can add members
CREATE POLICY "Owners and admins can add workspace members"
  ON workspace_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_members.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Workspace owners and admins can update member roles
CREATE POLICY "Owners and admins can update member roles"
  ON workspace_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

-- Workspace owners and admins can remove members
CREATE POLICY "Owners and admins can remove members"
  ON workspace_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CATEGORIES POLICIES
-- ============================================

-- Users can view categories in workspaces they belong to
CREATE POLICY "Users can view workspace categories"
  ON categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = categories.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members can create categories
CREATE POLICY "Workspace members can create categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = categories.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members can update categories
CREATE POLICY "Workspace members can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = categories.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace owners and admins can delete categories
CREATE POLICY "Owners and admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = categories.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- TASKS POLICIES
-- ============================================

-- Users can view tasks in workspaces they belong to
CREATE POLICY "Users can view workspace tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tasks.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members can create tasks
CREATE POLICY "Workspace members can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tasks.workspace_id
        AND workspace_members.user_id = auth.uid()
    ) AND auth.uid() = created_by
  );

-- Workspace members can update tasks
CREATE POLICY "Workspace members can update tasks"
  ON tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tasks.workspace_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Task creators, assignees, and workspace admins can delete tasks
CREATE POLICY "Users can delete their own tasks or admins can delete any"
  ON tasks FOR DELETE
  USING (
    auth.uid() = created_by OR
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = tasks.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- COMMENTS POLICIES
-- ============================================

-- Users can view comments on tasks in their workspaces
CREATE POLICY "Users can view task comments"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN workspace_members ON workspace_members.workspace_id = tasks.workspace_id
      WHERE tasks.id = comments.task_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members can create comments
CREATE POLICY "Workspace members can create comments"
  ON comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN workspace_members ON workspace_members.workspace_id = tasks.workspace_id
      WHERE tasks.id = comments.task_id
        AND workspace_members.user_id = auth.uid()
    ) AND auth.uid() = user_id
  );

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own comments, or admins can delete any
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN workspace_members ON workspace_members.workspace_id = tasks.workspace_id
      WHERE tasks.id = comments.task_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ATTACHMENTS POLICIES
-- ============================================

-- Users can view attachments on tasks in their workspaces
CREATE POLICY "Users can view task attachments"
  ON attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN workspace_members ON workspace_members.workspace_id = tasks.workspace_id
      WHERE tasks.id = attachments.task_id
        AND workspace_members.user_id = auth.uid()
    )
  );

-- Workspace members can upload attachments
CREATE POLICY "Workspace members can upload attachments"
  ON attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN workspace_members ON workspace_members.workspace_id = tasks.workspace_id
      WHERE tasks.id = attachments.task_id
        AND workspace_members.user_id = auth.uid()
    ) AND auth.uid() = uploaded_by
  );

-- Users can delete their own attachments, or admins can delete any
CREATE POLICY "Users can delete their own attachments"
  ON attachments FOR DELETE
  USING (
    auth.uid() = uploaded_by OR
    EXISTS (
      SELECT 1 FROM tasks
      INNER JOIN workspace_members ON workspace_members.workspace_id = tasks.workspace_id
      WHERE tasks.id = attachments.task_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
    )
  );

