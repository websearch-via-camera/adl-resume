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
    
    // Find active section - use a simple approach that works on mobile
    // The section whose top is closest to (but above) the top 1/3 of the viewport wins
    const viewportTrigger = windowHeight * 0.33
    let activeSection = sections[0] || "home"
    let bestScore = -Infinity
    
    for (const sectionId of sections) {
      // Find ALL elements with this ID and pick the visible one
      const elements = document.querySelectorAll(`#${sectionId}`)
      let element: Element | null = null
      
      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        // Pick the element that's actually in the document flow (has height and is visible)
        if (rect.height > 0 && rect.bottom > 0) {
          element = el
          break
        }
      }
      
      if (!element) continue
      
      const rect = element.getBoundingClientRect()
      const sectionTop = rect.top
      const sectionBottom = rect.bottom
      
      // Section must be at least partially visible
      if (sectionBottom <= 0 || sectionTop >= windowHeight) continue
      
      // Score: how much of the section is above the trigger point
      // Higher score = section top is closer to (but above) the trigger point
      if (sectionTop <= viewportTrigger) {
        // The closer to the trigger (from above), the better the score
        const score = -sectionTop // Negative because we want sections higher up to have lower (more negative) tops
        if (score > bestScore) {
          bestScore = score
          activeSection = sectionId
        }
      }
    }
    
    // Special case: if we're near the bottom of the page, select the last section
    if (scrollY + windowHeight >= documentHeight - 100) {
      activeSection = sections[sections.length - 1] || activeSection
    }
    
    // Special case: if we're at the very top, select the first section
    if (scrollY < 50) {
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
