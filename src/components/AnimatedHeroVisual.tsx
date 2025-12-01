import { memo } from "react"
import { Code, Brain, Cloud, Cpu, Database, Sparkles } from "lucide-react"
import profileImage from "@/assets/images/profile-384w.avif"

interface AnimatedHeroVisualProps {
  prefersReducedMotion?: boolean
}

// Pre-defined icon positions (no runtime calculations)
const FLOATING_ICONS = [
  { Icon: Brain, color: "text-violet-500", position: "top-0 left-4", delay: "0s" },
  { Icon: Code, color: "text-cyan-500", position: "top-4 right-0", delay: "0.3s" },
  { Icon: Cloud, color: "text-blue-500", position: "bottom-4 right-2", delay: "0.6s" },
  { Icon: Database, color: "text-emerald-500", position: "bottom-0 left-8", delay: "0.9s" },
  { Icon: Cpu, color: "text-orange-500", position: "top-1/2 -left-2", delay: "1.2s" },
  { Icon: Sparkles, color: "text-yellow-500", position: "top-1/2 -right-2", delay: "1.5s" },
] as const

// Memoized floating icon - pure CSS animations
const FloatingIconBox = memo(({ 
  Icon, 
  color, 
  position, 
  delay,
  animate 
}: { 
  Icon: typeof Brain
  color: string
  position: string
  delay: string
  animate: boolean
}) => (
  <div
    className={`absolute ${position} w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center`}
    style={{
      animation: animate ? `float-gentle 2.5s ease-in-out infinite` : 'none',
      animationDelay: delay,
    }}
  >
    <Icon className={`h-5 w-5 ${color}`} />
  </div>
))
FloatingIconBox.displayName = "FloatingIconBox"

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
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        {/* Shimmer effect - pure CSS */}
        {animate && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent will-change-transform"
            style={{ 
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
        )}

        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] rounded-full" />
      </div>

      {/* Border ring */}
      <div className="absolute inset-0 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background" />

      {/* Floating tech icons - CSS animations only */}
      {FLOATING_ICONS.map(({ Icon, color, position, delay }, index) => (
        <FloatingIconBox
          key={index}
          Icon={Icon}
          color={color}
          position={position}
          delay={delay}
          animate={animate}
        />
      ))}
    </div>
  )
})

export default AnimatedHeroVisual
