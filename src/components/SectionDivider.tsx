import { cn } from "@/lib/utils"
import { memo } from "react"

interface SectionDividerProps {
  variant?: "default" | "ornate" | "gradient" | "dots" | "wave"
  className?: string
}

// Pre-computed dots to avoid array creation on each render
const DOTS_CONFIG = [
  { size: "w-1 h-1", bg: "bg-primary/20" },
  { size: "w-1.5 h-1.5", bg: "bg-primary/30" },
  { size: "w-2 h-2", bg: "bg-primary/50" },
  { size: "w-2.5 h-2.5", bg: "bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/30" },
  { size: "w-2 h-2", bg: "bg-primary/50" },
  { size: "w-1.5 h-1.5", bg: "bg-primary/30" },
  { size: "w-1 h-1", bg: "bg-primary/20" },
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
            className="w-full h-6 text-border"
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 12 Q 150 0, 300 12 T 600 12 T 900 12 T 1200 12"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M0 12 Q 150 24, 300 12 T 600 12 T 900 12 T 1200 12"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            {/* Center accent */}
            <circle cx="600" cy="12" r="4" fill="currentColor" opacity="0.3" />
            <circle cx="600" cy="12" r="2" className="fill-primary" />
          </svg>
        </div>
      </div>
    )
  }

  // Default: elegant diamond divider (optimized - no blur)
  return (
    <div className={cn("py-10 md:py-14 contain-layout contain-style", className)} aria-hidden="true">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-center gap-4">
          {/* Left gradient line */}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-border" />
          
          {/* Diamond ornament - no blur for performance */}
          <div className="relative flex items-center justify-center">
            {/* Diamond shape */}
            <div className="w-4 h-4 rotate-45 rounded-sm bg-gradient-to-br from-primary/80 to-accent/60 shadow-md shadow-primary/20" />
            
            {/* Side accents */}
            <div className="absolute left-[-20px] w-3 h-px bg-gradient-to-r from-transparent to-primary/60" />
            <div className="absolute right-[-20px] w-3 h-px bg-gradient-to-l from-transparent to-primary/60" />
          </div>
          
          {/* Right gradient line */}
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border/50 to-border" />
        </div>
      </div>
    </div>
  )
})
