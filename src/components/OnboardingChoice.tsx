import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, User, Code, Sparkle } from "@phosphor-icons/react"

interface OnboardingChoiceProps {
  onChoice: (isDeveloper: boolean) => void
}

export function OnboardingChoice({ onChoice }: OnboardingChoiceProps) {
  const [hoveredOption, setHoveredOption] = useState<"dev" | "visitor" | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  const handleChoice = (isDeveloper: boolean) => {
    setIsExiting(true)
    // Small delay for exit animation
    setTimeout(() => {
      onChoice(isDeveloper)
    }, 400)
  }

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center px-6"
        >
          {/* Subtle animated background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-2xl w-full text-center"
          >
            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Hey there! 👋
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
                Are you a developer like Kiarash?
              </p>
            </motion.div>

            {/* Choice buttons */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Developer option */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={() => handleChoice(true)}
                onMouseEnter={() => setHoveredOption("dev")}
                onMouseLeave={() => setHoveredOption(null)}
                className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                  hoveredOption === "dev"
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl transition-colors duration-300 ${
                      hoveredOption === "dev"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <Terminal size={28} weight="bold" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      Yes, I code! 💻
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Take me to the terminal. Let me explore this site like a pro.
                    </p>
                  </div>
                </div>
                
                {/* Terminal preview hint */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredOption === "dev" ? 1 : 0,
                    height: hoveredOption === "dev" ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-3 bg-[#1a1a1a] rounded-lg font-mono text-xs text-green-400">
                    <span className="text-gray-500">$</span> kiarash --help
                    <br />
                    <span className="text-gray-400">Available commands: about, skills, projects...</span>
                  </div>
                </motion.div>

                {/* Decorative code symbols */}
                <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Code size={32} weight="bold" />
                </div>
              </motion.button>

              {/* Non-developer option */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onClick={() => handleChoice(false)}
                onMouseEnter={() => setHoveredOption("visitor")}
                onMouseLeave={() => setHoveredOption(null)}
                className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left ${
                  hoveredOption === "visitor"
                    ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                    : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl transition-colors duration-300 ${
                      hoveredOption === "visitor"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                    }`}
                  >
                    <User size={28} weight="bold" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                      Nope, just visiting! 👀
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Show me the portfolio the regular way. Keep it simple.
                    </p>
                  </div>
                </div>

                {/* Preview hint */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredOption === "visitor" ? 1 : 0,
                    height: hoveredOption === "visitor" ? "auto" : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                    📖 Clean layout • Easy navigation • All the good stuff
                  </div>
                </motion.div>

                {/* Decorative user symbol */}
                <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User size={32} weight="bold" />
                </div>
              </motion.button>
            </div>

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 text-xs text-muted-foreground"
            >
              Your choice is remembered for next time
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
