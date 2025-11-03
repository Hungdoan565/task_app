# Phase 1: Quick Wins - Implementation Guide
**Timeline:** Week 1-2 (7-9 days)  
**Goal:** Fix high-impact, low-effort gaps to improve conversion & trust

---

## Sprint 1.1: Visual Proof & Trust (3-4 days)

### 1. Add Product Screenshots to Landing Hero

#### Objective
Tăng conversion rate 30-50% bằng cách cho users thấy product thực tế ngay từ hero section.

#### Technical Implementation

**File:** `src/pages/Landing.tsx`

**Location:** Insert after hero text, before features section

```tsx
// Add to Landing.tsx after hero CTA buttons

<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="relative mt-16 max-w-6xl mx-auto"
>
  <div className="relative">
    {/* Main dashboard screenshot */}
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
      <img
        src="/images/dashboard-screenshot.png"
        alt="TaskFlow Dashboard Interface"
        className="w-full h-auto"
        loading="eager"
      />
    </div>
    
    {/* Floating feature cards */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
      className="absolute -left-4 top-20 md:-left-12 md:top-32 
                 bg-white rounded-xl shadow-xl p-4 max-w-xs hidden md:block"
    >
      <div className="flex items-center gap-3">
        <CheckCircle className="h-8 w-8 text-green-500" />
        <div>
          <p className="font-semibold text-sm">Task Completed</p>
          <p className="text-xs text-muted-foreground">Website Redesign</p>
        </div>
      </div>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="absolute -right-4 bottom-20 md:-right-12 md:bottom-32 
                 bg-white rounded-xl shadow-xl p-4 max-w-xs hidden md:block"
    >
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-indigo-500" />
        <div>
          <p className="font-semibold text-sm">Due Tomorrow</p>
          <p className="text-xs text-muted-foreground">Client Presentation</p>
        </div>
      </div>
    </motion.div>
  </div>
</motion.div>
```

**Assets Needed:**
- `public/images/dashboard-screenshot.png` (1920x1080, optimized WebP)
- `public/images/dashboard-screenshot@2x.png` (retina)

**Design Requirements:**
- Clean, blur sensitive data
- Show realistic task names (not Lorem Ipsum)
- Include branding elements
- Light mode (match landing design)

---

### 2. Add Comparison Table to Pricing Page

#### Objective
Render existing `comparisonFeatures` data để users dễ dàng so sánh plans.

#### Technical Implementation

**File:** `src/pages/Pricing.tsx`

**Location:** Insert after pricing cards, before FAQ

```tsx
// Add component above export default
interface ComparisonTableProps {
  features: Array<{
    label: string;
    free: string | boolean;
    pro: string | boolean;
    ai: string | boolean;
  }>;
}

function ComparisonTable({ features }: ComparisonTableProps) {
  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <span className="text-slate-300 text-2xl">—</span>
      );
    }
    return <span className="text-sm text-slate-700">{value}</span>;
  };

  return (
    <section className="px-4 pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            So sánh chi tiết các gói
          </h2>
          <p className="text-muted-foreground">
            Xem đầy đủ tính năng theo từng gói
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-900">
                  Tính năng
                </th>
                <th className="text-center p-4 font-semibold text-slate-900 w-1/4">
                  Free
                </th>
                <th className="text-center p-4 font-semibold text-indigo-600 w-1/4 bg-indigo-50">
                  Pro
                </th>
                <th className="text-center p-4 font-semibold text-slate-900 w-1/4">
                  AI Premium
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr
                  key={feature.label}
                  className={`border-b border-slate-100 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="p-4 font-medium text-slate-700">
                    {feature.label}
                  </td>
                  <td className="p-4 text-center">
                    {renderCell(feature.free)}
                  </td>
                  <td className="p-4 text-center bg-indigo-50/30">
                    {renderCell(feature.pro)}
                  </td>
                  <td className="p-4 text-center">
                    {renderCell(feature.ai)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// Insert in main component after pricing tiers section:
<ComparisonTable features={comparisonFeatures} />
```

**Effort:** 1-2 hours  
**Impact:** High - Clarity in decision making

---

### 3. Add Customer Logos to Landing

#### Objective
Social proof through recognizable brand logos.

#### Technical Implementation

**File:** `src/pages/Landing.tsx`

**Location:** Insert after hero, before features section

```tsx
// Add after hero section, before features

<section className="py-16 bg-slate-50">
  <div className="container mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-8">
        Được tin dùng bởi các đội nhóm hàng đầu
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all">
        {[
          { name: 'VietFin', logo: '/logos/vietfin.svg' },
          { name: 'Galaxy Studio', logo: '/logos/galaxy.svg' },
          { name: 'Nova Logistics', logo: '/logos/nova.svg' },
          { name: 'AI Labs', logo: '/logos/ailabs.svg' },
          { name: 'Flow Media', logo: '/logos/flowmedia.svg' },
          { name: 'NextWave', logo: '/logos/nextwave.svg' },
        ].map((client) => (
          <div
            key={client.name}
            className="flex items-center justify-center h-12"
          >
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-full w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </motion.div>
  </div>
</section>
```

**Assets Needed:**
- Create 6 logo SVGs in `/public/logos/`
- Grayscale or monochrome versions
- Consistent height (~40-50px)

**Design Notes:**
- If can't get real client logos, use placeholder companies
- Ensure legal permission to use logos
- Link to case studies if available

---

### 4. Create Custom 404 Page

#### Objective
Better UX when users hit broken links + brand consistency.

#### Technical Implementation

**New File:** `src/pages/NotFound.tsx`

```tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import NavigationBar from "@/components/layout/NavigationBar";
import SEO from "@/components/SEO";

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 - Không Tìm Thấy Trang"
        description="Trang bạn đang tìm kiếm không tồn tại."
        path="/404"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <NavigationBar />
        
        <main className="pt-32 pb-24 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 404 Illustration */}
              <div className="mb-8">
                <p className="text-9xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  404
                </p>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Oops! Trang không tồn tại
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                Có vẻ như bạn đã đi lạc đường. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
              </p>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Về Trang Chủ
                  </Link>
                </Button>
                
                <Button asChild variant="outline">
                  <Link to="/contact">
                    <Search className="h-4 w-4 mr-2" />
                    Liên Hệ Hỗ Trợ
                  </Link>
                </Button>
              </div>
              
              {/* Helpful links */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-4">
                  Hoặc khám phá các trang phổ biến:
                </p>
                <div className="flex flex-wrap gap-4 justify-center text-sm">
                  <Link to="/features" className="text-indigo-600 hover:underline">
                    Tính Năng
                  </Link>
                  <Link to="/pricing" className="text-indigo-600 hover:underline">
                    Bảng Giá
                  </Link>
                  <Link to="/about" className="text-indigo-600 hover:underline">
                    Về Chúng Tôi
                  </Link>
                  <Link to="/dashboard" className="text-indigo-600 hover:underline">
                    Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
```

**Update:** `src/App.tsx`

```tsx
// Add import
import NotFound from "./pages/NotFound";

// Replace the catch-all route
<Route path="*" element={<NotFound />} />
```

**Effort:** 1 hour  
**Impact:** Medium - Better UX + brand consistency

---

### 5. Add Password Strength Indicator to Auth

#### Objective
Improve security UX and reduce weak passwords.

#### Technical Implementation

**New File:** `src/components/auth/PasswordStrength.tsx`

```tsx
import { useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  show?: boolean;
}

export default function PasswordStrength({ password, show = true }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    const labels = ["Rất yếu", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];
    
    return {
      score: Math.min(score, 4),
      label: labels[Math.min(score, 4)],
      color: colors[Math.min(score, 4)],
    };
  }, [password]);
  
  const requirements = [
    { met: password.length >= 8, label: "Tối thiểu 8 ký tự" },
    { met: /[a-z]/.test(password) && /[A-Z]/.test(password), label: "Chữ hoa và chữ thường" },
    { met: /[0-9]/.test(password), label: "Ít nhất 1 số" },
    { met: /[^a-zA-Z0-9]/.test(password), label: "Ít nhất 1 ký tự đặc biệt" },
  ];
  
  if (!show || !password) return null;
  
  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= strength.score ? strength.color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      
      {/* Label */}
      <p className="text-xs font-medium text-slate-600">
        Độ mạnh: <span className={strength.score >= 3 ? "text-green-600" : "text-orange-600"}>
          {strength.label}
        </span>
      </p>
      
      {/* Requirements */}
      <div className="space-y-1">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
            {req.met ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <X className="h-3 w-3 text-slate-300" />
            )}
            <span className={req.met ? "text-green-600" : ""}>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Update:** `src/pages/Auth.tsx`

```tsx
// Add import
import PasswordStrength from "@/components/auth/PasswordStrength";

// In the password input section for signup mode:
<div className="space-y-2">
  <Label htmlFor="password">Mật Khẩu</Label>
  <div className="relative">
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    {/* ... eye icon ... */}
  </div>
  
  {/* Add strength indicator */}
  <PasswordStrength password={password} show={mode === "signup"} />
</div>
```

**Effort:** 1-2 hours  
**Impact:** Medium - Security + UX improvement

---

## Sprint 1.2: Analytics & Monitoring (2-3 days)

### 1. Integrate Google Analytics 4

#### Objective
Track user behavior to make data-driven decisions.

#### Technical Implementation

**Install Dependencies:**
```bash
npm install react-ga4
```

**New File:** `src/lib/analytics.ts`

```typescript
import ReactGA from "react-ga4";

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (MEASUREMENT_ID) {
    ReactGA.initialize(MEASUREMENT_ID);
  }
};

export const logPageView = (path: string, title?: string) => {
  ReactGA.send({ hitType: "pageview", page: path, title });
};

export const logEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

// Custom events
export const trackSignup = (method: "email" | "google" | "github") => {
  logEvent("Auth", "Signup", method);
};

export const trackTaskCreated = () => {
  logEvent("Task", "Created");
};

export const trackWorkspaceCreated = () => {
  logEvent("Workspace", "Created");
};

export const trackCTAClick = (location: string, label: string) => {
  logEvent("CTA", "Click", `${location} - ${label}`);
};
```

**Update:** `src/App.tsx`

```tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, logPageView } from "./lib/analytics";

function App() {
  const location = useLocation();
  
  useEffect(() => {
    initGA();
  }, []);
  
  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);
  
  // ... rest of component
}
```

**Environment Variable:** `.env`
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Effort:** 2-3 hours  
**Impact:** High - Essential for optimization

---

### 2. Add Sentry Error Tracking

#### Objective
Monitor and fix production errors proactively.

#### Technical Implementation

**Install:**
```bash
npm install @sentry/react
```

**Update:** `src/main.tsx`

```tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Wrap App in ErrorBoundary
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
)
```

**New File:** `src/components/ErrorFallback.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-muted-foreground mb-6">
          Chúng tôi đã được thông báo và sẽ khắc phục sớm nhất.
        </p>
        <Button onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      </div>
    </div>
  );
}
```

**Environment:** `.env`
```
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Effort:** 1-2 hours  
**Impact:** High - Production stability

---

### 3. Implement Web Vitals Monitoring

#### Objective
Track performance metrics (LCP, FID, CLS).

#### Technical Implementation

**Install:**
```bash
npm install web-vitals
```

**New File:** `src/lib/webVitals.ts`

```typescript
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';
import { logEvent } from './analytics';

export function reportWebVitals() {
  onCLS((metric) => {
    logEvent('Web Vitals', 'CLS', `${metric.value.toFixed(4)}`);
  });

  onFID((metric) => {
    logEvent('Web Vitals', 'FID', `${metric.value.toFixed(0)}`);
  });

  onLCP((metric) => {
    logEvent('Web Vitals', 'LCP', `${metric.value.toFixed(0)}`);
  });

  onFCP((metric) => {
    logEvent('Web Vitals', 'FCP', `${metric.value.toFixed(0)}`);
  });

  onTTFB((metric) => {
    logEvent('Web Vitals', 'TTFB', `${metric.value.toFixed(0)}`);
  });
}
```

**Update:** `src/main.tsx`

```tsx
import { reportWebVitals } from './lib/webVitals';

// After render
reportWebVitals();
```

**Effort:** 1 hour  
**Impact:** Medium - Performance insights

---

### 4. Create Basic SEO (sitemap, robots.txt)

#### Objective
Improve search engine discoverability.

#### Technical Implementation

**New File:** `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://taskflow.vn/sitemap.xml

# Disallow private pages
Disallow: /dashboard
Disallow: /auth
Disallow: /signin
Disallow: /signup
```

**New File:** `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://taskflow.vn/</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/features</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/pricing</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/about</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/contact</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/downloads</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/enterprise</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://taskflow.vn/ai-development</loc>
    <lastmod>2025-11-03</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

**Update:** `index.html` (improve meta tags)

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Enhanced SEO -->
  <meta name="description" content="TaskFlow - Ứng dụng quản lý công việc hiện đại, đơn giản và hiệu quả cho cá nhân và đội nhóm." />
  <meta name="keywords" content="task management, quản lý công việc, productivity, to-do list, kanban, project management" />
  <meta name="author" content="TaskFlow" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="TaskFlow - Modern Task Management" />
  <meta property="og:description" content="Quản lý công việc thông minh, tăng năng suất cho cá nhân và đội nhóm" />
  <meta property="og:image" content="https://taskflow.vn/og-image.png" />
  <meta property="og:url" content="https://taskflow.vn" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="TaskFlow - Modern Task Management" />
  <meta name="twitter:description" content="Quản lý công việc thông minh" />
  <meta name="twitter:image" content="https://taskflow.vn/twitter-card.png" />
  
  <title>TaskFlow - Modern Task Management</title>
</head>
```

**Effort:** 1 hour  
**Impact:** Medium - SEO foundation

---

## Sprint 1.3: Accessibility Basics (2 days)

### 1. Audit and Fix ARIA Labels

#### Checklist
- [ ] All interactive elements have aria-label or aria-labelledby
- [ ] Form inputs have associated labels
- [ ] Buttons describe their action
- [ ] Images have alt text
- [ ] Landmarks use semantic HTML or ARIA roles

#### Example Fixes

**Navigation:**
```tsx
<nav aria-label="Main navigation">
  <button aria-label="Toggle menu" aria-expanded={isOpen}>
    <Menu className="h-6 w-6" />
  </button>
</nav>
```

**Forms:**
```tsx
<label htmlFor="email" className="sr-only">Email Address</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={errors.email ? "true" : "false"}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <p id="email-error" role="alert" className="text-red-600 text-sm">
    {errors.email}
  </p>
)}
```

**Effort:** 4-5 hours  
**Impact:** High - WCAG compliance

---

### 2. Improve Keyboard Navigation

#### Implementation

**Add focus styles globally:** `src/index.css`

```css
/* Enhanced focus indicators */
*:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to main content link */
.skip-to-main {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 9999;
  padding: 1rem;
  background: #4f46e5;
  color: white;
  text-decoration: none;
}

.skip-to-main:focus {
  left: 50%;
  transform: translateX(-50%);
}
```

**Add skip link:** Every page

```tsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>

<main id="main-content">
  {/* page content */}
</main>
```

**Effort:** 2-3 hours  
**Impact:** Medium - Keyboard user accessibility

---

### 3. Test with Screen Reader

#### Testing Checklist
- [ ] NVDA (Windows) or VoiceOver (Mac) reads all content
- [ ] Navigation makes sense in reading order
- [ ] Form validation errors are announced
- [ ] Interactive elements are discoverable
- [ ] Page title and headings are logical

**Document issues** in `docs/accessibility-issues.md`

**Effort:** 2-3 hours  
**Impact:** Critical - Validation

---

## Phase 1 Completion Checklist

### Sprint 1.1
- [ ] Product screenshots on Landing hero
- [ ] Pricing comparison table rendered
- [ ] Customer logos section on Landing
- [ ] Custom 404 page created
- [ ] Password strength indicator in Auth

### Sprint 1.2
- [ ] Google Analytics 4 integrated
- [ ] Sentry error tracking configured
- [ ] Web Vitals monitoring active
- [ ] SEO basics (sitemap, robots, meta tags)

### Sprint 1.3
- [ ] ARIA labels audited and fixed
- [ ] Keyboard navigation improved
- [ ] Screen reader tested

### Success Metrics
- [ ] Lighthouse score >90
- [ ] Accessibility score >95
- [ ] All pages tracked in Analytics
- [ ] Zero console errors in production

---

## Next Steps

After completing Phase 1:
1. **Review metrics** after 1 week
2. **Gather user feedback** on improvements
3. **Plan Phase 2** based on data
4. **Prioritize** high-impact items from Phase 2

---

**Estimated Total Effort:** 7-9 days  
**Team Size:** 1 senior frontend developer  
**Dependencies:** Design assets (screenshots, logos)

