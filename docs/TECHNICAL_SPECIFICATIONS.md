# TaskFlow - Technical Specifications & Standards
**Version:** 1.0  
**Last Updated:** November 3, 2025

---

## I. TECHNOLOGY STACK

### Frontend Core
```json
{
  "framework": "React 18.2+",
  "language": "TypeScript 5.0+",
  "bundler": "Vite 4.0+",
  "routing": "React Router v6",
  "state": "Zustand + TanStack Query"
}
```

### UI & Styling
```json
{
  "css": "TailwindCSS 3.3+",
  "components": "shadcn/ui",
  "icons": "Lucide React",
  "animations": "Framer Motion",
  "forms": "React Hook Form + Zod"
}
```

### Backend & Services
```json
{
  "backend": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime"
}
```

### Development Tools
```json
{
  "packageManager": "npm",
  "linting": "ESLint",
  "formatting": "Prettier",
  "typeChecking": "TypeScript strict mode"
}
```

---

## II. PROJECT STRUCTURE

```
task-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── auth/            # Authentication-specific
│   │   ├── layout/          # Layout wrappers (Navbar, Sidebar)
│   │   ├── tasks/           # Task-related components
│   │   └── workspace/       # Workspace-related components
│   ├── pages/               # Route pages (Landing, Features, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   │   ├── supabase.ts      # Supabase client
│   │   ├── utils.ts         # General utilities
│   │   ├── analytics.ts     # Analytics helpers (new)
│   │   └── webVitals.ts     # Performance monitoring (new)
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global CSS + Tailwind imports
├── public/
│   ├── images/              # Screenshots, demos (new)
│   ├── logos/               # Client logos (new)
│   ├── robots.txt           # SEO (new)
│   └── sitemap.xml          # SEO (new)
├── docs/                    # Project documentation (new)
├── supabase/
│   └── migrations/          # Database migrations
├── .env.example             # Environment variables template
└── vite.config.ts           # Vite configuration
```

---

## III. CODING STANDARDS

### TypeScript Guidelines

#### 1. Type Safety
```typescript
// ✅ Good: Explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

function updateProfile(data: UserProfile): Promise<void> {
  // implementation
}

// ❌ Bad: Using 'any'
function updateProfile(data: any) {
  // implementation
}
```

#### 2. Component Props
```typescript
// ✅ Good: Interface for props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md',
  ...props 
}: ButtonProps) {
  // implementation
}
```

#### 3. Async Functions
```typescript
// ✅ Good: Proper error handling
async function fetchTasks(workspaceId: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}
```

---

### React Component Guidelines

#### 1. Component Structure
```typescript
import { useState, useEffect } from 'react';
import { ComponentProps } from './types';

// 1. Interfaces/Types
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

// 2. Component
export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  // 3. Hooks (in order: state, context, custom hooks)
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  
  // 4. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 5. Event handlers
  const handleSave = () => {
    // implementation
  };
  
  // 6. Render helpers
  const renderActions = () => {
    // implementation
  };
  
  // 7. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### 2. File Naming
```
PascalCase for components:    TaskCard.tsx
camelCase for utilities:      formatDate.ts
camelCase for hooks:          useAuth.ts
kebab-case for CSS:           task-card.css
```

#### 3. Import Order
```typescript
// 1. External libraries
import { useState } from 'react';
import { motion } from 'framer-motion';

// 2. Internal components
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/tasks/TaskCard';

// 3. Hooks
import { useAuth } from '@/hooks/useAuth';

// 4. Utils
import { formatDate } from '@/lib/utils';

// 5. Types
import type { Task } from '@/types';

// 6. Assets
import logo from './assets/logo.svg';
```

---

### CSS/Tailwind Guidelines

#### 1. Tailwind Class Order
```tsx
<div className={`
  // Layout
  flex flex-col items-center justify-between
  
  // Spacing
  p-4 gap-2
  
  // Sizing
  w-full max-w-md h-auto
  
  // Typography
  text-lg font-semibold text-slate-900
  
  // Visual
  bg-white border border-slate-200 rounded-lg shadow-sm
  
  // Interactive
  hover:shadow-md transition-all duration-200
  cursor-pointer
`}>
  Content
</div>
```

#### 2. Custom Classes (when needed)
```css
/* Use @apply for repeated patterns */
.btn-primary {
  @apply px-4 py-2 bg-indigo-600 text-white rounded-lg;
  @apply hover:bg-indigo-700 transition-colors;
  @apply focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
```

#### 3. Responsive Design
```tsx
// Mobile-first approach
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  Content
</div>
```

---

## IV. PERFORMANCE STANDARDS

### Metrics Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Performance | >90 | Chrome DevTools |
| Lighthouse Accessibility | >95 | Chrome DevTools |
| Lighthouse Best Practices | >90 | Chrome DevTools |
| Lighthouse SEO | >95 | Chrome DevTools |
| First Contentful Paint (FCP) | <1.8s | Web Vitals |
| Largest Contentful Paint (LCP) | <2.5s | Web Vitals |
| Cumulative Layout Shift (CLS) | <0.1 | Web Vitals |
| First Input Delay (FID) | <100ms | Web Vitals |
| Time to Interactive (TTI) | <3.8s | Lighthouse |
| Total Bundle Size (initial) | <200KB | Vite build |

### Optimization Techniques

#### 1. Code Splitting
```typescript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Features = lazy(() => import('./pages/Features'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

#### 2. Image Optimization
```tsx
// Use WebP with fallback
<picture>
  <source srcSet="/images/hero.webp" type="image/webp" />
  <img src="/images/hero.jpg" alt="Hero" loading="lazy" />
</picture>

// Or modern img with srcset
<img
  src="/images/hero.jpg"
  srcSet="/images/hero@2x.jpg 2x"
  alt="Hero"
  loading="lazy"
  width={800}
  height={600}
/>
```

#### 3. Memoization
```typescript
// Expensive calculations
const filteredTasks = useMemo(() => {
  return tasks.filter(task => task.status === filter);
}, [tasks, filter]);

// Callbacks to prevent re-renders
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

#### 4. Virtual Scrolling
```typescript
// For long lists (>100 items)
import { useVirtualizer } from '@tanstack/react-virtual';

function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <TaskCard key={virtualItem.key} task={tasks[virtualItem.index]} />
        ))}
      </div>
    </div>
  );
}
```

---

## V. ACCESSIBILITY STANDARDS (WCAG 2.1 AA)

### Checklist

#### Perceivable
- [ ] All images have meaningful alt text
- [ ] Color is not the only means of conveying information
- [ ] Text has contrast ratio ≥4.5:1 (normal), ≥3:1 (large)
- [ ] Content is adaptable (works at 200% zoom)

#### Operable
- [ ] All functionality available from keyboard
- [ ] Skip to main content link present
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps

#### Understandable
- [ ] Page language is specified (`<html lang="vi">`)
- [ ] Form labels are clear
- [ ] Error messages are descriptive
- [ ] Navigation is consistent

#### Robust
- [ ] Valid HTML/ARIA
- [ ] Compatible with assistive technologies
- [ ] No console errors

### Testing Tools
- **axe DevTools**: Browser extension for automated testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Accessibility audit
- **Screen readers**: NVDA (Windows), VoiceOver (Mac)

---

## VI. SECURITY STANDARDS

### Authentication
```typescript
// ✅ Store tokens securely
// Supabase handles this automatically via httpOnly cookies

// ✅ Validate user input
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  name: z.string().min(2).max(100),
});

// ❌ Never store sensitive data in localStorage
localStorage.setItem('password', '...'); // NEVER DO THIS
```

### Data Sanitization
```typescript
// ✅ Sanitize user input before display
import DOMPurify from 'dompurify';

function DisplayComment({ text }: { text: string }) {
  const cleanHtml = DOMPurify.sanitize(text);
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can only see tasks in their workspaces
CREATE POLICY "Users can view their workspace tasks"
ON tasks FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members 
    WHERE user_id = auth.uid()
  )
);
```

---

## VII. TESTING STANDARDS

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('15/01/2024');
  });
  
  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('N/A');
  });
});
```

### Component Tests (React Testing Library)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests (Playwright - Optional)
```typescript
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/signup');
  
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

---

## VIII. GIT WORKFLOW

### Branch Naming
```
feature/add-pricing-table
fix/auth-redirect-bug
refactor/dashboard-components
docs/update-readme
chore/upgrade-dependencies
```

### Commit Messages
```
feat: Add password strength indicator
fix: Resolve infinite loop in useAuth hook
refactor: Extract TaskCard logic into custom hook
docs: Update API documentation
chore: Upgrade React to 18.3
style: Fix inconsistent spacing in Dashboard
test: Add unit tests for formatDate utility
perf: Optimize task list rendering with virtualization
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested
- [ ] Mobile responsive verified

## Screenshots (if applicable)
[Attach screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] No console errors
- [ ] Documentation updated
```

---

## IX. DEPLOYMENT

### Build Process
```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Preview build
npm run preview
```

### Environment Variables
```bash
# .env.example
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## X. MONITORING & MAINTENANCE

### Analytics Events to Track
```typescript
// User journey
- Page views
- Signup completed
- First task created
- First workspace created
- Invite sent
- Feature used (kanban, calendar, etc.)

// Business metrics
- Conversion rate (visitor → signup)
- Activation rate (signup → first task)
- Retention (DAU, WAU, MAU)
- Feature adoption

// Performance
- Web Vitals (LCP, FID, CLS)
- API response times
- Error rates
```

### Error Monitoring
```typescript
// Critical errors to monitor
- Authentication failures
- Database connection errors
- File upload failures
- Payment processing errors
- API rate limits exceeded
```

### Performance Monitoring
```typescript
// Regular checks
- Lighthouse audits (weekly)
- Bundle size analysis (per deploy)
- Page load times (continuous)
- Core Web Vitals (continuous)
- API response times (continuous)
```

---

## XI. DOCUMENTATION REQUIREMENTS

### Code Documentation
```typescript
/**
 * Fetches tasks for a specific workspace
 * 
 * @param workspaceId - The UUID of the workspace
 * @param options - Optional filters and sorting
 * @returns Promise resolving to array of tasks
 * @throws {Error} If workspace doesn't exist or user lacks permission
 * 
 * @example
 * ```typescript
 * const tasks = await fetchTasks('workspace-123', { 
 *   status: 'todo',
 *   sortBy: 'due_date' 
 * });
 * ```
 */
async function fetchTasks(
  workspaceId: string,
  options?: TaskFetchOptions
): Promise<Task[]> {
  // implementation
}
```

### Component Documentation (Storybook - Optional)
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

---

## XII. CHECKLIST FOR NEW FEATURES

Before merging any new feature:

### Development
- [ ] TypeScript: No `any` types, all props typed
- [ ] Code follows project structure
- [ ] No console.log in production code
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Empty states handled

### Testing
- [ ] Unit tests written (if applicable)
- [ ] Manual testing completed
- [ ] Works on Chrome, Firefox, Safari
- [ ] Mobile responsive (375px - 1920px)
- [ ] Touch interactions work

### Performance
- [ ] Images optimized (WebP, lazy loading)
- [ ] No unnecessary re-renders
- [ ] Code splitting used (if large component)
- [ ] Bundle size impact checked

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Screen reader tested

### SEO (for public pages)
- [ ] Meta tags updated
- [ ] Semantic HTML used
- [ ] Headings hierarchy correct
- [ ] Sitemap updated

### Analytics
- [ ] Key events tracked
- [ ] Conversions measured
- [ ] Error tracking configured

### Documentation
- [ ] README updated (if needed)
- [ ] API changes documented
- [ ] Comments added for complex logic

---

**This document is a living standard. Update as the project evolves.**

