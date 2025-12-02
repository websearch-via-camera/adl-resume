import { useEffect, useCallback, useState } from "react"

interface KeyboardShortcut {
  keys: string[]
  description: string
  action: () => void
}

interface UseKeyboardNavigationProps {
  sections: string[]
  scrollToSection: (sectionId: string) => void
  scrollToTop: () => void
}

export function useKeyboardNavigation({ 
  sections, 
  scrollToSection, 
  scrollToTop 
}: UseKeyboardNavigationProps) {
  const [showHelp, setShowHelp] = useState(false)
  const [lastKey, setLastKey] = useState<string | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  
  const shortcuts: KeyboardShortcut[] = [
    { keys: ["j"], description: "Next section", action: () => {} },
    { keys: ["k"], description: "Previous section", action: () => {} },
    { keys: ["g", "h"], description: "Go to Home", action: () => scrollToSection("home") },
    { keys: ["g", "p"], description: "Go to Projects", action: () => scrollToSection("projects") },
    { keys: ["g", "s"], description: "Go to Skills", action: () => scrollToSection("skills") },
    { keys: ["g", "e"], description: "Go to Experience", action: () => scrollToSection("experience") },
    { keys: ["g", "c"], description: "Go to Contact", action: () => scrollToSection("contact") },
    { keys: ["t"], description: "Scroll to top", action: scrollToTop },
    { keys: ["?"], description: "Toggle this help", action: () => setShowHelp(prev => !prev) },
    { keys: ["Esc"], description: "Close help", action: () => setShowHelp(false) },
  ]
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }
    
    const key = e.key.toLowerCase()
    
    // Handle Escape
    if (e.key === "Escape") {
      setShowHelp(false)
      setLastKey(null)
      return
    }
    
    // Handle ? for help
    if (key === "?" || (e.shiftKey && key === "/")) {
      e.preventDefault()
      setShowHelp(prev => !prev)
      return
    }
    
    // Handle two-key combos (g + letter)
    if (lastKey === "g") {
      e.preventDefault()
      switch (key) {
        case "h":
          scrollToSection("home")
          setCurrentSectionIndex(0)
          setShowHelp(false)
          break
        case "p":
          scrollToSection("projects")
          setCurrentSectionIndex(1)
          setShowHelp(false)
          break
        case "s":
          scrollToSection("skills")
          setCurrentSectionIndex(2)
          setShowHelp(false)
          break
        case "e":
          scrollToSection("experience")
          setCurrentSectionIndex(3)
          setShowHelp(false)
          break
        case "c":
          scrollToSection("contact")
          setCurrentSectionIndex(4)
          setShowHelp(false)
          break
      }
      setLastKey(null)
      return
    }
    
    // Handle single keys
    switch (key) {
      case "g":
        setLastKey("g")
        // Clear after 1 second if no follow-up
        setTimeout(() => setLastKey(null), 1000)
        break
      case "j": {
        e.preventDefault()
        const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1)
        setCurrentSectionIndex(nextIndex)
        scrollToSection(sections[nextIndex])
        setShowHelp(false)
        break
      }
      case "k": {
        e.preventDefault()
        const prevIndex = Math.max(currentSectionIndex - 1, 0)
        setCurrentSectionIndex(prevIndex)
        scrollToSection(sections[prevIndex])
        setShowHelp(false)
        break
      }
      case "t":
        e.preventDefault()
        scrollToTop()
        setCurrentSectionIndex(0)
        setShowHelp(false)
        break
    }
  }, [lastKey, currentSectionIndex, sections, scrollToSection, scrollToTop])
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
  
  return { showHelp, setShowHelp, shortcuts, lastKey }
}
