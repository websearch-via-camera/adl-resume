import { useState, useEffect, useRef, useCallback } from "react"

interface UseNativeScrollOptions {
  throttleMs?: number
}

interface ScrollState {
  scrollY: number
  isNavVisible: boolean
  showScrollTop: boolean
  showScrollIndicator: boolean
  scrollProgress: number
  activeSection: string
}

/**
 * Native scroll tracking hook that replaces framer-motion's useScroll
 * This reduces the initial bundle by ~120KB by not loading framer-motion on initial render
 * 
 * Uses getBoundingClientRect for accurate section detection on all devices
 */
export function useNativeScroll(
  sections: string[],
  options: UseNativeScrollOptions = {}
): ScrollState {
  const { throttleMs = 16 } = options // ~60fps
  
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    isNavVisible: false,
    showScrollTop: false,
    showScrollIndicator: true,
    scrollProgress: 0,
    activeSection: sections[0] || "home"
  })
  
  const lastUpdateRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  
  // Scroll handler with RAF throttling
  const handleScroll = useCallback(() => {
    const now = performance.now()
    if (now - lastUpdateRef.current < throttleMs) {
      // Schedule update on next frame if not already scheduled
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null
          handleScroll()
        })
      }
      return
    }
    lastUpdateRef.current = now
    
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollableHeight = documentHeight - windowHeight
    const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0
    
    // Find active section using getBoundingClientRect for accuracy
    // Use 40% of viewport height as the detection threshold
    const detectionPoint = windowHeight * 0.4
    let activeSection = sections[0] || "home"
    let closestDistance = Infinity
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (!element) continue
      
      const rect = element.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      
      // Check if section is visible in the viewport
      if (sectionTop <= detectionPoint && sectionBottom > 0) {
        // Calculate distance from detection point to section top
        const distance = Math.abs(sectionTop - detectionPoint)
        
        // Prefer sections whose top is closest to (but above) the detection point
        if (sectionTop <= detectionPoint && distance < closestDistance) {
          closestDistance = distance
          activeSection = sectionId
        }
      }
    }
    
    // Special case: if we're near the bottom of the page, select the last section
    if (scrollY + windowHeight >= documentHeight - 50) {
      activeSection = sections[sections.length - 1] || activeSection
    }
    
    // Special case: if we're at the top, select the first section
    if (scrollY < 100) {
      activeSection = sections[0] || "home"
    }
    
    setState({
      scrollY,
      isNavVisible: scrollY > 200,
      showScrollTop: scrollY > 400,
      showScrollIndicator: scrollY < 100,
      scrollProgress: Math.min(Math.max(progress, 0), 100),
      activeSection
    })
  }, [sections, throttleMs])
  
  useEffect(() => {
    // Initial call
    handleScroll()
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    // Also listen for resize to recalculate positions
    window.addEventListener("resize", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])
  
  return state
}
