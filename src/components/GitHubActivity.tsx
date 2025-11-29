import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMemo } from "react"

// Simulated GitHub-style contribution data (in production, fetch from GitHub API)
const generateContributionData = () => {
  const data: { date: string; count: number; level: number }[] = []
  const today = new Date()
  
  // Generate 52 weeks of data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate realistic contribution patterns
    const dayOfWeek = date.getDay()
    const isWeekday = dayOfWeek > 0 && dayOfWeek < 6
    
    // Higher probability of contributions on weekdays
    const baseProb = isWeekday ? 0.7 : 0.4
    const hasContribution = Math.random() < baseProb
    
    let count = 0
    if (hasContribution) {
      // Power-law distribution for contribution counts
      const rand = Math.random()
      if (rand < 0.5) count = Math.floor(Math.random() * 3) + 1
      else if (rand < 0.8) count = Math.floor(Math.random() * 5) + 3
      else if (rand < 0.95) count = Math.floor(Math.random() * 8) + 5
      else count = Math.floor(Math.random() * 15) + 10
    }
    
    // Calculate level (0-4)
    let level = 0
    if (count > 0) level = 1
    if (count > 3) level = 2
    if (count > 6) level = 3
    if (count > 10) level = 4
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
      level
    })
  }
  
  return data
}

const levelColors = {
  light: [
    "bg-muted",
    "bg-green-200",
    "bg-green-400",
    "bg-green-500",
    "bg-green-600"
  ],
  dark: [
    "bg-muted",
    "bg-green-900/50",
    "bg-green-700",
    "bg-green-500",
    "bg-green-400"
  ]
}

export function GitHubActivity() {
  const contributionData = useMemo(() => generateContributionData(), [])
  
  // Group by weeks
  const weeks = useMemo(() => {
    const result: typeof contributionData[] = []
    for (let i = 0; i < contributionData.length; i += 7) {
      result.push(contributionData.slice(i, i + 7))
    }
    return result
  }, [contributionData])
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalContributions = contributionData.reduce((sum, day) => sum + day.count, 0)
    const activeDays = contributionData.filter(day => day.count > 0).length
    const currentStreak = (() => {
      let streak = 0
      for (let i = contributionData.length - 1; i >= 0; i--) {
        if (contributionData[i].count > 0) streak++
        else break
      }
      return streak
    })()
    const longestStreak = (() => {
      let longest = 0
      let current = 0
      for (const day of contributionData) {
        if (day.count > 0) {
          current++
          longest = Math.max(longest, current)
        } else {
          current = 0
        }
      }
      return longest
    })()
    
    return { totalContributions, activeDays, currentStreak, longestStreak }
  }, [contributionData])
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', '']
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">GitHub Activity</h3>
        <span className="text-sm text-muted-foreground italic">
          Simulated visualization — real commits live on GitHub
        </span>
      </div>
      
      {/* Stats Grid - Fun phrases instead of fake numbers */}
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
      
      {/* Contribution Graph */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex mb-1 ml-8">
            {months.map((month, i) => (
              <div key={month} className="text-xs text-muted-foreground" style={{ width: `${100/12}%`, minWidth: '40px' }}>
                {month}
              </div>
            ))}
          </div>
          
          <div className="flex gap-0.5">
            {/* Day Labels */}
            <div className="flex flex-col gap-0.5 mr-2">
              {days.map((day, i) => (
                <div key={i} className="text-xs text-muted-foreground h-3 flex items-center">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Contribution Squares */}
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-0.5">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                              delay: weekIndex * 0.005 + dayIndex * 0.002,
                              duration: 0.2 
                            }}
                            className={`w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125 ${levelColors.light[day.level]} dark:${levelColors.dark[day.level]}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-medium">{day.count} contributions</p>
                          <p className="text-muted-foreground">{day.date}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-end">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${levelColors.light[level]}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
