# Workspace Actions UX Design

## Goals
- Provide professional workspace management directly from the sidebar.
- Support keyboard, mouse, and context-menu interactions for power users.
- Reuse existing dialog/toast/confirm patterns for consistency.

## Target Actions

| Action | Entry Point | Behavior |
| --- | --- | --- |
| Open workspace | Primary click; `Enter` | Set current workspace, close menu. |
| Rename / edit details | Context menu, inline trigger | Open `WorkspaceDialog` (new) prefilled with name + description. |
| Invite members | Context menu | Trigger existing `InviteMemberDialog` using global store. |
| Archive workspace | Context menu | (Future) mark as archived; hide from default list. |
| Delete workspace | Context menu | Show destructive confirmation; call `deleteWorkspace`. |
| Leave workspace | Context menu (non-owners) | Show confirmation; call leave mutation (future). |

## Interaction Model
- Right-click (`ContextMenu`) on workspace row reveals actions.
- Secondary action button (ellipsis) mirrors the same menu for accessibility on touch devices.
- Menu uses `@/components/ui/context-menu` to align with existing folder interactions.
- Keyboard support:
  - `Shift+F10` opens context menu when workspace item focused.
  - `Delete` triggers removal when menu focused (after confirm).

## Dialog & Confirmation
- **Rename**: new shared dialog component `WorkspaceDialog` with `react-hook-form` + `zod` validation mirroring `CreateWorkspaceDialog` styling.
- **Delete**: `useConfirmDialog` with destructive variant; message highlights irreversibility and task deletion.
- **Archive**: when implemented, reuses confirm dialog but non-destructive variant (info).

## State Management
- Extend `useStore` with `workspaceDialog` state to open rename dialog.
- `useWorkspaces` already exposes `updateWorkspace`, `deleteWorkspace`; add optimistic cache updates to keep UI in sync.
- After delete:
  - Remove workspace from query cache manually to avoid flicker.
  - If deleted workspace is current, automatically select next workspace (or null).

## Visual Treatment
- Selected workspace row uses `bg-primary/10` highlight (existing).
- Context menu icons: `Pencil`, `UserPlus`, `Archive`, `Trash2` for clarity.
- Disabled states for actions user lacks permission for (owner only for destructive actions).

## Edge Cases
- User without permission sees disabled `Invite`, `Delete` entries with tooltip explaining why.
- When last workspace deleted: auto-open create workspace dialog and display empty state.
- Supabase errors surfaced through existing toast system with localized messages.


