import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { COLORS, ANIMATION, TYPOGRAPHY, RADIUS } from "@/constants/design"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface StatCardProps {
  icon: LucideIcon
  value: string
  label: string
  index: number
}

/**
 * Component StatCard với animation đếm số
 * - Flat icon background
 * - Fade in animation
 * - Stagger effect
 * - Hỗ trợ prefers-reduced-motion
 */
export default function StatCard({
  icon: Icon,
  value,
  label,
  index
}: StatCardProps) {

  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? ANIMATION.fadeInReduced.initial : ANIMATION.fadeIn.initial}
      whileInView={reducedMotion ? ANIMATION.fadeInReduced.animate : ANIMATION.fadeIn.animate}
      viewport={ANIMATION.fadeIn.viewport}
      transition={{
        delay: reducedMotion ? 0 : index * 0.1,
        ...ANIMATION.presets.medium,
      }}

      className="text-center"
    >
      {/* Icon với flat background */}
      <div className={`
        ${COLORS.iconBg.default}
        p-4 ${RADIUS.lg} w-fit mx-auto mb-4
      `}>
        <Icon className="h-8 w-8" />
      </div>
      
      {/* Value - Số liệu lớn */}
      <div className={`
        text-4xl md:text-5xl font-bold 
        ${COLORS.text.primary}
        mb-2
      `}>
        {value}
      </div>
      
      {/* Label */}
      <div className={`${TYPOGRAPHY.body.large} ${COLORS.text.secondary}`}>
        {label}
      </div>
    </motion.div>
  )
}

