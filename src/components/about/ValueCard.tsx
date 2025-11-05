import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { COLORS, ANIMATION, TYPOGRAPHY, SHADOW, RADIUS } from "@/constants/design"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface ValueCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
}

/**
 * Component ValueCard với hiệu ứng cao cấp
 * - Flat icon background (không dùng gradient)
 * - Hover lift effect (-4px)
 * - Stagger animation
 * - 3D tilt effect (subtle)
 * - Hỗ trợ prefers-reduced-motion
 */
export default function ValueCard({
  icon: Icon,
  title,
  description,
  index
}: ValueCardProps) {

  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      // Fade in với delay dựa trên index
      initial={reducedMotion ? ANIMATION.fadeInReduced.initial : ANIMATION.fadeIn.initial}
      whileInView={reducedMotion ? ANIMATION.fadeInReduced.animate : ANIMATION.fadeIn.animate}
      viewport={ANIMATION.fadeIn.viewport}
      transition={{
        delay: reducedMotion ? 0 : index * 0.1,
        ...ANIMATION.presets.medium,
      }}

      // Hover effects - Lift + Subtle Tilt (disabled if reduced motion)
      whileHover={reducedMotion ? {} : {
        ...ANIMATION.hover.lift,
        rotateX: 2,
        rotateY: 2,
      }}

      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <Card 
        className={`
          p-8 h-full 
          ${SHADOW.card.default} ${SHADOW.card.hover}
          transition-all duration-200
          ${COLORS.border.default} ${COLORS.border.hover}
          bg-white
        `}
      >
        {/* Icon với flat background */}
        <div className={`
          ${COLORS.iconBg.default}
          p-4 ${RADIUS.lg} w-fit mb-6
        `}>
          <Icon className="h-8 w-8" />
        </div>
        
        {/* Title */}
        <h3 className={`${TYPOGRAPHY.heading.card} ${COLORS.text.primary} mb-4`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className={`${TYPOGRAPHY.body.large} ${COLORS.text.secondary}`}>
          {description}
        </p>
      </Card>
    </motion.div>
  )
}

