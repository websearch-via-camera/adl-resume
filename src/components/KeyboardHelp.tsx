import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Keyboard } from "@phosphor-icons/react"

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
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="keyboard-help-title"
          >
            <Card className="w-full max-w-md p-6 shadow-2xl pointer-events-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Keyboard size={24} className="text-primary" weight="fill" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="keyboard-help-title" className="text-xl font-bold">Keyboard Shortcuts</h2>
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
                    onClick={shortcut.description === "Toggle this help" ? onClose : undefined}
                    className={`flex items-center justify-between py-2 border-b border-border last:border-0 ${
                      shortcut.description === "Toggle this help" 
                        ? "bg-primary/10 -mx-2 px-2 rounded-lg border-0 cursor-pointer hover:bg-primary/20 transition-colors" 
                        : ""
                    }`}
                  >
                    <span className={`text-sm ${
                      shortcut.description === "Toggle this help" 
                        ? "font-medium text-primary" 
                        : ""
                    }`}>{shortcut.description}</span>
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
