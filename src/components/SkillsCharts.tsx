import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

const skillsRadarData = [
  { category: "AI/ML", proficiency: 95, fullMark: 100 },
  { category: "Backend", proficiency: 92, fullMark: 100 },
  { category: "Frontend", proficiency: 90, fullMark: 100 },
  { category: "DevOps", proficiency: 70, fullMark: 100 },
  { category: "Leadership", proficiency: 90, fullMark: 100 },
  { category: "Research", proficiency: 85, fullMark: 100 }
]

const technicalSkillsData = [
  { name: "Python", proficiency: 95, color: "oklch(0.58 0.15 65)" },
  { name: "React/React Native", proficiency: 90, color: "oklch(0.68 0.10 85)" },
  { name: "FastAPI", proficiency: 92, color: "oklch(0.58 0.15 65)" },
  { name: "Docker", proficiency: 88, color: "oklch(0.78 0.12 45)" },
  { name: "PostgreSQL", proficiency: 65, color: "oklch(0.78 0.12 45)" },
  { name: "CI/CD", proficiency: 65, color: "oklch(0.78 0.12 45)" }
]

const aiMLSkillsData = [
  { name: "Deep Learning", proficiency: 95 },
  { name: "Computer Vision", proficiency: 93 },
  { name: "NLP/LLMs", proficiency: 90 },
  { name: "Transformers", proficiency: 92 },
  { name: "Distributed ML", proficiency: 88 },
  { name: "GPU Optimization", proficiency: 85 }
]

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
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillsRadarData}>
                <PolarGrid stroke="oklch(0.80 0.05 75)" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: 'oklch(0.48 0.02 55)', fontSize: 14, fontWeight: 600 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: 'oklch(0.48 0.02 55)', fontSize: 12 }}
                />
                <Radar
                  name="Proficiency"
                  dataKey="proficiency"
                  stroke="oklch(0.58 0.15 65)"
                  fill="oklch(0.58 0.15 65)"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'oklch(0.99 0.01 75)',
                    border: '1px solid oklch(0.80 0.05 75)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {skillsRadarData.map((skill) => (
              <div key={skill.category} className="text-center">
                <div className="text-3xl font-bold text-primary">{skill.proficiency}%</div>
                <div className="text-sm text-muted-foreground">{skill.category}</div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="technical" className="space-y-8">
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Technical Skills Distribution</h3>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={technicalSkillsData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.80 0.05 75)" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  tick={{ fill: 'oklch(0.48 0.02 55)', fontSize: 12 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  tick={{ fill: 'oklch(0.48 0.02 55)', fontSize: 13, fontWeight: 600 }}
                  width={90}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'oklch(0.99 0.01 75)',
                    border: '1px solid oklch(0.80 0.05 75)',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Proficiency']}
                />
                <Bar dataKey="proficiency" radius={[0, 8, 8, 0]}>
                  {technicalSkillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="bg-primary/10 text-primary">Backend/Infrastructure</Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent">DevOps/Cloud</Badge>
            <Badge variant="secondary" className="bg-secondary/30 text-secondary-foreground">Frontend</Badge>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="aiml" className="space-y-8">
        <Card className="p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">AI & Machine Learning Expertise</h3>
          <div className="space-y-6">
            {aiMLSkillsData.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{skill.name}</span>
                  <span className="text-sm font-bold text-primary">{skill.proficiency}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                  />
                </div>
              </motion.div>
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
