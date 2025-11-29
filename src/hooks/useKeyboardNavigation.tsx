import { useEffect, useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard } from "@phosphor-icons/react"

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
          break
        case "p":
          scrollToSection("projects")
          setCurrentSectionIndex(1)
          break
        case "s":
          scrollToSection("skills")
          setCurrentSectionIndex(2)
          break
        case "e":
          scrollToSection("experience")
          setCurrentSectionIndex(3)
          break
        case "c":
          scrollToSection("contact")
          setCurrentSectionIndex(4)
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
      case "j":
        e.preventDefault()
        const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1)
        setCurrentSectionIndex(nextIndex)
        scrollToSection(sections[nextIndex])
        break
      case "k":
        e.preventDefault()
        const prevIndex = Math.max(currentSectionIndex - 1, 0)
        setCurrentSectionIndex(prevIndex)
        scrollToSection(sections[prevIndex])
        break
      case "t":
        e.preventDefault()
        scrollToTop()
        setCurrentSectionIndex(0)
        break
    }
  }, [lastKey, currentSectionIndex, sections, scrollToSection, scrollToTop])
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
  
  return { showHelp, setShowHelp, shortcuts, lastKey }
}

interface KeyboardHelpProps {
  show: boolean
  onClose: () => void
}

export function KeyboardHelp({ show, onClose }: KeyboardHelpProps) {
  const shortcuts = [
    { keys: ["j"], description: "Next section" },
    { keys: ["k"], description: "Previous section" },
    { keys: ["g", "h"], description: "Go to Home" },
    { keys: ["g", "p"], description: "Go to Projects" },
    { keys: ["g", "s"], description: "Go to Skills" },
    { keys: ["g", "e"], description: "Go to Experience" },
    { keys: ["g", "c"], description: "Go to Contact" },
    { keys: ["t"], description: "Scroll to top" },
    { keys: ["?"], description: "Toggle this help" },
    { keys: ["Esc"], description: "Close" },
  ]
  
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-md p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Keyboard size={24} className="text-primary" weight="fill" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                  <p className="text-sm text-muted-foreground">Navigate like a pro</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.description}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="px-2 py-1 text-xs font-mono font-medium bg-muted rounded border border-border shadow-sm">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border">Esc</kbd> or click outside to close
                </p>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function KeyboardHint() {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    // Hide after 5 seconds
    const timer = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-8 z-30"
        >
          <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 shadow-md">
            <Keyboard size={14} weight="fill" />
            Press <kbd className="px-1 font-mono bg-background rounded text-xs">?</kbd> for shortcuts
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
