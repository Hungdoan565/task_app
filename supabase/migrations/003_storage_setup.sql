-- Create storage bucket for task attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', false);

-- Allow authenticated users to upload files to their workspace's tasks
CREATE POLICY "Workspace members can upload attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'task-attachments' AND
    auth.role() = 'authenticated'
  );

-- Allow users to view attachments in their workspace
CREATE POLICY "Users can view workspace attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'task-attachments' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own attachments
CREATE POLICY "Users can delete their own attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'task-attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

