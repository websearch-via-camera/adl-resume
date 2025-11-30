import { Card } from "@/components/ui/card"
import { useMemo } from "react"

// Generate static contribution data once (no animations per square)
const generateContributionData = () => {
  const data: number[] = []
  
  // Generate 52 weeks x 7 days = 364 levels (0-4)
  for (let i = 0; i < 364; i++) {
    const isWeekday = (i % 7) > 0 && (i % 7) < 6
    const baseProb = isWeekday ? 0.7 : 0.4
    
    if (Math.random() < baseProb) {
      const rand = Math.random()
      if (rand < 0.5) data.push(1)
      else if (rand < 0.8) data.push(2)
      else if (rand < 0.95) data.push(3)
      else data.push(4)
    } else {
      data.push(0)
    }
  }
  
  return data
}

// Pre-generate data outside component to avoid re-renders
const CONTRIBUTION_DATA = generateContributionData()

const levelColors = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary"
]

export function GitHubActivity() {
  // Group into weeks (static, no re-computation)
  const weeks = useMemo(() => {
    const result: number[][] = []
    for (let i = 0; i < CONTRIBUTION_DATA.length; i += 7) {
      result.push(CONTRIBUTION_DATA.slice(i, i + 7))
    }
    return result
  }, [])
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  return (
    <Card className="p-6 md:p-8 overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl">
              <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold">GitHub Activity</h3>
          </div>
          <span className="text-sm text-muted-foreground italic px-3 py-1 bg-muted/50 rounded-full">
            ✨ Simulated visualization
          </span>
        </div>
      
        {/* Stats Grid - Fun phrases */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform inline-block">Lots 🚀</div>
            <div className="text-xs text-muted-foreground mt-1">Commits Shipped</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform inline-block">Consistently</div>
            <div className="text-xs text-muted-foreground mt-1">Building Things</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform inline-block">Coffee ☕</div>
            <div className="text-xs text-muted-foreground mt-1">Powered By</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-muted/60 to-muted/30 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:scale-110 transition-transform inline-block">∞</div>
            <div className="text-xs text-muted-foreground mt-1">Curiosity Level</div>
          </div>
        </div>
      
      {/* Contribution Graph - Static, no tooltips or animations */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex mb-1 ml-8">
            {months.map((month) => (
              <div key={month} className="text-xs text-muted-foreground" style={{ width: `${100/12}%`, minWidth: '40px' }}>
                {month}
              </div>
            ))}
          </div>
          
          <div className="flex gap-0.5">
            {/* Day Labels */}
            <div className="flex flex-col gap-0.5 mr-2 text-xs text-muted-foreground">
              <div className="h-3"></div>
              <div className="h-3 flex items-center">Mon</div>
              <div className="h-3"></div>
              <div className="h-3 flex items-center">Wed</div>
              <div className="h-3"></div>
              <div className="h-3 flex items-center">Fri</div>
              <div className="h-3"></div>
            </div>
            
            {/* Contribution Squares - Simple divs, no animations */}
            <div className="flex gap-0.5">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5">
                  {week.map((level, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${levelColors[level]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-3 mt-6 text-xs text-muted-foreground justify-end">
            <span className="font-medium">Less</span>
            {levelColors.map((color, level) => (
              <div key={level} className={`w-3.5 h-3.5 rounded-md ${color} transition-transform hover:scale-125`} />
            ))}
            <span className="font-medium">More</span>
          </div>
        </div>
      </div>
      </div>
    </Card>
  )
}
