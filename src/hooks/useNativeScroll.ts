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
 * Native scroll tracking hook using IntersectionObserver for reliable section detection
 * Works consistently on mobile and desktop
 */
export function useNativeScroll(
  sections: string[],
  options: UseNativeScrollOptions = {}
): ScrollState {
  const { throttleMs = 16 } = options
  
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    isNavVisible: false,
    showScrollTop: false,
    showScrollIndicator: true,
    scrollProgress: 0,
  })
  
  const [activeSection, setActiveSection] = useState(sections[0] || "home")
  const visibleSectionsRef = useRef<Map<string, number>>(new Map())
  const lastUpdateRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  
  // Track scroll position for progress bar and nav visibility
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
    
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollableHeight = documentHeight - windowHeight
    const progress = scrollableHeight > 0 ? (scrollY / scrollableHeight) * 100 : 0
    
    setScrollState({
      scrollY,
      isNavVisible: scrollY > 200,
      showScrollTop: scrollY > 400,
      showScrollIndicator: scrollY < 100,
      scrollProgress: Math.min(Math.max(progress, 0), 100),
    })
  }, [throttleMs])
  
  // Use IntersectionObserver to track which sections are visible
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id
        if (!sectionId || !sections.includes(sectionId)) return
        
        if (entry.isIntersecting) {
          // Store the intersection ratio for this section
          visibleSectionsRef.current.set(sectionId, entry.intersectionRatio)
        } else {
          visibleSectionsRef.current.delete(sectionId)
        }
      })
      
      // Determine active section: prefer the one highest in the sections array that is visible
      // This ensures proper order as user scrolls
      let newActiveSection = sections[0] || "home"
      
      for (const sectionId of sections) {
        if (visibleSectionsRef.current.has(sectionId)) {
          newActiveSection = sectionId
          // Don't break - we want the LAST visible section in document order
          // Actually, let's find the one with highest intersection ratio among visible
        }
      }
      
      // Better approach: find the section that's most "in view"
      // For sections near the top of viewport, they should win
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Find all visible sections and pick the one whose top is closest to viewport top
      let bestSection = sections[0] || "home"
      let bestDistance = Infinity
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (!element) continue
        
        const rect = element.getBoundingClientRect()
        // Section is "active" if its top has scrolled past the top 25% of viewport
        // and its bottom is still visible
        if (rect.top <= windowHeight * 0.25 && rect.bottom > 0) {
          // Distance from top of viewport - smaller is better (section is higher up)
          const distance = Math.abs(rect.top)
          if (rect.top <= windowHeight * 0.25) {
            bestSection = sectionId
            bestDistance = distance
          }
        }
      }
      
      // Edge case: at very top of page
      if (scrollY < 100) {
        bestSection = sections[0] || "home"
      }
      
      // Edge case: at bottom of page
      const documentHeight = document.documentElement.scrollHeight
      if (scrollY + windowHeight >= documentHeight - 100) {
        bestSection = sections[sections.length - 1] || bestSection
      }
      
      setActiveSection(bestSection)
    }
    
    // Create observer with multiple thresholds for better accuracy
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // viewport
      rootMargin: "-20% 0px -60% 0px", // Trigger when section enters top 20-40% of viewport
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    })
    
    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })
    
    return () => observer.disconnect()
  }, [sections])
  
  // Also update active section on scroll for immediate feedback
  useEffect(() => {
    const updateActiveOnScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Find the section whose top is above 25% viewport mark
      let currentSection = sections[0] || "home"
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (!element) continue
        
        const rect = element.getBoundingClientRect()
        // If section top has scrolled above the 25% mark of viewport, it's current
        if (rect.top <= windowHeight * 0.25) {
          currentSection = sectionId
        }
      }
      
      // Edge cases
      if (scrollY < 100) {
        currentSection = sections[0] || "home"
      }
      if (scrollY + windowHeight >= documentHeight - 100) {
        currentSection = sections[sections.length - 1] || currentSection
      }
      
      setActiveSection(currentSection)
    }
    
    window.addEventListener("scroll", updateActiveOnScroll, { passive: true })
    // Initial call
    updateActiveOnScroll()
    
    return () => window.removeEventListener("scroll", updateActiveOnScroll)
  }, [sections])
  
  useEffect(() => {
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])
  
  return {
    ...scrollState,
    activeSection,
  }
}
