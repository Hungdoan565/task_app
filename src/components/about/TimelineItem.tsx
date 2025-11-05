import { motion } from "framer-motion"
import { COLORS, ANIMATION, TYPOGRAPHY, SHADOW, RADIUS } from "@/constants/design"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface TimelineItemProps {
  period: string
  event: string
  description: string
  index: number
}

/**
 * Component TimelineItem với animation mượt mà
 * - Slide in từ trái
 * - Stagger animation
 * - Hover effect
 * - Hỗ trợ prefers-reduced-motion
 */
export default function TimelineItem({
  period,
  event,
  description,
  index
}: TimelineItemProps) {

  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      // Slide in từ trái (or just fade if reduced motion)
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: reducedMotion ? 0 : index * 0.1,
        ...ANIMATION.presets.medium,
      }}

      className="flex items-start gap-6"
    >
      {/* Period Badge - Giữ gradient vì đây là label đặc biệt */}
      <div className={`
        ${COLORS.background.gradient}
        ${COLORS.text.white}
        px-6 py-3 ${RADIUS.md}
        font-bold text-sm min-w-[120px] text-center
        ${SHADOW.floating}
        flex-shrink-0
      `}>
        {period}
      </div>
      
      {/* Event Card */}
      <motion.div
        className={`
          flex-1 bg-white p-6 ${RADIUS.md}
          ${COLORS.border.default} ${COLORS.border.hover}
          ${SHADOW.card.default} ${SHADOW.card.hover}
          transition-all duration-200
        `}
        whileHover={reducedMotion ? {} : ANIMATION.hover.lift}
      >
        <h3 className={`${TYPOGRAPHY.heading.card} ${COLORS.text.primary} mb-2`}>
          {event}
        </h3>
        <p className={`${TYPOGRAPHY.body.large} ${COLORS.text.secondary}`}>
          {description}
        </p>
      </motion.div>
    </motion.div>
  )
}

