import { memo, useRef, useEffect, useState, useCallback } from "react"
import profileImage from "@/assets/images/profile-384w.avif"

interface AnimatedHeroVisualProps {
  prefersReducedMotion?: boolean
}

export const AnimatedHeroVisual = memo(function AnimatedHeroVisual({ 
  prefersReducedMotion = false 
}: AnimatedHeroVisualProps) {
  const animate = !prefersReducedMotion
  const containerRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number>(0)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)

  // Throttled mouse move using RAF to prevent forced reflows
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current || !rectRef.current) return
    
    rafRef.current = requestAnimationFrame(() => {
      if (rectRef.current) {
        const x = (e.clientX - rectRef.current.left) / rectRef.current.width
        const y = (e.clientY - rectRef.current.top) / rectRef.current.height
        setMousePosition({ x, y })
      }
      rafRef.current = 0
    })
  }, [])

  // Magnetic tilt effect on hover
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return

    const container = containerRef.current
    
    // Cache rect on enter to avoid repeated getBoundingClientRect calls
    const handleMouseEnter = () => {
      rectRef.current = container.getBoundingClientRect()
      setIsHovered(true)
    }
    
    const handleMouseLeave = () => {
      setIsHovered(false)
      setMousePosition({ x: 0.5, y: 0.5 })
      rectRef.current = null
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = 0
      }
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [prefersReducedMotion, handleMouseMove])

  // Calculate 3D transform based on mouse position
  const rotateX = isHovered ? (mousePosition.y - 0.5) * -20 : 0
  const rotateY = isHovered ? (mousePosition.x - 0.5) * 20 : 0

  return (
    <div 
      ref={containerRef}
      className="relative w-56 h-56 md:w-64 md:h-64 flex-shrink-0"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Animated gradient orbit rings */}
      <div
        className="absolute -inset-6 rounded-full opacity-20 will-change-transform"
        style={{
          background: "conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary)) 60deg, transparent 120deg)",
          animation: animate ? "spin 8s linear infinite" : "none",
        }}
      />
      <div
        className="absolute -inset-8 rounded-full opacity-10 will-change-transform"
        style={{
          background: "conic-gradient(from 180deg, transparent 0deg, hsl(var(--accent)) 60deg, transparent 120deg)",
          animation: animate ? "spin 12s linear infinite reverse" : "none",
        }}
      />
      
      {/* Outer glow ring */}
      <div
        className="absolute -inset-4 rounded-full opacity-30 blur-md"
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), #8b5cf6, hsl(var(--primary)))",
          animation: animate ? "spin 20s linear infinite" : "none",
        }}
      />

      {/* Floating particles (decorative) */}
      {animate && (
        <>
          <div 
            className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/60"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          />
          <div 
            className="absolute -bottom-1 -left-3 w-2 h-2 rounded-full bg-accent/50"
            style={{ animation: 'float 4s ease-in-out infinite 1s' }}
          />
          <div 
            className="absolute top-1/4 -left-4 w-1.5 h-1.5 rounded-full bg-primary/40"
            style={{ animation: 'float 3.5s ease-in-out infinite 0.5s' }}
          />
        </>
      )}

      {/* Main container with profile image - 3D transform */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden will-change-transform transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.05 : 1})`,
          transformStyle: 'preserve-3d',
          animation: animate && !isHovered ? "pulse-gentle 4s ease-in-out infinite" : "none",
        }}
      >
        {/* Profile image as background */}
        <img 
          src={profileImage} 
          alt="Kiarash Adl"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        
        {/* Subtle gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        {/* Dynamic light reflection based on mouse */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, white 0%, transparent 50%)`,
              opacity: 0.15,
            }}
          />
        )}
        
        {/* Shimmer effect - pure CSS */}
        {animate && !isHovered && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent will-change-transform"
            style={{ 
              animation: "shimmer 4s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Border ring with glow on hover */}
      <div 
        className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all duration-300"
        style={{
          ringColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)',
          boxShadow: isHovered ? '0 0 30px -5px hsl(var(--primary) / 0.4)' : 'none',
        }}
      />
      
      {/* Status indicator - pulsing dot */}
      <div className="absolute bottom-2 right-2 flex items-center justify-center">
        <span className="relative flex h-4 w-4">
          {animate && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          )}
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-background"></span>
        </span>
      </div>
    </div>
  )
})

export default AnimatedHeroVisual
