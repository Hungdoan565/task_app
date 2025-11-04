# Phase 2: Conversion Optimization - Tasks Overview
**Timeline:** Week 3-4 (7-10 ngày)  
**Goal:** Cải thiện conversion rate & user retention

---

## 📊 Tổng Quan

Phase 2 tập trung vào việc **tối ưu hóa chuyển đổi** - biến visitors thành users và users thành paying customers. Bao gồm 3 sprints chính:

1. **Onboarding Flow** - Giúp users mới làm quen nhanh với product
2. **Feature Showcase** - Trình bày features rõ ràng, có demo thực tế
3. **Pricing Improvements** - Làm rõ giá trị, so sánh plans dễ hiểu

---

## 🎯 Sprint 2.1: Onboarding Flow (4-5 ngày)

### Mục Tiêu
Giảm bounce rate và tăng activation rate cho new users.

### Tasks

#### 1. Design Onboarding Steps
- [ ] Tạo welcome modal cho first-time users
- [ ] Define 3-5 onboarding steps chính:
  - Welcome → Create workspace → Add first task → Invite team → Explore features
- [ ] Design progress indicator (step counter)

**Files:**
- `src/components/onboarding/OnboardingWizard.tsx` (new)
- `src/components/onboarding/WelcomeStep.tsx` (new)

**Effort:** 1 day

---

#### 2. Implement Product Tour
- [ ] Install `react-joyride` hoặc `react-tour`
- [ ] Create guided tour highlighting key features:
  - Kanban board
  - Quick add task
  - Calendar view
  - Notifications
- [ ] Add "Skip tour" và "Restart tour" options
- [ ] Store tour completion in localStorage

**Files:**
- `src/components/onboarding/ProductTour.tsx` (new)
- `src/hooks/useProductTour.ts` (new)

**Dependencies:**
```bash
npm install react-joyride
```

**Effort:** 1.5 days

---

#### 3. Add Empty States with CTAs
- [ ] Dashboard: Empty workspace state
- [ ] Kanban: No tasks yet
- [ ] Calendar: No events
- [ ] Team: No members

**Design Pattern:**
```tsx
<EmptyState
  icon={<Icon />}
  title="Chưa có công việc nào"
  description="Tạo task đầu tiên để bắt đầu"
  action={<Button>Tạo Task</Button>}
/>
```

**Files:**
- `src/components/ui/empty-state.tsx` (new)
- Update: Dashboard, Kanban, Calendar pages

**Effort:** 1 day

---

#### 4. Create First-Time User Checklist
- [ ] Design checklist component (floating widget)
- [ ] Track completion:
  - ✓ Create workspace
  - ✓ Add first task
  - ✓ Invite team member
  - ✓ Set up profile
  - ✓ Complete onboarding tour
- [ ] Show progress percentage
- [ ] Celebrate completion with confetti animation

**Files:**
- `src/components/onboarding/FirstTimeChecklist.tsx` (new)
- `src/store/onboardingStore.ts` (new)

**Libraries:**
```bash
npm install react-confetti canvas-confetti
```

**Effort:** 1.5 days

---

**Sprint 2.1 Total:** 5 days  
**Impact:** Activation rate ↑40-60%

---

## 🎨 Sprint 2.2: Feature Showcase (3-4 ngày)

### Mục Tiêu
Giúp users hiểu rõ features qua visuals thay vì text.

### Tasks

#### 1. Add Screenshots to Features Page
- [ ] Take high-quality screenshots (1920x1080, 2x retina)
- [ ] Chụp cho 6 main features:
  - Kanban board in action
  - Calendar with events
  - Rich text editor
  - File attachments
  - Team collaboration
  - Mobile responsive
- [ ] Optimize images (WebP format, lazy load)
- [ ] Add lightbox for zoom-in

**Tools:**
- Screenshot: Chrome DevTools (Device mode)
- Optimize: `sharp` hoặc online tools
- Lightbox: `yet-another-react-lightbox`

**Files:**
- `/public/images/features/` (new folder)
- Update: `src/pages/Features.tsx`

**Effort:** 1 day

---

#### 2. Create Use Case Sections
- [ ] Design use case cards theo industry:
  - 💼 **Software Teams** - Sprint planning, bug tracking
  - 📊 **Marketing Teams** - Campaign management, content calendar
  - 🏢 **Operations** - Process tracking, checklists
  - 🎨 **Creative Teams** - Design reviews, asset management
- [ ] Add "See how [team] uses TaskFlow" với screenshot

**Files:**
- `src/components/features/UseCaseCard.tsx` (new)
- Update: `src/pages/Features.tsx`

**Effort:** 1 day

---

#### 3. Add Competitor Comparison Table
- [ ] Create comparison matrix:
  - **Competitors:** Asana, Trello, Notion, ClickUp
  - **Features to compare:**
    - Kanban boards
    - Calendar view
    - Real-time collab
    - File storage
    - Mobile apps
    - Pricing
- [ ] Highlight TaskFlow advantages
- [ ] Make it responsive (horizontal scroll on mobile)

**Design:**
```tsx
<ComparisonTable>
  <thead>
    <tr>
      <th>Feature</th>
      <th>TaskFlow ⭐</th>
      <th>Asana</th>
      <th>Trello</th>
      <th>Notion</th>
    </tr>
  </thead>
  {/* ... */}
</ComparisonTable>
```

**Files:**
- `src/components/features/ComparisonTable.tsx` (new)
- Update: `src/pages/Features.tsx`

**Effort:** 1 day

---

#### 4. Feature Filtering by Plan
- [ ] Add filter buttons: All | Free | Pro | AI Premium
- [ ] Show badge on each feature (Free/Pro/AI)
- [ ] Animate filter transitions
- [ ] Update URL params for sharing

**Files:**
- Update: `src/pages/Features.tsx`
- Add state management for filtering

**Effort:** 0.5 day

---

**Sprint 2.2 Total:** 3.5 days  
**Impact:** Feature understanding ↑60%, Decision confidence ↑40%

---

## 💰 Sprint 2.3: Pricing Improvements (2-3 ngày)

### Mục Tiêu
Làm rõ giá trị của từng plan, giúp users chọn đúng gói.

### Tasks

#### 1. Render Full Comparison Table
- [ ] Expand `comparisonFeatures` array (currently có 6 items)
- [ ] Add 10-15 features chi tiết:
  - Số users
  - Storage limit
  - Integrations
  - Support level
  - Custom branding
  - API access
  - SSO/SAML
  - SLA guarantee
- [ ] Make table sticky header on scroll
- [ ] Highlight differences with color coding

**Files:**
- Update: `src/pages/Pricing.tsx`

**Effort:** 0.5 day

---

#### 2. Add Annual/Monthly Toggle
- [ ] Create toggle switch component
- [ ] Show pricing for both billing cycles
- [ ] Display savings for annual (e.g., "Save 20%")
- [ ] Update prices dynamically on toggle

**Design:**
```tsx
<PricingToggle>
  <option value="monthly">Monthly</option>
  <option value="annual">Annual (Save 20%)</option>
</PricingToggle>
```

**Files:**
- `src/components/pricing/BillingToggle.tsx` (new)
- Update: `src/pages/Pricing.tsx`

**Effort:** 0.5 day

---

#### 3. Create ROI Calculator
- [ ] Interactive calculator widget:
  - Input: Team size
  - Input: Hours saved per week
  - Input: Hourly rate
  - Output: ROI calculation
  - Output: Payback period
- [ ] Show comparison with current workflow
- [ ] Add "Book demo" CTA if ROI > threshold

**Formula:**
```
Monthly savings = Team size × Hours saved × Hourly rate × 4 weeks
ROI = (Monthly savings - Plan cost) / Plan cost × 100%
```

**Files:**
- `src/components/pricing/ROICalculator.tsx` (new)
- Update: `src/pages/Pricing.tsx`

**Effort:** 1 day

---

#### 4. Add Paid User Testimonials
- [ ] Collect 3-5 testimonials from Pro/AI users
- [ ] Include metrics:
  - "Saved 10 hours per week"
  - "Increased team productivity by 40%"
  - "ROI achieved in first month"
- [ ] Add company logo + headshot
- [ ] Place strategically near pricing cards

**Files:**
- Update: `src/pages/Pricing.tsx`
- Assets: `/public/images/testimonials/`

**Effort:** 0.5 day

---

**Sprint 2.3 Total:** 2.5 days  
**Impact:** Conversion to paid ↑30-50%

---

## 📦 Dependencies to Install

```bash
# Onboarding
npm install react-joyride
npm install react-confetti canvas-confetti

# Image optimization
npm install sharp  # (dev dependency)

# Lightbox
npm install yet-another-react-lightbox
```

---

## 📊 Success Metrics

### Sprint 2.1 - Onboarding
- ✅ Activation rate tăng từ ~30% → 50%+
- ✅ Time-to-first-task giảm 60%
- ✅ New user retention (D7) tăng 40%

### Sprint 2.2 - Feature Showcase
- ✅ Feature page engagement tăng 80%
- ✅ Time on page tăng từ 1m → 3m+
- ✅ Signup from /features tăng 50%

### Sprint 2.3 - Pricing
- ✅ Free → Pro conversion tăng 35%
- ✅ Pricing page bounce rate giảm 25%
- ✅ "Contact sales" requests tăng 60%

---

## 🎯 Priority Order

**Must Have (Week 3):**
1. Empty states + CTAs
2. Feature screenshots
3. Full pricing comparison table
4. Annual/monthly toggle

**Should Have (Week 4):**
5. Product tour
6. Use case sections
7. ROI calculator
8. Paid testimonials

**Nice to Have (If time permits):**
9. First-time checklist
10. Feature filtering
11. Competitor comparison
12. Welcome modal

---

## 🚀 After Phase 2

With Phase 2 complete:
- ✅ New users understand product quickly
- ✅ Features are showcased professionally
- ✅ Pricing is transparent and compelling
- ✅ Conversion funnel is optimized

**Next:** Phase 3 - Content & Authority (Blog, Docs, Case Studies)

---

**Timeline:** 7-10 days  
**Team:** 1-2 developers + 1 designer  
**Priority:** HIGH - Direct impact on revenue

