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
 * Native scroll tracking hook - simple and reliable approach
 * Calculates which section is active based on scroll position
 */
export function useNativeScroll(
  sections: string[],
  options: UseNativeScrollOptions = {}
): ScrollState {
  const { throttleMs = 50 } = options // Slightly slower for reliability
  
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    isNavVisible: false,
    showScrollTop: false,
    showScrollIndicator: true,
    scrollProgress: 0,
    activeSection: sections[0] || "home"
  })
  
  const rafRef = useRef<number | null>(null)
  const lastUpdateRef = useRef(0)
  
  const updateState = useCallback(() => {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollableHeight = documentHeight - windowHeight
    const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0
    
    // Calculate active section by finding section positions
    // Store absolute positions (relative to document top)
    const sectionPositions: { id: string; top: number; bottom: number }[] = []
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (!element) continue
      
      const rect = element.getBoundingClientRect()
      const absoluteTop = rect.top + scrollY
      const absoluteBottom = rect.bottom + scrollY
      
      sectionPositions.push({
        id: sectionId,
        top: absoluteTop,
        bottom: absoluteBottom
      })
    }
    
    // Sort by position (should already be in order, but just to be safe)
    sectionPositions.sort((a, b) => a.top - b.top)
    
    // Find active section: the one whose top we've scrolled past
    // Use an offset of 150px (about nav height + some buffer)
    const scrollPosition = scrollY + 150
    let activeSection = sections[0] || "home"
    
    for (const section of sectionPositions) {
      if (scrollPosition >= section.top) {
        activeSection = section.id
      } else {
        break // Sections are sorted, so we can stop here
      }
    }
    
    // Edge case: at very bottom, select last section
    if (scrollY + windowHeight >= documentHeight - 50) {
      activeSection = sections[sections.length - 1] || activeSection
    }
    
    // Edge case: at very top, select first section
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
  }, [sections])
  
  const handleScroll = useCallback(() => {
    const now = performance.now()
    if (now - lastUpdateRef.current < throttleMs) {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null
          handleScroll()
        })
      }
      return
    }
    lastUpdateRef.current = now
    updateState()
  }, [throttleMs, updateState])
  
  useEffect(() => {
    // Initial update after a short delay to ensure DOM is ready
    const initTimer = setTimeout(updateState, 100)
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateState, { passive: true })
    
    return () => {
      clearTimeout(initTimer)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateState)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, updateState])
  
  return state
}
