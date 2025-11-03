# Supabase Setup Guide

This guide will walk you through setting up Supabase for the TaskFlow application.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: TaskFlow (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is perfect for this project
4. Click "Create new project"
5. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `VITE_SUPABASE_URL`
   - **anon public key**: `VITE_SUPABASE_ANON_KEY`
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor**
2. Run each migration file in order:

### Migration 1: Initial Schema
- Open `supabase/migrations/001_initial_schema.sql`
- Copy the entire content
- Paste into the SQL Editor
- Click "Run"
- You should see: "Success. No rows returned"

### Migration 2: Row Level Security
- Open `supabase/migrations/002_row_level_security.sql`
- Copy the entire content
- Paste into the SQL Editor
- Click "Run"
- You should see: "Success. No rows returned"

### Migration 3: Storage Setup
- Open `supabase/migrations/003_storage_setup.sql`
- Copy the entire content
- Paste into the SQL Editor
- Click "Run"
- You should see: "Success. No rows returned"

## Step 4: Configure Authentication

### Enable Email Authentication
1. Go to **Authentication** → **Providers**
2. Email provider should be enabled by default
3. Configure Email Templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation and recovery email templates

### Enable Google OAuth (Optional but Recommended)
1. Go to **Authentication** → **Providers**
2. Find "Google" and click "Enable"
3. You'll need to:
   - Create a Google Cloud Project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### Enable GitHub OAuth (Optional but Recommended)
1. Go to **Authentication** → **Providers**
2. Find "GitHub" and click "Enable"
3. You'll need to:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth App
   - Authorization callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

## Step 5: Configure Storage

1. Go to **Storage** in your Supabase dashboard
2. You should see a bucket named `task-attachments` (created by migration)
3. If not, create it:
   - Click "New bucket"
   - Name: `task-attachments`
   - Public: No (private bucket)
   - File size limit: 50MB (or your preference)
   - Allowed MIME types: Leave empty for all types or specify (e.g., `image/*`, `application/pdf`)

## Step 6: Verify Setup

### Test Database Connection
Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- profiles
- workspaces
- workspace_members
- categories
- tasks
- comments
- attachments

### Test Authentication
1. In your app, try to sign up with email
2. Check **Authentication** → **Users** in Supabase
3. You should see the new user
4. Check **Database** → **Table Editor** → **profiles**
5. The profile should be auto-created (via trigger)

## Step 7: Create Your First Workspace (Manual)

Since you're the first user, you'll need to manually create a workspace:

1. Go to **Database** → **Table Editor** → **workspaces**
2. Click "Insert row"
3. Fill in:
   - **name**: "My Workspace"
   - **owner_id**: Your user ID (get from profiles table)
4. Click "Save"
5. Copy the workspace ID

6. Go to **workspace_members** table
7. Click "Insert row"
8. Fill in:
   - **workspace_id**: The ID from step 5
   - **user_id**: Your user ID
   - **role**: owner
9. Click "Save"

## Troubleshooting

### "relation does not exist" error
- Make sure you ran all migrations in order
- Check if tables were created: Go to **Database** → **Tables**

### Authentication not working
- Verify your .env file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Make sure you're using the **anon** key, not the **service_role** key
- Check if email confirmation is required: **Authentication** → **Settings** → **Email Auth**

### RLS Policy errors
- Make sure you're authenticated (logged in)
- Check if policies were created: Go to **Database** → **Tables** → select a table → **Policies** tab
- Each table should have multiple policies

### Storage not working
- Verify the `task-attachments` bucket exists
- Check storage policies in **Storage** → **Policies**
- Make sure you're authenticated when uploading

## Production Checklist

Before deploying to production:

- [ ] Change database password to a strong password
- [ ] Enable database backups (automatic in Supabase)
- [ ] Set up custom email SMTP (optional, for branded emails)
- [ ] Configure OAuth apps for production URLs
- [ ] Review and test all RLS policies
- [ ] Set appropriate storage limits
- [ ] Monitor usage in Supabase dashboard
- [ ] Consider upgrading to Pro plan if needed (for better performance and limits)

## Useful SQL Queries

### Get all workspaces for current user
```sql
SELECT w.* 
FROM workspaces w
INNER JOIN workspace_members wm ON wm.workspace_id = w.id
WHERE wm.user_id = auth.uid();
```

### Get all tasks in a workspace
```sql
SELECT t.*, 
  c.name as category_name,
  p1.full_name as creator_name,
  p2.full_name as assignee_name
FROM tasks t
LEFT JOIN categories c ON c.id = t.category_id
LEFT JOIN profiles p1 ON p1.id = t.created_by
LEFT JOIN profiles p2 ON p2.id = t.assigned_to
WHERE t.workspace_id = 'your-workspace-id'
ORDER BY t.position;
```

### Count tasks by status
```sql
SELECT status, COUNT(*) 
FROM tasks 
WHERE workspace_id = 'your-workspace-id'
GROUP BY status;
```

## Next Steps

Now that Supabase is set up, you can:
1. Start the development server: `npm run dev`
2. Test authentication flow
3. Create workspaces and tasks
4. Implement the frontend features

For more information, visit:
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

