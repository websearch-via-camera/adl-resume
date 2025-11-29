import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TechItem {
  name: string
  category: "language" | "framework" | "database" | "cloud" | "tool"
  proficiency: "expert" | "advanced" | "intermediate"
  yearsExp: number
  description: string
  color: string
  icon: string
}

const techStack: TechItem[] = [
  // Languages
  { name: "Python", category: "language", proficiency: "expert", yearsExp: 10, description: "Primary language for AI/ML, backend systems, and automation", color: "#3776AB", icon: "🤖" },
  { name: "TypeScript", category: "language", proficiency: "expert", yearsExp: 6, description: "Full-stack web development, type-safe applications", color: "#3178C6", icon: "📘" },
  { name: "JavaScript", category: "language", proficiency: "expert", yearsExp: 8, description: "Web development, dynamic UIs, Node.js backend", color: "#F7DF1E", icon: "🟨" },
    
  // Frameworks
  { name: "React Native", category: "framework", proficiency: "expert", yearsExp: 5, description: "Production web apps, complex state management", color: "#61DAFB", icon: "📱" },
  { name: "FastAPI", category: "framework", proficiency: "expert", yearsExp: 4, description: "High-performance Python APIs, async patterns", color: "#009688", icon: "🚀" },
  { name: "Next.js", category: "framework", proficiency: "advanced", yearsExp: 4, description: "Full-stack React, SSR, API routes", color: "#000000", icon: "▲" },
    
  // Databases
  { name: "PostgreSQL", category: "database", proficiency: "advanced", yearsExp: 8, description: "Complex queries, optimization, extensions", color: "#336791", icon: "🐘" },
  { name: "Redis", category: "database", proficiency: "advanced", yearsExp: 6, description: "Caching, pub/sub, rate limiting", color: "#DC382D", icon: "📮" },
  
  // Cloud & DevOps
  { name: "AWS", category: "cloud", proficiency: "advanced", yearsExp: 7, description: "EC2, Lambda, S3", color: "#FF9900", icon: "☁️" },
  { name: "Azure", category: "cloud", proficiency: "intermediate", yearsExp: 3, description: "App Services, Functions, Blob Storage", color: "#0089D6", icon: "🔷" },
  { name: "Docker", category: "cloud", proficiency: "expert", yearsExp: 6, description: "Containerization, multi-stage builds", color: "#2496ED", icon: "🐳" },
  
  // Tools
  { name: "Git", category: "tool", proficiency: "expert", yearsExp: 10, description: "Version control, complex workflows", color: "#F05032", icon: "📝" },
  { name: "Linux", category: "tool", proficiency: "expert", yearsExp: 10, description: "System administration, scripting", color: "#FCC624", icon: "🐧" },
]

const categoryLabels: Record<TechItem["category"], string> = {
  language: "Languages",
  framework: "Frameworks",
  database: "Databases",
  cloud: "Cloud & DevOps",
  tool: "Developer Tools"
}

const categoryOrder: TechItem["category"][] = ["language", "framework", "database", "cloud", "tool"]

const proficiencyColors = {
  expert: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  advanced: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  intermediate: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
}

export function TechStack() {
  const groupedTech = categoryOrder.reduce((acc, category) => {
    acc[category] = techStack.filter(tech => tech.category === category)
    return acc
  }, {} as Record<TechItem["category"], TechItem[]>)
  
  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Technology Stack</h3>
        <p className="text-muted-foreground">
          Comprehensive expertise across the full development spectrum
        </p>
      </div>
      
      <TooltipProvider delayDuration={100}>
        <div className="space-y-8">
          {categoryOrder.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-primary">
                {categoryLabels[category]}
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {groupedTech[category].map((tech, index) => (
                  <Tooltip key={tech.name}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="group cursor-pointer"
                      >
                        <div 
                          className="flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
                          style={{ 
                            borderLeftWidth: '3px',
                            borderLeftColor: tech.color 
                          }}
                        >
                          <span className="text-2xl mb-2">{tech.icon}</span>
                          <span className="text-sm font-medium text-center">{tech.name}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {tech.yearsExp}+ yrs
                          </span>
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold">{tech.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${proficiencyColors[tech.proficiency]}`}
                          >
                            {tech.proficiency}
                          </Badge>
                        </div>
                        <p className="text-sm">{tech.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {tech.yearsExp}+ years of experience
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </TooltipProvider>
      
      {/* Legend */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-muted-foreground">Proficiency:</span>
          <Badge variant="outline" className={proficiencyColors.expert}>Expert</Badge>
          <Badge variant="outline" className={proficiencyColors.advanced}>Advanced</Badge>
          <Badge variant="outline" className={proficiencyColors.intermediate}>Intermediate</Badge>
        </div>
      </div>
    </Card>
  )
}
