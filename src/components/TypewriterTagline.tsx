import { useState, useEffect } from "react"

const taglines = [
  "Senior Software Engineer",
  "Full-Stack AI Systems Architect", 
  "MIT EECS '14",
  "Building AI-Native Products",
  "From Prototype to Production"
]

export function TypewriterTagline() {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Start with full first tagline for instant LCP - no empty state
  const [displayText, setDisplayText] = useState(taglines[0])
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Delay animation start to ensure LCP is captured with full text
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setHasStarted(true)
      // Start by deleting after showing first tagline
      setIsDeleting(true)
    }, 3000) // Wait 3 seconds before starting animation
    
    return () => clearTimeout(startDelay)
  }, [])

  useEffect(() => {
    // Don't animate until we've started
    if (!hasStarted) return
    
    const currentTagline = taglines[currentIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentTagline.length) {
          setDisplayText(currentTagline.slice(0, displayText.length + 1))
        } else {
          // Pause at end before deleting
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % taglines.length)
        }
      }
    }, isDeleting ? 30 : 80)
    
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, hasStarted])
  
  return (
    <p className="text-xl md:text-2xl font-semibold text-primary mb-6 h-8 md:h-10">
      <span>{displayText}</span>
      <span className="animate-pulse ml-0.5 text-primary/70">|</span>
    </p>
  )
}
