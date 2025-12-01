import { memo } from "react"
import profileImage from "@/assets/images/profile-384w.avif"

interface AnimatedHeroVisualProps {
  prefersReducedMotion?: boolean
}

export const AnimatedHeroVisual = memo(function AnimatedHeroVisual({ 
  prefersReducedMotion = false 
}: AnimatedHeroVisualProps) {
  const animate = !prefersReducedMotion

  return (
    <div className="relative w-56 h-56 md:w-64 md:h-64 flex-shrink-0">
      {/* Rotating gradient ring - GPU accelerated with will-change */}
      <div
        className="absolute -inset-4 rounded-full opacity-30 will-change-transform"
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), #8b5cf6, hsl(var(--primary)))",
          animation: animate ? "spin 20s linear infinite" : "none",
        }}
      />

      {/* Main container with profile image */}
      <div 
        className="absolute inset-0 rounded-full overflow-hidden will-change-transform"
        style={{
          animation: animate ? "pulse-gentle 4s ease-in-out infinite" : "none",
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
        
        {/* Shimmer effect - pure CSS */}
        {animate && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent will-change-transform"
            style={{ 
              animation: "shimmer 4s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Border ring */}
      <div className="absolute inset-0 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background" />
    </div>
  )
})

export default AnimatedHeroVisual
