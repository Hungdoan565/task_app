# TaskFlow - Modern Task Management App

A full-stack task management application built with React, TypeScript, and Supabase. Features include Kanban boards, calendar views, real-time collaboration, rich text editing, and file attachments.

## Tech Stack

### Frontend
- **React 18** with **TypeScript** - Type-safe component development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** + **shadcn/ui** - Beautiful, accessible UI components
- **TanStack Query** - Powerful data fetching and caching
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **@dnd-kit** - Drag and drop for Kanban board
- **Tiptap** - Rich text editor
- **React Big Calendar** - Calendar view
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** (PostgreSQL)
  - Authentication (Email, Google, GitHub OAuth)
  - Real-time subscriptions
  - Row Level Security (RLS)
  - File storage
  - Auto-generated REST APIs

## Features

- 🎨 **Modern Landing Page** - Professional introduction to the app
- 🔐 **Authentication** - Email/password and social login (Google, GitHub)
- 📋 **Kanban Board** - Drag-and-drop task management
- 📅 **Calendar View** - Visualize tasks by due date
- 📝 **Rich Text Editor** - Format task descriptions
- 📎 **File Attachments** - Upload and manage files
- 💬 **Real-time Comments** - Collaborate on tasks
- 👥 **Team Collaboration** - Workspaces and member management
- 🔍 **Search & Filters** - Find tasks quickly
- ⚡ **Real-time Sync** - Live updates across all devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier is sufficient)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd task-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the database migrations (see `/supabase/migrations/`)

6. Start the development server:
```bash
npm run dev
```

## Project Structure

```
task-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components
│   │   ├── tasks/           # Task-related components
│   │   ├── kanban/          # Kanban board components
│   │   ├── calendar/        # Calendar view components
│   │   ├── editor/          # Rich text editor
│   │   └── shared/          # Shared components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── store/               # State management
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Root component
├── supabase/
│   ├── migrations/          # Database migrations
│   └── seed.sql             # Seed data
└── public/                  # Static assets
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Deployment

### Frontend (Vercel/Netlify)

1. Connect your Git repository
2. Set environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
3. Deploy!

### Backend (Supabase)

Supabase handles all backend infrastructure:
- Database hosting
- Authentication
- Real-time subscriptions
- File storage
- Edge functions

## Environment Variables

```env
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anon/public key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your portfolio or learning.

## Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)

