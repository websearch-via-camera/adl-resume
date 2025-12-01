import { useState } from "react"
import { Terminal, User, Code } from "lucide-react"

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
    <div
      className={`fixed inset-0 z-[100] bg-background flex items-center justify-center px-6 transition-opacity duration-400 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Subtle animated background pattern - deferred to not block LCP */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none animate-fade-in-delayed"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-2xl w-full text-center animate-slide-up">
        {/* Welcome text - render immediately for instant LCP */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Hey there! 👋
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Are you a developer like Kiarash?
          </p>
        </div>

        {/* Choice buttons - render immediately, animate subtly */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Developer option */}
          <button
            onClick={() => handleChoice(true)}
            onMouseEnter={() => setHoveredOption("dev")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left animate-fade-in ${
              hoveredOption === "dev"
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
            style={{ animationDelay: "50ms" }}
            aria-label="Yes, I code - take me to the terminal to explore this site like a developer"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl transition-colors duration-300 ${
                  hoveredOption === "dev"
                    ? "bg-primary text-primary-foreground"
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
            
            {/* Terminal preview hint - CSS-only expand/collapse */}
            <div
              className={`mt-4 overflow-hidden transition-all duration-200 ${
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
            <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code className="h-8 w-8" />
            </div>
          </button>

          {/* Non-developer option */}
          <button
            onClick={() => handleChoice(false)}
            onMouseEnter={() => setHoveredOption("visitor")}
            onMouseLeave={() => setHoveredOption(null)}
            className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 text-left animate-fade-in ${
              hoveredOption === "visitor"
                ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                : "border-border bg-card hover:border-accent/50"
            }`}
            style={{ animationDelay: "100ms" }}
            aria-label="Nope, just visiting - show me the portfolio the regular way"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl transition-colors duration-300 ${
                  hoveredOption === "visitor"
                    ? "bg-accent text-accent-foreground"
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

            {/* Preview hint - CSS-only expand/collapse */}
            <div
              className={`mt-4 overflow-hidden transition-all duration-200 ${
                hoveredOption === "visitor" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                📖 Clean layout • Easy navigation • All the good stuff
              </div>
            </div>

            {/* Decorative user symbol */}
            <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <User className="h-8 w-8" />
            </div>
          </button>
        </div>

        {/* Skip hint */}
        <p className="mt-8 text-xs text-muted-foreground">
          Your choice is remembered for next time
        </p>
      </div>
    </div>
  )
}
