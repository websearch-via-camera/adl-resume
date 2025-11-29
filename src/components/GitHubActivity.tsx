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
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-xl font-bold">GitHub Activity</h3>
        <span className="text-sm text-muted-foreground italic">
          Simulated visualization — real commits live on GitHub
        </span>
      </div>
      
      {/* Stats Grid - Fun phrases */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-primary">Lots 🚀</div>
          <div className="text-xs text-muted-foreground">Commits Shipped</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-primary">Consistently</div>
          <div className="text-xs text-muted-foreground">Building Things</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-primary">Coffee ☕</div>
          <div className="text-xs text-muted-foreground">Powered By</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-bold text-primary">∞</div>
          <div className="text-xs text-muted-foreground">Curiosity Level</div>
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
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-end">
            <span>Less</span>
            {levelColors.map((color, level) => (
              <div key={level} className={`w-3 h-3 rounded-sm ${color}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
