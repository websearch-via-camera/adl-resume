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
 * 
 * When used inside ScrollRevealContainer with className="scroll-reveal-child",
 * the visibility is controlled by the parent container's CSS.
 * When used standalone, it handles its own visibility via IntersectionObserver.
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
  
  // Check if this is a child element (controlled by parent container's CSS)
  const isChildElement = className.includes('scroll-reveal-child')

  useEffect(() => {
    // If it's a child element, the parent container handles visibility via CSS
    if (isChildElement) {
      return
    }
    
    const element = ref.current
    if (!element) return

    // Check for reduced motion preference
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
        threshold: 0.1,
        rootMargin: "-50px"
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, isChildElement])

  // For child elements, don't add scroll-reveal class (parent CSS handles animation)
  // For standalone elements, add scroll-reveal and visibility class
  const computedClassName = isChildElement
    ? `scroll-reveal-child ${className.replace('scroll-reveal-child', '').trim()}`
    : `scroll-reveal ${isVisible ? 'scroll-reveal-visible' : ''} ${stagger ? 'scroll-reveal-stagger' : ''} ${className}`

  return (
    <div
      ref={ref}
      id={id}
      className={computedClassName}
    >
      {children}
    </div>
  )
}

/**
 * Container that staggers its children's animations
 */
export function ScrollRevealContainer({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-100px"
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal-container ${isVisible ? 'scroll-reveal-container-visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
