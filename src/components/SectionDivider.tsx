import { cn } from "@/lib/utils"
import { memo } from "react"

interface SectionDividerProps {
  variant?: "default" | "ornate" | "gradient" | "dots" | "wave" | "sparkle" | "constellation"
  className?: string
}

// Pre-computed dots to avoid array creation on each render
const DOTS_CONFIG = [
  { size: "w-1 h-1", bg: "bg-primary/20", delay: "0s" },
  { size: "w-1.5 h-1.5", bg: "bg-primary/40", delay: "0.1s" },
  { size: "w-2 h-2", bg: "bg-primary/60", delay: "0.2s" },
  { size: "w-3 h-3", bg: "bg-gradient-to-br from-primary via-accent to-primary shadow-lg shadow-primary/40", delay: "0.3s" },
  { size: "w-2 h-2", bg: "bg-primary/60", delay: "0.4s" },
  { size: "w-1.5 h-1.5", bg: "bg-primary/40", delay: "0.5s" },
  { size: "w-1 h-1", bg: "bg-primary/20", delay: "0.6s" },
] as const

// Sparkle positions for the sparkle variant
const SPARKLES = [
  { left: "10%", size: "w-1 h-1", opacity: "opacity-40" },
  { left: "25%", size: "w-1.5 h-1.5", opacity: "opacity-60" },
  { left: "40%", size: "w-1 h-1", opacity: "opacity-30" },
  { left: "60%", size: "w-1 h-1", opacity: "opacity-50" },
  { left: "75%", size: "w-1.5 h-1.5", opacity: "opacity-40" },
  { left: "90%", size: "w-1 h-1", opacity: "opacity-30" },
] as const

export const SectionDivider = memo(function SectionDivider({ variant = "default", className }: SectionDividerProps) {
  if (variant === "ornate") {
    return (
      <div className={cn("py-8 md:py-12 contain-layout contain-style", className)} aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            {/* Left decorative line */}
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" />
            
            {/* Center ornament - static, no animations for performance */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/20" />
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            </div>
            
            {/* Right decorative line */}
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "gradient") {
    return (
      <div className={cn("py-8 md:py-12 contain-layout contain-style", className)} aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative h-px w-full overflow-hidden">
            {/* Static gradient line - removed animation for better Speed Index */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {/* Base line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("py-8 md:py-12 contain-layout contain-style", className)} aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3">
            {DOTS_CONFIG.map((dot, i) => (
              <div key={i} className={cn("rounded-full", dot.size, dot.bg)} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "wave") {
    return (
      <div className={cn("py-6 md:py-10 contain-layout contain-style", className)} aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <svg
            className="w-full h-8 text-border"
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            {/* Animated wave paths */}
            <path
              d="M0 16 Q 150 4, 300 16 T 600 16 T 900 16 T 1200 16"
              stroke="url(#wave-gradient)"
              strokeWidth="1.5"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M0 16 Q 150 28, 300 16 T 600 16 T 900 16 T 1200 16"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                <stop offset="50%" className="[stop-color:var(--primary)]" stopOpacity="0.6" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Center accent with glow */}
            <circle cx="600" cy="16" r="6" fill="currentColor" opacity="0.15" />
            <circle cx="600" cy="16" r="4" className="fill-primary/60" />
            <circle cx="600" cy="16" r="2" className="fill-primary" />
          </svg>
        </div>
      </div>
    )
  }

  if (variant === "sparkle") {
    return (
      <div className={cn("py-10 md:py-14 contain-layout contain-style", className)} aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative flex items-center justify-center">
            {/* Left gradient line */}
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-border" />
            
            {/* Sparkle center */}
            <div className="relative mx-8">
              {/* Outer glow ring - reduced blur for performance */}
              <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-lg" />
              
              {/* Main sparkle */}
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
                {/* Four-pointed star */}
                <path
                  d="M20 0 L22 15 L40 20 L22 25 L20 40 L18 25 L0 20 L18 15 Z"
                  fill="currentColor"
                  className="opacity-80"
                />
                {/* Inner glow */}
                <circle cx="20" cy="20" r="4" className="fill-primary-foreground/80" />
              </svg>
              
              {/* Floating sparkles */}
              {SPARKLES.map((sparkle, i) => (
                <div
                  key={i}
                  className={cn("absolute top-1/2 -translate-y-1/2 rounded-full bg-primary", sparkle.size, sparkle.opacity)}
                  style={{ left: sparkle.left }}
                />
              ))}
            </div>
            
            {/* Right gradient line */}
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border/50 to-border" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "constellation") {
    return (
      <div className={cn("py-8 md:py-12 contain-layout contain-style", className)} aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <svg className="w-full h-16" viewBox="0 0 800 64" preserveAspectRatio="xMidYMid meet">
            {/* Connecting lines */}
            <line x1="100" y1="32" x2="200" y2="24" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-border" />
            <line x1="200" y1="24" x2="300" y2="36" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-border" />
            <line x1="300" y1="36" x2="400" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.5" className="text-primary" />
            <line x1="400" y1="32" x2="500" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-border" />
            <line x1="500" y1="28" x2="600" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-border" />
            <line x1="600" y1="40" x2="700" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.3" className="text-border" />
            
            {/* Stars */}
            <circle cx="100" cy="32" r="2" className="fill-muted-foreground/40" />
            <circle cx="200" cy="24" r="2.5" className="fill-primary/50" />
            <circle cx="300" cy="36" r="2" className="fill-muted-foreground/40" />
            <circle cx="400" cy="32" r="5" className="fill-primary" />
            <circle cx="400" cy="32" r="3" className="fill-primary-foreground/60" />
            <circle cx="500" cy="28" r="2" className="fill-muted-foreground/40" />
            <circle cx="600" cy="40" r="2.5" className="fill-primary/50" />
            <circle cx="700" cy="32" r="2" className="fill-muted-foreground/40" />
            
            {/* Outer glow on center star */}
            <circle cx="400" cy="32" r="12" className="fill-primary/10" />
          </svg>
        </div>
      </div>
    )
  }

  // Default: elegant diamond divider with enhanced styling
  return (
    <div className={cn("py-10 md:py-14 contain-layout contain-style", className)} aria-hidden="true">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-center gap-4">
          {/* Left gradient line with glow */}
          <div className="flex-1 relative">
            <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-border" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-4 bg-gradient-to-l from-primary/20 to-transparent blur-sm" />
          </div>
          
          {/* Enhanced diamond ornament */}
          <div className="relative flex items-center justify-center group">
            {/* Outer glow ring */}
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-lg" />
            
            {/* Diamond container */}
            <div className="relative">
              {/* Shadow diamond */}
              <div className="absolute inset-0 w-5 h-5 rotate-45 rounded-sm bg-primary/30 blur-sm translate-y-1" />
              
              {/* Main diamond */}
              <div className="w-5 h-5 rotate-45 rounded-sm bg-gradient-to-br from-primary via-accent to-primary shadow-lg">
                {/* Inner shine */}
                <div className="absolute inset-0.5 rounded-sm bg-gradient-to-br from-primary-foreground/20 to-transparent" />
              </div>
            </div>
            
            {/* Side accent dots */}
            <div className="absolute left-[-24px] flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary/40" />
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-primary/60" />
            </div>
            <div className="absolute right-[-24px] flex items-center gap-1">
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-primary/60" />
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </div>
          </div>
          
          {/* Right gradient line with glow */}
          <div className="flex-1 relative">
            <div className="h-px bg-gradient-to-l from-transparent via-border/30 to-border" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-4 bg-gradient-to-r from-primary/20 to-transparent blur-sm" />
          </div>
        </div>
      </div>
    </div>
  )
})
