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
  accent?: string
}

const engineeringMetrics: Metric[] = [
  {
    icon: <Code className="h-6 w-6" />,
    label: "Lines of Code",
    value: "500K+",
    subtext: "Production code shipped",
    trend: "up",
    accent: "from-orange-500/20 to-amber-500/20"
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    label: "Pull Requests",
    value: "2,500+",
    subtext: "Merged to main",
    trend: "up",
    accent: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    label: "Companies",
    value: "9+",
    subtext: "Including Google, startups",
    trend: "neutral",
    accent: "from-blue-500/20 to-indigo-500/20"
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    label: "Patents",
    value: "3",
    subtext: "2 pending in AI",
    trend: "up",
    accent: "from-yellow-500/20 to-orange-500/20"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    label: "Performance Gains",
    value: "55x",
    subtext: "GPU optimization record",
    trend: "up",
    accent: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    label: "Test Coverage",
    value: "95%+",
    subtext: "On critical systems",
    trend: "neutral",
    accent: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: <Users className="h-6 w-6" />,
    label: "Team Size Led",
    value: "12+",
    subtext: "Cross-functional engineers",
    trend: "neutral",
    accent: "from-cyan-500/20 to-blue-500/20"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    label: "Years Experience",
    value: "10+",
    subtext: "In production systems",
    trend: "up",
    accent: "from-rose-500/20 to-red-500/20"
  }
]

const trendColors = {
  up: "text-green-500 dark:text-green-400",
  down: "text-red-500 dark:text-red-400",
  neutral: "text-muted-foreground"
}

export function EngineeringMetrics() {
  return (
    <section aria-labelledby="engineering-metrics-heading" itemScope itemType="https://schema.org/ItemList">
      {/* SEO-friendly hidden content for crawlers and AI agents */}
      <div className="sr-only">
        <h3 id="engineering-metrics-heading">Engineering Impact Metrics</h3>
        <meta itemProp="name" content="Kiarash Adl Engineering Metrics" />
        <ul role="list">
          <li itemProp="itemListElement">Lines of Code: 500K+ production code shipped</li>
          <li itemProp="itemListElement">Pull Requests: 2,500+ merged to main</li>
          <li itemProp="itemListElement">Companies: 9+ including Google and startups</li>
          <li itemProp="itemListElement">Patents: 3 (2 pending in AI)</li>
          <li itemProp="itemListElement">Performance Gains: 55x GPU optimization record</li>
          <li itemProp="itemListElement">Test Coverage: 95%+ on critical systems</li>
          <li itemProp="itemListElement">Team Size Led: 12+ cross-functional engineers</li>
          <li itemProp="itemListElement">Years Experience: 10+ in production systems</li>
        </ul>
        <p>Featured Achievement: Achieved 55x speedup in speech recognition through GPU optimization at MIT CSAIL, published at ICASSP 2012 demonstrating deep expertise in high-performance computing and ML systems.</p>
      </div>
      
    <Card flat className="p-6 md:p-8 overflow-hidden">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold mb-2">Engineering Impact</h3>
        <p className="text-muted-foreground">
          Quantified achievements across a decade of building production systems
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {engineeringMetrics.map((metric, index) => (
          <div 
            key={metric.label} 
            className="group relative"
            style={{ 
              // Stagger animation delay for visual interest
              animationDelay: `${index * 50}ms` 
            }}
          >
            {/* Gradient glow effect - only visible on hover */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br ${metric.accent} rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10 scale-110`}
              aria-hidden="true"
            />
            
            <div className="relative p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm h-full
              transform-gpu transition-all duration-300 ease-out
              hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5
              hover:-translate-y-1 hover:scale-[1.02]
              group-hover:bg-card/95">
              
              {/* Shimmer effect on hover */}
              <div 
                className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary 
                    transition-all duration-300 ease-out
                    group-hover:bg-primary group-hover:text-primary-foreground 
                    group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-primary/25">
                    {metric.icon}
                  </div>
                  {metric.trend && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs transition-all duration-300 ${trendColors[metric.trend]}
                        group-hover:scale-110 group-hover:border-current/30`}
                    >
                      {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "•"}
                    </Badge>
                  )}
                </div>
                
                <div className="text-3xl font-bold text-foreground mb-1 transition-transform duration-300 group-hover:translate-x-0.5">
                  <span className="inline-block transition-all duration-300 group-hover:text-primary">
                    {metric.value}
                  </span>
                </div>
                
                <div className="text-sm font-medium text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                  {metric.label}
                </div>
                
                {metric.subtext && (
                  <div className="text-xs text-muted-foreground mt-1.5 transition-all duration-300 
                    opacity-70 group-hover:opacity-100 group-hover:text-muted-foreground">
                    {metric.subtext}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Highlight Achievement */}
      <div className="mt-8 p-5 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-xl border border-primary/20
        relative overflow-hidden group/featured transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
        
        {/* Animated gradient border effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover/featured:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        >
          <div className="absolute inset-[-1px] rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x opacity-30" />
        </div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0 p-3 bg-primary/15 rounded-xl transition-all duration-300 
            group-hover/featured:bg-primary/25 group-hover/featured:scale-105 group-hover/featured:rotate-6">
            <Trophy className="h-8 w-8 text-primary transition-transform duration-300 group-hover/featured:scale-110" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1 transition-colors duration-300 group-hover/featured:text-primary">
              Featured Achievement
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Achieved <span className="text-primary font-semibold transition-all duration-300 group-hover/featured:text-accent">55x speedup</span> in speech recognition 
              through GPU optimization at MIT CSAIL, published at ICASSP 2012 demonstrating 
              deep expertise in high-performance computing and ML systems.
            </p>
          </div>
        </div>
      </div>
    </Card>
    </section>
  )
}
