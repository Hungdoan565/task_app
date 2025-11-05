# 🎨 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG THIẾT KẾ

## 📋 TỔNG QUAN

Hệ thống thiết kế mới đảm bảo tính nhất quán 100% về:
- Màu sắc
- Animation
- Typography
- Spacing
- Shadows & Borders

---

## 🎯 CÁC COMPONENT MỚI

### 1. **Section** - Component bọc section

```typescript
import Section from "@/components/about/Section"

<Section
  title="Tiêu Đề Section"
  subtitle="Mô tả ngắn gọn (tùy chọn)"
  background="light" // "light" | "white" | "gradient"
>
  {/* Nội dung */}
</Section>
```

### 2. **ValueCard** - Thẻ giá trị với hiệu ứng cao cấp

```typescript
import ValueCard from "@/components/about/ValueCard"
import { Heart } from "lucide-react"

<ValueCard
  icon={Heart}
  title="Tận Tâm"
  description="Chúng tôi luôn đặt khách hàng lên hàng đầu"
  index={0} // Cho stagger animation
/>
```

**Tính năng:**
- ✅ Flat icon background (indigo-100)
- ✅ Hover lift -4px
- ✅ Subtle 3D tilt
- ✅ Stagger animation

### 3. **TimelineItem** - Mốc thời gian

```typescript
import TimelineItem from "@/components/about/TimelineItem"

<TimelineItem
  period="Q1 2024"
  event="Ra Mắt Sản Phẩm"
  description="TaskFlow chính thức ra mắt với 1000+ người dùng đầu tiên"
  index={0}
/>
```

**Tính năng:**
- ✅ Slide in từ trái
- ✅ Hover lift effect
- ✅ Gradient badge cho period

### 4. **StatCard** - Thẻ thống kê

```typescript
import StatCard from "@/components/about/StatCard"
import { Users } from "lucide-react"

<StatCard
  icon={Users}
  value="10,000+"
  label="Người Dùng"
  index={0}
/>
```

### 5. **MagneticButton** - Nút bấm từ tính

```typescript
import MagneticButton from "@/components/ui/MagneticButton"

<MagneticButton 
  size="lg"
  magneticStrength={0.3} // 0-1, mặc định 0.3
>
  Bắt Đầu Ngay
</MagneticButton>
```

**Hiệu ứng:**
- ✅ Con trỏ "hút" nút khi ở gần
- ✅ Spring animation mượt mà
- ✅ Cảm giác cao cấp như Apple/Stripe

---

## 🎨 SỬ DỤNG DESIGN CONSTANTS

### Import

```typescript
import { 
  COLORS, 
  ANIMATION, 
  TYPOGRAPHY, 
  SPACING,
  SHADOW,
  RADIUS 
} from "@/constants/design"
```

### Màu Sắc

```typescript
// Background
className={COLORS.background.light}    // Gradient nhẹ
className={COLORS.background.white}    // Trắng
className={COLORS.background.gradient} // Gradient đậm (CTA)

// Text
className={COLORS.text.primary}   // slate-900
className={COLORS.text.secondary} // slate-600
className={COLORS.text.white}     // white

// Icon Background
className={COLORS.iconBg.default} // bg-indigo-100 text-indigo-600

// Border
className={`${COLORS.border.default} ${COLORS.border.hover}`}
```

### Animation

```typescript
// Framer Motion presets
<motion.div
  initial={ANIMATION.fadeIn.initial}
  whileInView={ANIMATION.fadeIn.animate}
  viewport={ANIMATION.fadeIn.viewport}
  transition={ANIMATION.presets.medium}
>

// Hover effects
<motion.div whileHover={ANIMATION.hover.lift}>
<motion.div whileHover={ANIMATION.hover.scale}>
<motion.div whileHover={ANIMATION.hover.tilt}>
```

### Typography

```typescript
// Headings
className={TYPOGRAPHY.heading.hero}    // Hero heading
className={TYPOGRAPHY.heading.section} // Section heading
className={TYPOGRAPHY.heading.card}    // Card heading

// Body
className={TYPOGRAPHY.body.large}   // 18px
className={TYPOGRAPHY.body.default} // 16px
```

### Spacing

```typescript
// Section padding
className={SPACING.section.sm} // py-12 md:py-16
className={SPACING.section.md} // py-16 md:py-24
className={SPACING.section.lg} // py-24 md:py-32

// Container
className={SPACING.container.default} // container mx-auto max-w-7xl px-4
```

---

## 📐 QUY TẮC THIẾT KẾ

### ❌ KHÔNG ĐƯỢC DÙNG

1. **Màu purple** - Không có trong design system
2. **Gradient cho icon backgrounds** - Chỉ dùng flat colors
3. **Raw Tailwind classes** - Phải dùng design tokens
4. **Animation timings tùy ý** - Chỉ dùng 0.2s, 0.3s, 0.5s
5. **Hover lift > 4px** - Quá mạnh, không tinh tế

### ✅ NÊN DÙNG

1. **Indigo & Blue palette** - Nhất quán
2. **Flat icon backgrounds** - `bg-indigo-100 text-indigo-600`
3. **Design tokens** - Từ `@/constants/design`
4. **Chuẩn animation timings** - Fast/Medium/Slow
5. **Subtle hover effects** - -4px lift, 1.02 scale

---

## 🎯 VÍ DỤ HOÀN CHỈNH

```typescript
import Section from "@/components/about/Section"
import ValueCard from "@/components/about/ValueCard"
import { Heart, Target, Users } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Tận Tâm",
    description: "Đặt khách hàng lên hàng đầu"
  },
  {
    icon: Target,
    title: "Chính Xác",
    description: "Cam kết chất lượng cao nhất"
  },
  {
    icon: Users,
    title: "Hợp Tác",
    description: "Làm việc nhóm hiệu quả"
  },
]

export default function AboutPage() {
  return (
    <Section
      title="Giá Trị Cốt Lõi"
      subtitle="Những nguyên tắc định hướng mọi hành động"
      background="white"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, idx) => (
          <ValueCard
            key={idx}
            icon={value.icon}
            title={value.title}
            description={value.description}
            index={idx}
          />
        ))}
      </div>
    </Section>
  )
}
```

---

## 🚀 BƯỚC TIẾP THEO

1. Đọc `ABOUT_PAGE_REFACTOR_GUIDE.md`
2. Refactor từng section theo hướng dẫn
3. Test trên mobile/tablet/desktop
4. Kiểm tra animations mượt mà
5. Deploy và tận hưởng! 🎉

