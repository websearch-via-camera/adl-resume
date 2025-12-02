import { useState, useEffect, useRef, memo, useMemo } from "react"
import { cn } from "@/lib/utils"

/**
 * Kinetic Typography - Experimental animated text effects
 * Variable font weight animation, wave effects, and more
 */

interface KineticTextProps {
  children: string
  className?: string
  effect?: "wave" | "breathe" | "glitch" | "liquid" | "magnetic" | "split"
  speed?: number
  delay?: number
  triggerOnView?: boolean
}

/**
 * Wave effect - letters animate in a wave pattern
 */
export const WaveText = memo(function WaveText({
  children,
  className,
  speed = 1,
}: { children: string; className?: string; speed?: number }) {
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span className={cn("inline-flex", className)} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-wave"
          style={{
            animationDelay: `${i * 0.05 * (1 / speed)}s`,
            animationDuration: `${1.5 / speed}s`,
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  )
})

/**
 * Breathe effect - variable font weight animation
 */
export const BreatheText = memo(function BreatheText({
  children,
  className,
  speed = 1,
}: { children: string; className?: string; speed?: number }) {
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span className={cn("inline-flex", className)} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block animate-breathe"
          style={{
            animationDelay: `${i * 0.08 * (1 / speed)}s`,
            animationDuration: `${2 / speed}s`,
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  )
})

/**
 * Glitch effect - cyberpunk text distortion
 */
export const GlitchText = memo(function GlitchText({
  children,
  className,
  intensity = 1,
}: { children: string; className?: string; intensity?: number }) {
  const [isGlitching, setIsGlitching] = useState(false)
  
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  // Random glitch trigger
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const triggerGlitch = () => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 150 * intensity)
    }
    
    // Random intervals between 3-8 seconds
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 5000
      return setTimeout(() => {
        triggerGlitch()
        scheduleNext()
      }, delay)
    }
    
    const timeoutId = scheduleNext()
    return () => clearTimeout(timeoutId)
  }, [intensity, prefersReducedMotion])
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span
      className={cn("relative inline-block", isGlitching && "animate-glitch", className)}
      data-text={children}
      aria-label={children}
    >
      {children}
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-500 animate-glitch-1"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-red-500 animate-glitch-2"
            style={{ clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
            aria-hidden="true"
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
})

/**
 * Liquid effect - smooth morphing borders on each letter
 */
export const LiquidText = memo(function LiquidText({
  children,
  className,
}: { children: string; className?: string }) {
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span className={cn("inline-flex", className)} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block relative"
          style={{
            animation: `liquid ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  )
})

/**
 * Magnetic Text - letters attract to cursor on hover
 */
export const MagneticText = memo(function MagneticText({
  children,
  className,
  strength = 0.3,
}: { children: string; className?: string; strength?: number }) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [letterPositions, setLetterPositions] = useState<{ x: number; y: number }[]>([])
  
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  // Initialize positions
  useEffect(() => {
    setLetterPositions(children.split("").map(() => ({ x: 0, y: 0 })))
  }, [children])
  
  // Handle mouse move
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const container = containerRef.current
    if (!container) return
    
    const handleMouseMove = (e: MouseEvent) => {
      const letters = container.querySelectorAll<HTMLSpanElement>("[data-magnetic-letter]")
      const newPositions: { x: number; y: number }[] = []
      
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Only affect letters within radius
        const maxDistance = 150
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * strength
          newPositions.push({
            x: deltaX * force,
            y: deltaY * force,
          })
        } else {
          newPositions.push({ x: 0, y: 0 })
        }
      })
      
      setLetterPositions(newPositions)
    }
    
    const handleMouseLeave = () => {
      setLetterPositions(children.split("").map(() => ({ x: 0, y: 0 })))
    }
    
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    
    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [children, strength, prefersReducedMotion])
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span ref={containerRef} className={cn("inline-flex cursor-default", className)} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          data-magnetic-letter
          className="inline-block transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${letterPositions[i]?.x || 0}px, ${letterPositions[i]?.y || 0}px)`,
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  )
})

/**
 * Split Text - reveals with split animation
 */
export const SplitText = memo(function SplitText({
  children,
  className,
  direction = "up",
  delay = 0,
  stagger = 0.03,
}: {
  children: string
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  stagger?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }
    
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, prefersReducedMotion])
  
  const getTransform = (isRevealed: boolean) => {
    if (isRevealed) return "translate(0, 0)"
    switch (direction) {
      case "up": return "translate(0, 100%)"
      case "down": return "translate(0, -100%)"
      case "left": return "translate(100%, 0)"
      case "right": return "translate(-100%, 0)"
    }
  }
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span ref={ref} className={cn("inline-flex overflow-hidden", className)} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-500 ease-out"
          style={{
            transform: getTransform(isVisible),
            transitionDelay: `${i * stagger}s`,
          }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  )
})

/**
 * Gradient Flow Text - animated gradient that flows through text
 */
export const GradientFlowText = memo(function GradientFlowText({
  children,
  className,
  colors = ["var(--primary)", "var(--accent)", "var(--primary)"],
  speed = 3,
}: {
  children: string
  className?: string
  colors?: string[]
  speed?: number
}) {
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[length:300%_100%]",
        !prefersReducedMotion && "animate-gradient-flow",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        animationDuration: prefersReducedMotion ? "0s" : `${speed}s`,
      }}
    >
      {children}
    </span>
  )
})

/**
 * Elastic Text - bouncy spring animation on hover
 */
export const ElasticText = memo(function ElasticText({
  children,
  className,
}: { children: string; className?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  [])
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <span className={cn("inline-flex", className)} aria-label={children}>
      {children.split("").map((char, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-transform duration-300 cursor-default",
            hoveredIndex === i && "animate-elastic"
          )}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  )
})

// Main export with all effects
export const KineticText = memo(function KineticText({
  children,
  className,
  effect = "wave",
  speed = 1,
  delay = 0,
}: KineticTextProps) {
  switch (effect) {
    case "wave":
      return <WaveText className={className} speed={speed}>{children}</WaveText>
    case "breathe":
      return <BreatheText className={className} speed={speed}>{children}</BreatheText>
    case "glitch":
      return <GlitchText className={className}>{children}</GlitchText>
    case "liquid":
      return <LiquidText className={className}>{children}</LiquidText>
    case "magnetic":
      return <MagneticText className={className}>{children}</MagneticText>
    case "split":
      return <SplitText className={className} delay={delay}>{children}</SplitText>
    default:
      return <span className={className}>{children}</span>
  }
})
