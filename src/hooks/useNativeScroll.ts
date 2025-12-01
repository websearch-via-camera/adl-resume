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

interface SectionPosition {
  id: string
  top: number
  bottom: number
}

/**
 * Native scroll tracking hook - optimized to avoid forced reflows
 * Caches section positions and only recalculates on resize
 */
export function useNativeScroll(
  sections: string[],
  options: UseNativeScrollOptions = {}
): ScrollState {
  const { throttleMs = 50 } = options
  
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
  // Cache section positions to avoid forced reflows on every scroll
  const sectionPositionsRef = useRef<SectionPosition[]>([])
  const documentHeightRef = useRef(0)
  
  // Calculate section positions - only called on mount and resize
  const calculateSectionPositions = useCallback(() => {
    const scrollY = window.scrollY
    const positions: SectionPosition[] = []
    
    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (!element) continue
      
      const rect = element.getBoundingClientRect()
      positions.push({
        id: sectionId,
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY
      })
    }
    
    // Sort by position
    positions.sort((a, b) => a.top - b.top)
    sectionPositionsRef.current = positions
    documentHeightRef.current = document.documentElement.scrollHeight
  }, [sections])
  
  // Fast scroll handler - uses cached positions, no getBoundingClientRect
  const updateState = useCallback(() => {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = documentHeightRef.current || document.documentElement.scrollHeight
    const scrollableHeight = documentHeight - windowHeight
    const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0
    
    // Find active section using cached positions
    const scrollPosition = scrollY + 150
    let activeSection = sections[0] || "home"
    
    for (const section of sectionPositionsRef.current) {
      if (scrollPosition >= section.top) {
        activeSection = section.id
      } else {
        break
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
  
  // Recalculate positions on resize (debounced)
  const handleResize = useCallback(() => {
    calculateSectionPositions()
    updateState()
  }, [calculateSectionPositions, updateState])
  
  useEffect(() => {
    // Initial calculation after DOM is ready
    const initTimer = setTimeout(() => {
      calculateSectionPositions()
      updateState()
    }, 100)
    
    // Recalculate positions periodically for dynamic content
    // This handles cases where content height changes (e.g., lazy loading)
    const recalcTimer = setInterval(calculateSectionPositions, 2000)
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })
    
    return () => {
      clearTimeout(initTimer)
      clearInterval(recalcTimer)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, handleResize, calculateSectionPositions, updateState])
  
  return state
}
