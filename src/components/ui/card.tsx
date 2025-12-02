import { ComponentProps, useRef, useState, useEffect, useCallback } from "react"

import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/useSoundEffects"

function Card({ className, flat = false, ...props }: ComponentProps<"div"> & { flat?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const { playHover } = useSound()

  // Throttled mouse move using RAF to prevent forced reflows
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (flat || rafRef.current) return // Skip if flat or already scheduled
    
    rafRef.current = requestAnimationFrame(() => {
      if (rectRef.current) {
        const x = e.clientX - rectRef.current.left
        const y = e.clientY - rectRef.current.top
        setMousePosition({ x, y })
        
        // Calculate 3D tilt based on mouse position
        const centerX = rectRef.current.width / 2
        const centerY = rectRef.current.height / 2
        const tiltX = (y - centerY) / centerY * -8 // Max 8deg tilt
        const tiltY = (x - centerX) / centerX * 8
        setTilt({ x: tiltX, y: tiltY })
      }
      rafRef.current = 0
    })
  }, [flat])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Cache rect on enter to avoid repeated getBoundingClientRect calls
    const handleMouseEnter = () => {
      rectRef.current = card.getBoundingClientRect()
      setIsHovered(true)
      playHover()
    }
    
    const handleMouseLeave = () => {
      setIsHovered(false)
      setTilt({ x: 0, y: 0 })
      rectRef.current = null
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }

    if (!prefersReducedMotion) {
      card.addEventListener('mousemove', handleMouseMove)
    }
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, playHover])

  return (
    <div
      ref={cardRef}
      data-slot="card"
      className={cn(
        // Base styles
        "bg-card/80 text-card-foreground flex flex-col gap-6 rounded-2xl border py-6",
        // Enhanced Glassmorphism
        "backdrop-blur-md shadow-lg shadow-black/5",
        "dark:bg-card/60 dark:shadow-black/20",
        // 3D transform perspective
        "transform-gpu",
        // Sophisticated hover with gradient border
        "relative transition-all duration-300 ease-out overflow-hidden",
        "hover:shadow-2xl hover:shadow-primary/10",
        "hover:border-primary/30",
        "dark:hover:shadow-primary/20",
        // Touch feedback - scale down on press
        "active:scale-[0.98] active:shadow-lg active:translate-y-0",
        // Gradient border on hover - animated
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1.5px]",
        "before:bg-gradient-to-br before:from-primary/50 before:via-accent/30 before:to-primary/50",
        "before:-z-10 before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100",
        // Inner glow
        "after:absolute after:inset-0 after:rounded-2xl after:-z-20",
        "after:bg-gradient-to-br after:from-primary/5 after:via-transparent after:to-accent/5",
        "after:opacity-0 after:transition-opacity after:duration-500",
        "hover:after:opacity-100",
        className
      )}
      style={flat ? undefined : {
        transform: isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px) translateY(-4px)`
          : 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) translateY(0)',
        transition: 'transform 0.2s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out',
      }}
      {...props}
    >
      {/* Mouse-following spotlight effect with enhanced glow */}
      {isHovered && !flat && (
        <>
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(from var(--primary) l c h / 0.12), transparent 40%)`,
            }}
          />
          {/* Shine effect */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500 opacity-30"
            style={{
              background: `linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.1) 45%, oklch(1 0 0 / 0.2) 50%, oklch(1 0 0 / 0.1) 55%, transparent 60%)`,
              backgroundPosition: `${mousePosition.x - 100}px 0`,
              backgroundSize: '200% 100%',
            }}
          />
        </>
      )}
      {props.children}
    </div>
  )
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 relative z-10",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 relative z-10", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6 relative z-10", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
