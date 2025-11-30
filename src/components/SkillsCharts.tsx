import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

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
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto">
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

// Progress bar with animation
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{name}</span>
        <span className="text-sm font-bold text-primary">{proficiency}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getCategoryColor()} rounded-full`}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsCharts() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="technical">Technical Stack</TabsTrigger>
        <TabsTrigger value="aiml">AI & ML</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Competency Radar</h3>
          <div className="w-full py-4">
            <RadarChartSVG data={skillsRadarData} />
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {skillsRadarData.map((skill, index) => (
              <motion.div 
                key={skill.category} 
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-primary">{skill.proficiency}%</div>
                <div className="text-sm text-muted-foreground">{skill.category}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="technical" className="space-y-8">
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Technical Skills Distribution</h3>
          <div className="space-y-5">
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
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary mr-2" />
              Backend/Infrastructure
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              <span className="w-2 h-2 rounded-full bg-accent mr-2" />
              Frontend
            </Badge>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
              DevOps/Cloud
            </Badge>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="aiml" className="space-y-8">
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">AI & Machine Learning Expertise</h3>
          <div className="space-y-5">
            {aiMLSkillsData.map((skill, index) => (
              <SkillBar
                key={skill.name}
                name={skill.name}
                proficiency={skill.proficiency}
                delay={index * 0.1}
              />
            ))}
          </div>
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h4 className="font-bold text-lg mb-3 text-primary">Key Achievements</h4>
            <ul className="space-y-2 text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">●</span>
                <span>10+ years building production ML systems at scale (Google, startups)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">●</span>
                <span>55x GPU acceleration breakthrough in speech recognition research</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">●</span>
                <span>Architected 32,000+ LOC AI-native MCP server with 1,403+ tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">●</span>
                <span>Patent-pending computer vision solutions in production</span>
              </li>
            </ul>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
