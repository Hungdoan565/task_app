-- This file contains sample data for development/testing
-- Run this AFTER setting up your database schema

-- Note: You'll need to replace the UUID values with actual user IDs after creating test users

-- Sample categories (you'll need to update workspace_id after creating workspaces)
-- INSERT INTO categories (workspace_id, name, color) VALUES
--   ('your-workspace-id', 'Frontend', '#3B82F6'),
--   ('your-workspace-id', 'Backend', '#10B981'),
--   ('your-workspace-id', 'Design', '#F59E0B'),
--   ('your-workspace-id', 'Bug', '#EF4444');

-- Sample tasks (update workspace_id and user IDs accordingly)
-- INSERT INTO tasks (workspace_id, title, description, status, priority, created_by) VALUES
--   ('your-workspace-id', 'Setup project structure', 'Initialize the project with all necessary dependencies', 'done', 'high', 'your-user-id'),
--   ('your-workspace-id', 'Design database schema', 'Create tables and relationships for the application', 'done', 'high', 'your-user-id'),
--   ('your-workspace-id', 'Implement authentication', 'Add login and signup functionality', 'in_progress', 'high', 'your-user-id'),
--   ('your-workspace-id', 'Build Kanban board', 'Create drag and drop Kanban board interface', 'todo', 'medium', 'your-user-id'),
--   ('your-workspace-id', 'Add calendar view', 'Implement calendar view for tasks', 'todo', 'medium', 'your-user-id');

-- To use this seed file:
-- 1. Create a test user account in Supabase Auth
-- 2. Create a workspace
-- 3. Get the workspace ID and user ID
-- 4. Uncomment and update the INSERT statements above
-- 5. Run this SQL in the Supabase SQL Editor

