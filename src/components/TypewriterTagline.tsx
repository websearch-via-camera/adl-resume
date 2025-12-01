import { useState, useEffect, useMemo } from "react"

const taglines = [
  "I Build AI That Works For You",
  "Turning Complex Ideas Into Simple Solutions", 
  "Making Tech Feel Human",
  "From Vision to Reality, Fast",
  "MIT-Trained, Startup-Tested"
]

export function TypewriterTagline() {
  // Respect reduced motion preference
  const prefersReducedMotion = useMemo(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  [])
  
  const [currentIndex, setCurrentIndex] = useState(0)
  // Start with full first tagline for instant LCP - no empty state
  const [displayText, setDisplayText] = useState(taglines[0])
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Delay animation start to ensure LCP is captured with full text
  // Skip animation entirely if reduced motion is preferred
  useEffect(() => {
    if (prefersReducedMotion) return // Keep first tagline static
    
    const startDelay = setTimeout(() => {
      setHasStarted(true)
      // Start by deleting after showing first tagline
      setIsDeleting(true)
    }, 3000) // Wait 3 seconds before starting animation
    
    return () => clearTimeout(startDelay)
  }, [prefersReducedMotion])

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
    <p className="text-xl md:text-2xl font-semibold mb-6 h-8 md:h-10">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x">
        {displayText}
      </span>
      <span className="inline-block w-0.5 h-6 md:h-7 ml-1 bg-gradient-to-b from-primary to-accent animate-pulse align-middle rounded-full" />
    </p>
  )
}
