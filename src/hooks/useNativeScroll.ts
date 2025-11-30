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
  
  // Cache section offsets
  const sectionOffsetsRef = useRef<{ id: string; offsetTop: number }[]>([])
  const lastUpdateRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  
  // Update section offsets on mount and resize
  useEffect(() => {
    const updateOffsets = () => {
      sectionOffsetsRef.current = sections.map(id => {
        const element = document.getElementById(id)
        return {
          id,
          offsetTop: element ? element.offsetTop : 0
        }
      })
    }
    
    updateOffsets()
    window.addEventListener("resize", updateOffsets, { passive: true })
    return () => window.removeEventListener("resize", updateOffsets)
  }, [sections])
  
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
    
    // Find active section
    const scrollTop = scrollY + 150
    let activeSection = sections[0] || "home"
    for (let i = sectionOffsetsRef.current.length - 1; i >= 0; i--) {
      if (scrollTop >= sectionOffsetsRef.current[i].offsetTop) {
        activeSection = sectionOffsetsRef.current[i].id
        break
      }
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
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])
  
  return state
}
