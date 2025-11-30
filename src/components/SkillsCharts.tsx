import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Code, Cpu, Layers, Sparkles } from "lucide-react"

const skillsRadarData = [
  { category: "AI/ML", proficiency: 95 },
  { category: "Backend", proficiency: 92 },
  { category: "Frontend", proficiency: 90 },
  { category: "DevOps", proficiency: 70 },
  { category: "Leadership", proficiency: 90 },
  { category: "Research", proficiency: 85 }
]

const technicalSkillsData = [
  { name: "Python", proficiency: 95, category: "backend", icon: "🐍" },
  { name: "React/React Native", proficiency: 90, category: "frontend", icon: "⚛️" },
  { name: "FastAPI", proficiency: 92, category: "backend", icon: "⚡" },
  { name: "Docker", proficiency: 88, category: "devops", icon: "🐳" },
  { name: "PostgreSQL", proficiency: 65, category: "devops", icon: "🐘" },
  { name: "CI/CD", proficiency: 65, category: "devops", icon: "🔄" }
]

const aiMLSkillsData = [
  { name: "Deep Learning", proficiency: 95, icon: "🧠" },
  { name: "Computer Vision", proficiency: 93, icon: "👁️" },
  { name: "NLP/LLMs", proficiency: 90, icon: "💬" },
  { name: "Transformers", proficiency: 92, icon: "🤖" },
  { name: "Distributed ML", proficiency: 88, icon: "🌐" },
  { name: "GPU Optimization", proficiency: 85, icon: "⚡" }
]

// Pure SVG Radar Chart Component
function RadarChartSVG({ data }: { data: typeof skillsRadarData }) {
  const size = 300
  const center = size / 2
  const radius = 120
  const levels = 5
  
  // Calculate polygon points for a given level
  const getPolygonPoints = (level: number) => {
    const r = (radius * level) / levels
    return data.map((_, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')
  }
  
  // Calculate data polygon points
  const getDataPoints = () => {
    return data.map((item, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2
      const r = (radius * item.proficiency) / 100
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return `${x},${y}`
    }).join(' ')
  }
  
  // Calculate label positions
  const getLabelPosition = (index: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2
    const r = radius + 25
    const x = center + r * Math.cos(angle)
    const y = center + r * Math.sin(angle)
    return { x, y }
  }

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className="w-full max-w-[400px] mx-auto"
      role="img"
      aria-label="Radar chart showing proficiency levels: AI/ML 95%, Backend 92%, Frontend 90%, DevOps 70%, Leadership 90%, Research 85%"
    >
      <title>Competency Radar Chart</title>
      <desc>A hexagonal radar chart displaying skill proficiency across six categories</desc>
      {/* Grid levels */}
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          key={level}
          points={getPolygonPoints(level)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
      ))}
      
      {/* Axis lines */}
      {data.map((_, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        )
      })}
      
      {/* Data polygon */}
      <motion.polygon
        points={getDataPoints()}
        fill="var(--primary)"
        fillOpacity={0.3}
        stroke="var(--primary)"
        strokeWidth={2}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: 'center' }}
      />
      
      {/* Data points */}
      {data.map((item, i) => {
        const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2
        const r = (radius * item.proficiency) / 100
        const x = center + r * Math.cos(angle)
        const y = center + r * Math.sin(angle)
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={5}
            fill="var(--primary)"
            stroke="var(--background)"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          />
        )
      })}
      
      {/* Labels */}
      {data.map((item, i) => {
        const pos = getLabelPosition(i)
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-xs font-semibold"
          >
            {item.category}
          </text>
        )
      })}
    </svg>
  )
}

// Progress bar with animation and enhanced hover
function SkillBar({ name, proficiency, category, delay = 0, icon }: { 
  name: string
  proficiency: number
  category?: string
  delay?: number
  icon?: string
}) {
  const getCategoryColor = () => {
    switch (category) {
      case 'backend': return 'from-primary to-primary/80'
      case 'frontend': return 'from-accent to-accent/80'
      case 'devops': return 'from-amber-500 to-amber-400'
      default: return 'from-primary via-accent to-primary'
    }
  }
  
  const getCategoryGlow = () => {
    switch (category) {
      case 'backend': return 'group-hover:shadow-primary/20'
      case 'frontend': return 'group-hover:shadow-accent/20'
      case 'devops': return 'group-hover:shadow-amber-500/20'
      default: return 'group-hover:shadow-primary/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`group p-4 -mx-4 rounded-xl transition-all duration-300 hover:bg-muted/40 ${getCategoryGlow()} hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-lg transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">
              {icon}
            </span>
          )}
          <span className="font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">{name}</span>
        </div>
        <span className="text-sm font-bold text-primary transition-all duration-300 group-hover:scale-110">{proficiency}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden relative">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getCategoryColor()} rounded-full relative overflow-hidden`}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsCharts() {
  return (
    <Tabs defaultValue="technical" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 p-1.5 bg-muted/50 backdrop-blur-sm rounded-xl h-auto">
        <TabsTrigger 
          value="overview" 
          className="data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 rounded-lg py-3 transition-all duration-300 gap-2"
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="technical"
          className="data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 rounded-lg py-3 transition-all duration-300 gap-2"
        >
          <Code className="h-4 w-4" />
          <span className="hidden sm:inline">Technical Stack</span>
        </TabsTrigger>
        <TabsTrigger 
          value="aiml"
          className="data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 rounded-lg py-3 transition-all duration-300 gap-2"
        >
          <Cpu className="h-4 w-4" />
          <span className="hidden sm:inline">AI & ML</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        <Card className="p-8 relative overflow-hidden group/card">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-2xl font-bold mb-6 text-center relative z-10">Competency Radar</h3>
          <div className="w-full py-4 relative z-10">
            <RadarChartSVG data={skillsRadarData} />
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
            {skillsRadarData.map((skill, index) => (
              <motion.div 
                key={skill.category} 
                className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 cursor-default group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">{skill.proficiency}%</div>
                <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{skill.category}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="technical" className="space-y-8">
        <Card className="p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-center">Technical Skills Distribution</h3>
            </div>
            
            <div className="space-y-1">
              {technicalSkillsData.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  proficiency={skill.proficiency}
                  category={skill.category}
                  delay={index * 0.1}
                  icon={skill.icon}
                />
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-3 justify-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-2 transition-all duration-300 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 cursor-default">
                <span className="w-2.5 h-2.5 rounded-full bg-primary mr-2 animate-pulse" />
                Backend/Infrastructure
              </Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent px-4 py-2 transition-all duration-300 hover:bg-accent/20 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5 cursor-default">
                <span className="w-2.5 h-2.5 rounded-full bg-accent mr-2 animate-pulse" />
                Frontend
              </Badge>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-4 py-2 transition-all duration-300 hover:bg-amber-500/20 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 cursor-default">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
                DevOps/Cloud
              </Badge>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="aiml" className="space-y-8">
        <Card className="p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-center">AI & Machine Learning Expertise</h3>
            </div>
            
            <div className="space-y-1">
              {aiMLSkillsData.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  proficiency={skill.proficiency}
                  delay={index * 0.1}
                  icon={skill.icon}
                />
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl border border-border/50 relative overflow-hidden group">
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  Key Achievements
                </h4>
                <ul className="space-y-3 text-foreground">
                  {[
                    { icon: "🚀", text: "10+ years building production ML systems at scale (Google, startups)" },
                    { icon: "⚡", text: "55x GPU acceleration breakthrough in speech recognition research" },
                    { icon: "📊", text: "Architected 32,000+ LOC AI-native MCP server with 1,403+ tests" },
                    { icon: "🔬", text: "Patent-pending computer vision solutions in production" }
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start gap-3 p-2 -mx-2 rounded-lg transition-all duration-300 hover:bg-muted/50 group/item"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <span className="text-lg transition-transform duration-300 group-hover/item:scale-125">{item.icon}</span>
                      <span className="transition-colors duration-300 group-hover/item:text-primary">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
