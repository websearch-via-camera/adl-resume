import { useState, useEffect } from "react"
import { Terminal, User, Code, Sparkles } from "lucide-react"

interface OnboardingChoiceProps {
  onChoice: (isDeveloper: boolean) => void
}

export function OnboardingChoice({ onChoice }: OnboardingChoiceProps) {
  const [hoveredOption, setHoveredOption] = useState<"dev" | "visitor" | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [showContent, setShowContent] = useState(false)
  
  // Respect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Staggered entrance animation (instant if reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) {
      setShowContent(true)
      return
    }
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  const handleChoice = (isDeveloper: boolean) => {
    setIsExiting(true)
    // Small delay for exit animation (skip if reduced motion)
    setTimeout(() => {
      onChoice(isDeveloper)
    }, prefersReducedMotion ? 0 : 500)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center px-6 transition-all duration-500 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Aurora background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-50"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 40%, oklch(from var(--primary) l c h / 0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 60%, oklch(from var(--accent) l c h / 0.1), transparent)
            `,
            animation: showContent && !prefersReducedMotion ? 'aurora-shift 10s ease-in-out infinite' : 'none',
          }}
        />
        
        {/* Floating particles - hidden if reduced motion */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/30"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animation: showContent ? `float ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s` : 'none',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div 
        className={`relative max-w-2xl w-full text-center transition-all duration-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Sparkle decoration */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <Sparkles className={`h-6 w-6 text-primary/60 transition-all duration-700 delay-300 ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`} />
        </div>

        {/* Welcome text with staggered animation */}
        <div className="mb-8">
          <h1 
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 transition-all duration-700 delay-100 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary">
              Hey there!
            </span>{" "}
            <span 
              className={`inline-block ${prefersReducedMotion ? '' : 'animate-wave'}`} 
              style={{ animationDelay: prefersReducedMotion ? undefined : '0.5s' }}
            >👋</span>
          </h1>
          <p 
            className={`text-lg md:text-xl text-muted-foreground max-w-md mx-auto transition-all duration-700 delay-200 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Are you a developer like Kiarash?
          </p>
        </div>

        {/* Choice buttons with enhanced styling */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Developer option */}
          <button
            onClick={() => handleChoice(true)}
            onMouseEnter={() => setHoveredOption("dev")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 md:p-8 rounded-2xl border-2 text-left overflow-hidden transition-all duration-500 delay-300 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${
              hoveredOption === "dev"
                ? "border-primary bg-primary/5 shadow-2xl shadow-primary/20"
                : "border-border bg-card hover:border-primary/50"
            }`}
            aria-label="Yes, I code - take me to the terminal to explore this site like a developer"
          >
            {/* Glow effect on hover */}
            <div 
              className={`absolute -inset-px rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 blur-xl transition-opacity duration-500 ${
                hoveredOption === "dev" ? "opacity-30" : ""
              }`} 
            />
            
            <div className="relative z-10 flex items-start gap-4">
              <div
                className={`p-3 rounded-xl transition-all duration-300 ${
                  hoveredOption === "dev"
                    ? "bg-primary text-primary-foreground scale-110 rotate-3"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                <Terminal className="h-7 w-7" />
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
            <div
              className={`relative z-10 mt-4 overflow-hidden transition-all duration-300 ${
                hoveredOption === "dev" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3 bg-[#1a1a1a] rounded-lg font-mono text-xs text-green-400">
                <span className="text-gray-500">$</span> kiarash --help
                <br />
                <span className="text-gray-400">Available commands: about, skills, projects...</span>
              </div>
            </div>

            {/* Decorative code symbols */}
            <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-all duration-300 group-hover:rotate-12">
              <Code className="h-8 w-8" />
            </div>
          </button>

          {/* Non-developer option */}
          <button
            onClick={() => handleChoice(false)}
            onMouseEnter={() => setHoveredOption("visitor")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 md:p-8 rounded-2xl border-2 text-left overflow-hidden transition-all duration-500 delay-400 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${
              hoveredOption === "visitor"
                ? "border-accent bg-accent/5 shadow-2xl shadow-accent/20"
                : "border-border bg-card hover:border-accent/50"
            }`}
            aria-label="Nope, just visiting - show me the portfolio the regular way"
          >
            {/* Glow effect on hover */}
            <div 
              className={`absolute -inset-px rounded-2xl bg-gradient-to-r from-accent via-primary to-accent opacity-0 blur-xl transition-opacity duration-500 ${
                hoveredOption === "visitor" ? "opacity-30" : ""
              }`} 
            />
            
            <div className="relative z-10 flex items-start gap-4">
              <div
                className={`p-3 rounded-xl transition-all duration-300 ${
                  hoveredOption === "visitor"
                    ? "bg-accent text-accent-foreground scale-110 -rotate-3"
                    : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
                }`}
              >
                <User className="h-7 w-7" />
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
            <div
              className={`relative z-10 mt-4 overflow-hidden transition-all duration-300 ${
                hoveredOption === "visitor" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                📖 Clean layout • Easy navigation • All the good stuff
              </div>
            </div>

            {/* Decorative user symbol */}
            <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-all duration-300 group-hover:-rotate-12">
              <User className="h-8 w-8" />
            </div>
          </button>
        </div>

        {/* Skip hint with fade in */}
        <p 
          className={`mt-8 text-xs text-muted-foreground transition-all duration-700 delay-500 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Your choice is remembered for next time
        </p>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes aurora-shift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, -5%) scale(1.1); }
          66% { transform: translate(-5%, 5%) scale(0.95); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  )
}
