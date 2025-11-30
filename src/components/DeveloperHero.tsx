import { Badge } from "@/components/ui/badge"
import { Terminal, Code, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

interface DeveloperHeroProps {
  onSwitchToVisitor: () => void
  prefersReducedMotion?: boolean
}

export function DeveloperHero({ onSwitchToVisitor, prefersReducedMotion = false }: DeveloperHeroProps) {
  const fadeIn = prefersReducedMotion 
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }

  return (
    <header 
      id="home"
      className="relative pt-20 pb-8 px-6 overflow-hidden"
    >
      {/* Subtle terminal-themed background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-10 left-[5%] w-48 h-48 bg-green-500/5 rounded-full blur-2xl" />
        <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center"
        >
          {/* Compact dev-focused intro */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-4">
            <Terminal className="h-4 w-4 text-green-500" />
            <span className="text-sm font-mono text-green-600 dark:text-green-400">
              Developer Mode Active
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground">
              Welcome, fellow developer! 
            </span>
            <span className="ml-2">👋</span>
          </h1>
          
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            Explore my portfolio through the terminal below. Type <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-sm">help</code> to get started.
          </p>
          
          {/* Quick stats for devs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="font-mono text-xs">
              <Code className="h-3 w-3 mr-1" />
              TypeScript
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              React 18
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              MIT EECS '14
            </Badge>
            <Badge variant="outline" className="text-xs border-green-500/30 text-green-600 bg-green-500/5">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available
            </Badge>
          </div>
          
          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ArrowDown className="h-4 w-4 animate-bounce" />
            <span className="text-xs">Terminal awaits</span>
          </div>
          
          {/* Option to switch modes */}
          <button
            onClick={onSwitchToVisitor}
            className="mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Not a developer? Switch to regular view
          </button>
        </motion.div>
      </div>
    </header>
  )
}

export default DeveloperHero
