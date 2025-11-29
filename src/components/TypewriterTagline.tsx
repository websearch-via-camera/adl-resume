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
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  
  useEffect(() => {
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
  }, [displayText, isDeleting, currentIndex])
  
  return (
    <p className="text-xl md:text-2xl font-semibold text-primary mb-6 h-8 md:h-10">
      <span>{displayText}</span>
      <span className="animate-pulse ml-0.5 text-primary/70">|</span>
    </p>
  )
}
