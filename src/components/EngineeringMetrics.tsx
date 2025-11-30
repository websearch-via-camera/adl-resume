import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Code, 
  GitBranch, 
  Building2, 
  Trophy,
  Zap,
  TrendingUp,
  Users,
  Clock
} from "lucide-react"

interface Metric {
  icon: React.ReactNode
  label: string
  value: string
  subtext?: string
  trend?: "up" | "down" | "neutral"
}

const engineeringMetrics: Metric[] = [
  {
    icon: <Code className="h-6 w-6" />,
    label: "Lines of Code",
    value: "500K+",
    subtext: "Production code shipped",
    trend: "up"
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    label: "Pull Requests",
    value: "2,500+",
    subtext: "Merged to main",
    trend: "up"
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    label: "Companies",
    value: "9+",
    subtext: "Including Google, startups",
    trend: "neutral"
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    label: "Patents",
    value: "3",
    subtext: "2 pending in AI",
    trend: "up"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    label: "Performance Gains",
    value: "55x",
    subtext: "GPU optimization record",
    trend: "up"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    label: "Test Coverage",
    value: "95%+",
    subtext: "On critical systems",
    trend: "neutral"
  },
  {
    icon: <Users className="h-6 w-6" />,
    label: "Team Size Led",
    value: "12+",
    subtext: "Cross-functional engineers",
    trend: "neutral"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    label: "Years Experience",
    value: "10+",
    subtext: "In production systems",
    trend: "up"
  }
]

const trendColors = {
  up: "text-green-500",
  down: "text-red-500",
  neutral: "text-muted-foreground"
}

export function EngineeringMetrics() {
  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Engineering Impact</h3>
        <p className="text-muted-foreground">
          Quantified achievements across a decade of building production systems
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {engineeringMetrics.map((metric) => (
          <div key={metric.label} className="group">
            <div className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {metric.icon}
                </div>
                {metric.trend && (
                  <Badge variant="outline" className={`text-xs ${trendColors[metric.trend]}`}>
                    {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "•"}
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <div className="text-sm font-medium text-foreground/80">
                {metric.label}
              </div>
              {metric.subtext && (
                <div className="text-xs text-muted-foreground mt-1">
                  {metric.subtext}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Highlight Achievement */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg border border-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg">Featured Achievement</h4>
            <p className="text-muted-foreground text-sm">
              Achieved <span className="text-primary font-semibold">55x speedup</span> in speech recognition 
              through GPU optimization at MIT CSAIL, published at ICASSP 2012 — demonstrating 
              deep expertise in high-performance computing and ML systems.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
