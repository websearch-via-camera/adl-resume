import { useRef, useState, useCallback, ReactNode, ComponentProps } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends ComponentProps<"button"> {
  children: ReactNode
  /** Magnetic pull strength (0-1, default 0.4) */
  strength?: number
  /** Radius of magnetic effect in pixels */
  radius?: number
  /** Whether to apply magnetic effect to children too */
  magneticChildren?: boolean
}

/**
 * Award-winning magnetic button effect
 * Cursor attracts the button on proximity using GPU-accelerated transforms
 * Performance optimized with RAF throttling and will-change hints
 */
export function MagneticButton({
  children,
  className,
  strength = 0.4,
  radius = 150,
  magneticChildren = true,
  onMouseMove,
  onMouseLeave,
  onMouseEnter,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const rafRef = useRef<number>(0)
  const rectRef = useRef<DOMRect | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [childPosition, setChildPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (buttonRef.current) {
        rectRef.current = buttonRef.current.getBoundingClientRect()
      }
      setIsHovered(true)
      onMouseEnter?.(e)
    },
    [onMouseEnter]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (rafRef.current) return // Throttle with RAF
      
      rafRef.current = requestAnimationFrame(() => {
        if (!rectRef.current) {
          rafRef.current = 0
          return
        }

        const rect = rectRef.current
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Calculate magnetic pull based on distance (stronger when closer)
        const pull = Math.max(0, 1 - distance / radius)
        
        // Move button towards cursor
        const moveX = deltaX * strength * pull
        const moveY = deltaY * strength * pull
        
        setPosition({ x: moveX, y: moveY })
        
        // Children move more for parallax effect
        if (magneticChildren) {
          setChildPosition({ 
            x: deltaX * strength * pull * 1.5, 
            y: deltaY * strength * pull * 1.5 
          })
        }
        
        rafRef.current = 0
      })
      
      onMouseMove?.(e)
    },
    [strength, radius, magneticChildren, onMouseMove]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
      rectRef.current = null
      setPosition({ x: 0, y: 0 })
      setChildPosition({ x: 0, y: 0 })
      setIsHovered(false)
      onMouseLeave?.(e)
    },
    [onMouseLeave]
  )

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative transition-transform duration-300 ease-out",
        isHovered && "duration-75", // Faster during interaction
        className
      )}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: isHovered ? "transform" : "auto",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span
        className="relative inline-flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: magneticChildren 
            ? `translate3d(${childPosition.x}px, ${childPosition.y}px, 0)` 
            : undefined,
          willChange: isHovered && magneticChildren ? "transform" : "auto",
        }}
      >
        {children}
      </span>
    </button>
  )
}

/**
 * Hook version for applying magnetic effect to any element
 */
export function useMagnetic(strength = 0.4, radius = 150) {
  const elementRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number>(0)
  const rectRef = useRef<DOMRect | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  const handlers = {
    onMouseEnter: () => {
      if (elementRef.current) {
        rectRef.current = elementRef.current.getBoundingClientRect()
      }
      setIsActive(true)
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (rafRef.current) return
      
      rafRef.current = requestAnimationFrame(() => {
        if (!rectRef.current) {
          rafRef.current = 0
          return
        }

        const rect = rectRef.current
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        const pull = Math.max(0, 1 - distance / radius)
        
        setPosition({
          x: deltaX * strength * pull,
          y: deltaY * strength * pull,
        })
        
        rafRef.current = 0
      })
    },
    onMouseLeave: () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
      rectRef.current = null
      setPosition({ x: 0, y: 0 })
      setIsActive(false)
    },
  }

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isActive ? "transform 75ms ease-out" : "transform 300ms ease-out",
    willChange: isActive ? "transform" : "auto",
  }

  return { ref: elementRef, handlers, style, isActive }
}
