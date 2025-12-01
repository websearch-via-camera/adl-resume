import { useState, useRef, useCallback, ReactNode, ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { hapticFeedback } from "@/hooks/useTouchGestures"

interface TouchFeedbackProps extends ComponentProps<"div"> {
  children: ReactNode
  /** Type of haptic feedback on touch */
  haptic?: "light" | "medium" | "heavy" | "success" | "none"
  /** Whether to show ripple effect */
  ripple?: boolean
  /** Scale factor when pressed (0.95-0.99) */
  pressScale?: number
  /** Duration of press animation in ms */
  pressDuration?: number
}

/**
 * Wrapper component that adds touch feedback effects
 * - Visual ripple from touch point
 * - Scale animation on press
 * - Optional haptic feedback
 */
export function TouchFeedback({
  children,
  className,
  haptic = "light",
  ripple = true,
  pressScale = 0.97,
  pressDuration = 150,
  onClick,
  ...props
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const rippleIdRef = useRef(0)

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setIsPressed(true)
      
      // Trigger haptic feedback
      if (haptic !== "none") {
        hapticFeedback(haptic)
      }

      // Add ripple effect
      if (ripple && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        const x = touch.clientX - rect.left
        const y = touch.clientY - rect.top
        const id = ++rippleIdRef.current

        setRipples((prev) => [...prev, { x, y, id }])

        // Remove ripple after animation
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 600)
      }
    },
    [haptic, ripple]
  )

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Add ripple on click (for mouse interactions)
      if (ripple && containerRef.current && !("ontouchstart" in window)) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = ++rippleIdRef.current

        setRipples((prev) => [...prev, { x, y, id }])

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 600)
      }

      onClick?.(e)
    },
    [ripple, onClick]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden transition-transform select-none",
        className
      )}
      style={{
        transform: isPressed ? `scale(${pressScale})` : "scale(1)",
        transitionDuration: `${pressDuration}ms`,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-foreground/10 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  )
}

/**
 * Hook for adding touch feedback to any element
 */
export function useTouchFeedback(haptic: "light" | "medium" | "heavy" | "success" | "none" = "light") {
  const [isPressed, setIsPressed] = useState(false)

  const handlers = {
    onTouchStart: () => {
      setIsPressed(true)
      if (haptic !== "none") {
        hapticFeedback(haptic)
      }
    },
    onTouchEnd: () => setIsPressed(false),
    onTouchCancel: () => setIsPressed(false),
  }

  return { isPressed, handlers }
}
