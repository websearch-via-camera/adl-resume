import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"

interface A11yContextType {
  announce: (message: string, priority?: "polite" | "assertive") => void
  prefersReducedMotion: boolean
}

const A11yContext = createContext<A11yContextType | undefined>(undefined)

export function useA11y() {
  const context = useContext(A11yContext)
  if (!context) {
    throw new Error("useA11y must be used within an A11yProvider")
  }
  return context
}

interface A11yProviderProps {
  children: ReactNode
}

export function A11yProvider({ children }: A11yProviderProps) {
  const [politeMessage, setPoliteMessage] = useState("")
  const [assertiveMessage, setAssertiveMessage] = useState("")
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Announce messages to screen readers
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveMessage("")
      // Small delay to ensure the region is cleared first
      setTimeout(() => setAssertiveMessage(message), 50)
    } else {
      setPoliteMessage("")
      setTimeout(() => setPoliteMessage(message), 50)
    }

    // Clear the message after a delay to allow for repeated announcements
    setTimeout(() => {
      if (priority === "assertive") {
        setAssertiveMessage("")
      } else {
        setPoliteMessage("")
      }
    }, 1000)
  }, [])

  return (
    <A11yContext.Provider value={{ announce, prefersReducedMotion }}>
      {children}
      
      {/* ARIA Live Regions for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </A11yContext.Provider>
  )
}

// Skip Links Component
export function SkipLinks() {
  const skipLinks = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#projects", label: "Skip to projects" },
    { href: "#skills", label: "Skip to skills" },
    { href: "#contact", label: "Skip to contact" },
  ]

  return (
    <nav
      aria-label="Skip links"
      className="sr-only focus-within:not-sr-only"
    >
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm shadow-lg transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}

// Hook to use reduced motion preference
export function useReducedMotion() {
  const { prefersReducedMotion } = useA11y()
  return prefersReducedMotion
}
