import { useEffect, useRef, useState, ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** HTML id attribute */
  id?: string
  /** Delay in ms before animation starts after becoming visible */
  delay?: number
  /** Whether to use stagger animation for children */
  stagger?: boolean
}

/**
 * CSS-based scroll reveal animation component.
 * Uses Intersection Observer for performance - no JS animation library needed.
 * Each element handles its own visibility via IntersectionObserver.
 */
export function ScrollReveal({ 
  children, 
  className = "", 
  id,
  delay = 0,
  stagger = false 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference - show immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay)
          } else {
            setIsVisible(true)
          }
          // Once visible, stop observing
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.05,
        rootMargin: "50px"
      }
    )

    observer.observe(element)
    
    // Fallback: if element is already in view on mount, show it immediately
    // Use RAF to batch the read and avoid forced reflow during render
    requestAnimationFrame(() => {
      if (!element) return
      const rect = element.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (delay > 0) {
          setTimeout(() => setIsVisible(true), delay)
        } else {
          setIsVisible(true)
        }
      }
    })
    
    return () => observer.disconnect()
  }, [delay])

  // Filter out scroll-reveal-child from className (legacy usage)
  const filteredClassName = className.replace(/scroll-reveal-child/g, '').trim()
  
  return (
    <div
      ref={ref}
      id={id}
      className={`scroll-reveal ${isVisible ? 'scroll-reveal-visible' : ''} ${stagger ? 'scroll-reveal-stagger' : ''} ${filteredClassName}`}
    >
      {children}
    </div>
  )
}

/**
 * Container for grouping ScrollReveal elements.
 * Each child ScrollReveal handles its own visibility.
 * This container is kept for backwards compatibility and semantic grouping.
 */
export function ScrollRevealContainer({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
