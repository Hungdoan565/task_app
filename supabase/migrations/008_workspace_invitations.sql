-- Workspace invitations support for member onboarding

CREATE TABLE IF NOT EXISTS workspace_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role_key TEXT NOT NULL REFERENCES workspace_roles(key) ON DELETE RESTRICT,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'revoked')),
  token UUID NOT NULL DEFAULT uuid_generate_v4(),
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspace_invitations_workspace
  ON workspace_invitations (workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_invitations_email
  ON workspace_invitations (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS idx_workspace_invitations_pending_unique
  ON workspace_invitations (workspace_id, lower(email))
  WHERE status = 'pending';

CREATE OR REPLACE FUNCTION workspace_invitations_before_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.id := COALESCE(NEW.id, uuid_generate_v4());
    NEW.token := COALESCE(NEW.token, uuid_generate_v4());
    NEW.invited_at := COALESCE(NEW.invited_at, NOW());
    NEW.invited_by := COALESCE(NEW.invited_by, auth.uid());
  END IF;

  NEW.email := lower(trim(NEW.email));
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_workspace_invitations_before_write ON workspace_invitations;
CREATE TRIGGER trg_workspace_invitations_before_write
  BEFORE INSERT OR UPDATE ON workspace_invitations
  FOR EACH ROW
  EXECUTE FUNCTION workspace_invitations_before_write();

ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View workspace invitations"
  ON workspace_invitations
  FOR SELECT
  USING (has_workspace_permission(workspace_id, 'workspace.manage_members'));

CREATE POLICY "Create workspace invitations"
  ON workspace_invitations
  FOR INSERT
  WITH CHECK (has_workspace_permission(workspace_id, 'workspace.invite_members'));

CREATE POLICY "Manage workspace invitations"
  ON workspace_invitations
  FOR UPDATE
  USING (has_workspace_permission(workspace_id, 'workspace.manage_members'))
  WITH CHECK (has_workspace_permission(workspace_id, 'workspace.manage_members'));

CREATE POLICY "Delete workspace invitations"
  ON workspace_invitations
  FOR DELETE
  USING (has_workspace_permission(workspace_id, 'workspace.manage_members'));


