import { useState, useEffect, memo } from "react"
import { cn } from "@/lib/utils"

interface AnimatedNameProps {
  name: string
  className?: string
  delay?: number
}

/**
 * Award-winning animated name reveal
 * Letters slide up with stagger, then gradient shimmers on hover
 */
export const AnimatedName = memo(function AnimatedName({
  name,
  className,
  delay = 300,
}: AnimatedNameProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Trigger reveal animation after delay
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  const letters = name.split("")
  
  return (
    <span
      className={cn(
        "relative inline-flex flex-wrap cursor-default select-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={name}
    >
      {/* Screen reader text */}
      <span className="sr-only">{name}</span>
      
      {/* Animated letters */}
      {letters.map((letter, index) => {
        const isSpace = letter === " "
        // Calculate stagger delay - faster for first letters, slight pause at space
        const staggerDelay = isSpace ? 0 : index * 50
        
        return (
          <span
            key={`${letter}-${index}`}
            aria-hidden="true"
            className={cn(
              "inline-block transition-all duration-500 ease-out",
              isSpace ? "w-3 md:w-4" : "",
              // Initial state: below and invisible
              !isRevealed && "translate-y-[100%] opacity-0",
              // Revealed state: normal position
              isRevealed && "translate-y-0 opacity-100",
              // Hover state: gradient color
              isHovered && !isSpace && "text-primary"
            )}
            style={{
              transitionDelay: isRevealed ? `${staggerDelay}ms` : "0ms",
            }}
          >
            {isSpace ? "\u00A0" : letter}
          </span>
        )
      })}
      
      {/* Animated underline on hover */}
      <span
        className={cn(
          "absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500 ease-out",
          isHovered ? "w-full opacity-100" : "w-0 opacity-0"
        )}
        aria-hidden="true"
      />
      
      {/* Shimmer effect on hover */}
      <span
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -skew-x-12 transition-all duration-700",
          isHovered ? "translate-x-full opacity-100" : "-translate-x-full opacity-0"
        )}
        style={{ 
          maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
        }}
        aria-hidden="true"
      />
    </span>
  )
})
