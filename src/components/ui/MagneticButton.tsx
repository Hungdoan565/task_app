import { motion } from "framer-motion"
import { useRef, useState, MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { ButtonProps } from "@/components/ui/button"

interface MagneticButtonProps extends ButtonProps {
  children: React.ReactNode
  magneticStrength?: number
}

/**
 * Nút bấm từ tính - Hiệu ứng cao cấp như Apple/Stripe
 * Con trỏ chuột sẽ "hút" nút về phía nó khi ở gần
 * 
 * @param magneticStrength - Độ mạnh của hiệu ứng từ tính (0-1), mặc định 0.3
 */
export default function MagneticButton({ 
  children, 
  magneticStrength = 0.3,
  className = "",
  ...props 
}: MagneticButtonProps) {
  
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    
    // Tính toán vị trí tương đối của chuột so với tâm nút
    const centerX = left + width / 2
    const centerY = top + height / 2
    
    // Tính khoảng cách và áp dụng độ mạnh từ tính
    const x = (clientX - centerX) * magneticStrength
    const y = (clientY - centerY) * magneticStrength
    
    setPosition({ x, y })
  }
  
  const handleMouseLeave = () => {
    // Reset về vị trí ban đầu khi chuột rời khỏi
    setPosition({ x: 0, y: 0 })
  }
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 15,
        mass: 0.1,
      }}
      style={{ display: "inline-block" }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}

