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
  { name: "Python", proficiency: 95, category: "backend" },
  { name: "React/React Native", proficiency: 90, category: "frontend" },
  { name: "FastAPI", proficiency: 92, category: "backend" },
  { name: "Docker", proficiency: 88, category: "devops" },
  { name: "PostgreSQL", proficiency: 65, category: "devops" },
  { name: "CI/CD", proficiency: 65, category: "devops" }
]

const aiMLSkillsData = [
  { name: "Deep Learning", proficiency: 95 },
  { name: "Computer Vision", proficiency: 93 },
  { name: "NLP/LLMs", proficiency: 90 },
  { name: "Transformers", proficiency: 92 },
  { name: "Distributed ML", proficiency: 88 },
  { name: "GPU Optimization", proficiency: 85 }
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
      className="w-full max-w-[320px] sm:max-w-[380px] mx-auto"
      role="img"
      aria-label="Radar chart showing proficiency levels: AI/ML 95%, Backend 92%, Frontend 90%, DevOps 70%, Leadership 90%, Research 85%"
      style={{ WebkitTransform: 'translateZ(0)' }}
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
      
      {/* Data polygon - using opacity animation only for iOS Safari compatibility */}
      <motion.polygon
        points={getDataPoints()}
        fill="var(--primary)"
        fillOpacity={0.3}
        stroke="var(--primary)"
        strokeWidth={2}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
function SkillBar({ name, proficiency, category, delay = 0 }: { 
  name: string
  proficiency: number
  category?: string
  delay?: number
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
      className={`group p-3 sm:p-4 -mx-3 sm:-mx-4 rounded-xl transition-all duration-300 hover:bg-muted/40 active:bg-muted/40 ${getCategoryGlow()}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm sm:text-base text-foreground">{name}</span>
        <span className="text-xs sm:text-sm font-bold text-primary">{proficiency}%</span>
      </div>
      <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getCategoryColor()} rounded-full relative overflow-hidden`}
          style={{ willChange: 'width' }}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsCharts() {
  return (
    <section aria-label="Skills visualization and charts">
      {/* SEO-friendly hidden content for crawlers */}
      <div className="sr-only">
        <h3>Kiarash Adl's Technical Skills</h3>
        <section aria-label="Competency Overview">
          <h4>Competency Radar</h4>
          <ul role="list">
            <li>AI/ML: 95% proficiency</li>
            <li>Backend: 92% proficiency</li>
            <li>Frontend: 90% proficiency</li>
            <li>DevOps: 70% proficiency</li>
            <li>Leadership: 90% proficiency</li>
            <li>Research: 85% proficiency</li>
          </ul>
        </section>
        <section aria-label="Technical Stack">
          <h4>Technical Skills Distribution</h4>
          <ul role="list">
            <li>Python: 95% - Backend/Infrastructure</li>
            <li>React/React Native: 90% - Frontend</li>
            <li>FastAPI: 92% - Backend/Infrastructure</li>
            <li>Docker: 88% - DevOps/Cloud</li>
            <li>PostgreSQL: 65% - DevOps/Cloud</li>
            <li>CI/CD: 65% - DevOps/Cloud</li>
          </ul>
        </section>
        <section aria-label="AI and Machine Learning">
          <h4>AI & Machine Learning Expertise</h4>
          <ul role="list">
            <li>Deep Learning: 95%</li>
            <li>Computer Vision: 93%</li>
            <li>NLP/LLMs: 90%</li>
            <li>Transformers: 92%</li>
            <li>Distributed ML: 88%</li>
            <li>GPU Optimization: 85%</li>
          </ul>
          <h5>Key Achievements</h5>
          <ul role="list">
            <li>10+ years building production ML systems at scale (Google, startups)</li>
            <li>55x GPU acceleration breakthrough in speech recognition research</li>
            <li>Architected 32,000+ LOC AI-native MCP server with 1,403+ tests</li>
            <li>Patent-pending computer vision solutions in production</li>
          </ul>
        </section>
      </div>
      
    <Tabs defaultValue="technical" className="w-full">
      <TabsList className="flex w-full flex-wrap justify-center gap-2 mb-8 p-2 bg-muted/50 backdrop-blur-sm rounded-xl h-auto">
        <TabsTrigger 
          value="overview" 
          className="flex-1 min-w-[80px] max-w-[140px] data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 rounded-lg py-2.5 sm:py-3 transition-all duration-300 gap-1.5 sm:gap-2 text-xs sm:text-sm"
        >
          <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="technical"
          className="flex-1 min-w-[80px] max-w-[140px] data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 rounded-lg py-2.5 sm:py-3 transition-all duration-300 gap-1.5 sm:gap-2 text-xs sm:text-sm"
        >
          <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Stack</span>
        </TabsTrigger>
        <TabsTrigger 
          value="aiml"
          className="flex-1 min-w-[80px] max-w-[140px] data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10 rounded-lg py-2.5 sm:py-3 transition-all duration-300 gap-1.5 sm:gap-2 text-xs sm:text-sm"
        >
          <Cpu className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">AI & ML</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 sm:space-y-8">
        <Card className="p-4 sm:p-6 md:p-8 relative overflow-hidden group/card">
          {/* Decorative gradient background */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center relative z-10">Competency Radar</h3>
          <div className="w-full py-4 relative z-10">
            <RadarChartSVG data={skillsRadarData} />
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 relative z-10">
            {skillsRadarData.map((skill, index) => (
              <motion.div 
                key={skill.category} 
                className="text-center p-2.5 sm:p-3 rounded-xl transition-all duration-300 hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 active:scale-95 cursor-default group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary">{skill.proficiency}%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{skill.category}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="technical" className="space-y-6 sm:space-y-8">
        <Card className="p-4 sm:p-6 md:p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center">Technical Skills</h3>
            </div>
            
            <div className="space-y-1">
              {technicalSkillsData.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  proficiency={skill.proficiency}
                  category={skill.category}
                  delay={index * 0.1}
                />
              ))}
            </div>
            
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50 flex flex-wrap gap-2 sm:gap-3 justify-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-default">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary mr-1.5 sm:mr-2" />
                Backend
              </Badge>
              <Badge variant="secondary" className="bg-accent/10 text-accent px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-default">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent mr-1.5 sm:mr-2" />
                Frontend
              </Badge>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-default">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 mr-1.5 sm:mr-2" />
                DevOps
              </Badge>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="aiml" className="space-y-6 sm:space-y-8">
        <Card className="p-4 sm:p-6 md:p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                <Cpu className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-center">AI & ML Expertise</h3>
            </div>
            
            <div className="space-y-1">
              {aiMLSkillsData.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  proficiency={skill.proficiency}
                  delay={index * 0.1}
                />
              ))}
            </div>
            
            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl border border-border/50 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  Key Achievements
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-foreground">
                  {[
                    "10+ years building production ML systems at scale",
                    "55x GPU acceleration in speech recognition research",
                    "32,000+ LOC AI-native MCP server with 1,403+ tests",
                    "Patent-pending computer vision solutions"
                  ].map((text, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start gap-2 sm:gap-3 p-1.5 sm:p-2 -mx-1.5 sm:-mx-2 rounded-lg"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
    </section>
  )
}
