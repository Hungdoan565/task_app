import { motion } from "framer-motion"
import { ReactNode } from "react"
import { COLORS, ANIMATION, SPACING, TYPOGRAPHY } from "@/constants/design"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface SectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  background?: "light" | "white" | "gradient"
  className?: string
}

/**
 * Component Section tái sử dụng cho trang About
 * Đảm bảo tính nhất quán về layout, màu sắc và animation
 * Hỗ trợ prefers-reduced-motion
 */
export default function Section({
  title,
  subtitle,
  children,
  background = "white",
  className = ""
}: SectionProps) {

  const reducedMotion = useReducedMotion()
  const bgClass = COLORS.background[background]

  return (
    <section className={`${SPACING.section.md} px-4 ${bgClass} ${className}`}>
      <div className={SPACING.container.default}>
        {/* Header Section */}
        <motion.div
          initial={reducedMotion ? ANIMATION.fadeInReduced.initial : ANIMATION.fadeIn.initial}
          whileInView={reducedMotion ? ANIMATION.fadeInReduced.animate : ANIMATION.fadeIn.animate}
          viewport={ANIMATION.fadeIn.viewport}
          transition={ANIMATION.presets.medium}
          className="text-center mb-16"
        >
          <h2 className={`${TYPOGRAPHY.heading.section} ${COLORS.text.primary} mb-4`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`${TYPOGRAPHY.body.large} ${COLORS.text.secondary} max-w-3xl mx-auto`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Content */}
        {children}
      </div>
    </section>
  )
}

