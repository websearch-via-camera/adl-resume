import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { Code, Box, Database, Cloud, Wrench, Star, Zap, TrendingUp } from "lucide-react"

interface TechItem {
  name: string
  category: "language" | "framework" | "database" | "cloud" | "tool"
  proficiency: number // 0-100
  yearsExp: number
  description: string
  gradient: string
  featured?: boolean
  highlights?: string[]
}

const techStack: TechItem[] = [
  // Languages - Featured
  { 
    name: "Python", 
    category: "language", 
    proficiency: 95, 
    yearsExp: 10, 
    description: "Primary language for AI/ML, backend APIs, automation, and data pipelines",
    gradient: "from-blue-500 to-yellow-500",
    featured: true,
    highlights: ["AI/ML", "FastAPI", "Data Science"]
  },
  { 
    name: "TypeScript", 
    category: "language", 
    proficiency: 90, 
    yearsExp: 6, 
    description: "Full-stack web development with type safety for React and Node.js",
    gradient: "from-blue-600 to-blue-400",
    featured: true,
    highlights: ["React", "Node.js", "Type Safety"]
  },
  { 
    name: "JavaScript", 
    category: "language", 
    proficiency: 92, 
    yearsExp: 8, 
    description: "Web development, dynamic UIs, and Node.js backend services",
    gradient: "from-yellow-400 to-orange-500"
  },
  { 
    name: "C++/CUDA", 
    category: "language", 
    proficiency: 85, 
    yearsExp: 6, 
    description: "GPU programming for ML acceleration - achieved 55x speedup at MIT CSAIL",
    gradient: "from-green-600 to-teal-500"
  },
    
  // Frameworks - Featured
  { 
    name: "React / React Native", 
    category: "framework", 
    proficiency: 90, 
    yearsExp: 5, 
    description: "Production web & mobile apps with complex state management",
    gradient: "from-cyan-400 to-blue-500",
    featured: true,
    highlights: ["Hooks", "Expo", "Mobile"]
  },
  { 
    name: "FastAPI", 
    category: "framework", 
    proficiency: 92, 
    yearsExp: 4, 
    description: "High-performance async Python APIs with OpenAPI docs",
    gradient: "from-teal-500 to-emerald-500",
    featured: true,
    highlights: ["Async", "Pydantic", "OpenAPI"]
  },
  { 
    name: "Next.js", 
    category: "framework", 
    proficiency: 85, 
    yearsExp: 4, 
    description: "Full-stack React with SSR, API routes, and edge functions",
    gradient: "from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100"
  },
 
  // Databases
  { 
    name: "PostgreSQL", 
    category: "database", 
    proficiency: 85, 
    yearsExp: 8, 
    description: "Complex queries, optimization, JSON operations, and extensions",
    gradient: "from-blue-700 to-indigo-600",
    featured: true,
    highlights: ["Performance", "JSONB", "Extensions"]
  },
  { 
    name: "Redis", 
    category: "database", 
    proficiency: 80, 
    yearsExp: 6, 
    description: "Caching, session management, pub/sub, and rate limiting",
    gradient: "from-red-500 to-red-700"
  },
  
  // Cloud & DevOps - Azure featured since Kiarash knows it better
  { 
    name: "Azure", 
    category: "cloud", 
    proficiency: 88, 
    yearsExp: 5, 
    description: "Azure OpenAI, App Services, Functions, Blob Storage, and DevOps",
    gradient: "from-sky-500 to-blue-600",
    featured: true,
    highlights: ["OpenAI", "Functions", "DevOps"]
  },
  { 
    name: "Docker", 
    category: "cloud", 
    proficiency: 90, 
    yearsExp: 6, 
    description: "Containerization, multi-stage builds, Docker Compose orchestration",
    gradient: "from-blue-400 to-blue-600",
    featured: true,
    highlights: ["Compose", "Multi-stage", "CI/CD"]
  },
  { 
    name: "AWS", 
    category: "cloud", 
    proficiency: 78, 
    yearsExp: 5, 
    description: "EC2, Lambda, S3, and core cloud infrastructure",
    gradient: "from-orange-400 to-orange-600"
  },
  { 
    name: "GCP", 
    category: "cloud", 
    proficiency: 82, 
    yearsExp: 4, 
    description: "Experience from Google - Cloud Functions, BigQuery, GKE",
    gradient: "from-blue-500 to-red-500"
  },
  
  // Tools
  { 
    name: "Git", 
    category: "tool", 
    proficiency: 95, 
    yearsExp: 10, 
    description: "Version control, complex workflows, branching strategies",
    gradient: "from-orange-500 to-red-500"
  },
  { 
    name: "Linux", 
    category: "tool", 
    proficiency: 92, 
    yearsExp: 10, 
    description: "System administration, shell scripting, DevOps workflows",
    gradient: "from-yellow-500 to-amber-600"
  },
  { 
    name: "CI/CD", 
    category: "tool", 
    proficiency: 85, 
    yearsExp: 6, 
    description: "GitHub Actions, automated testing, deployment pipelines",
    gradient: "from-purple-500 to-pink-500"
  },
]

const categoryConfig: Record<TechItem["category"], { label: string; icon: typeof Code; color: string }> = {
  language: { label: "Languages", icon: Code, color: "text-violet-500" },
  framework: { label: "Frameworks", icon: Box, color: "text-cyan-500" },
  database: { label: "Databases", icon: Database, color: "text-emerald-500" },
  cloud: { label: "Cloud & DevOps", icon: Cloud, color: "text-orange-500" },
  tool: { label: "Dev Tools", icon: Wrench, color: "text-pink-500" }
}

const categoryOrder: TechItem["category"][] = ["language", "framework", "database", "cloud", "tool"]

// Skill bar component with animation
function SkillBar({ proficiency, gradient }: { proficiency: number; gradient: string }) {
  return (
    <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${proficiency}%` }}
      />
    </div>
  )
}

// Featured tech card with glassmorphism
function FeaturedTechCard({ tech }: { tech: TechItem }) {
  return (
    <div className="group relative">
      {/* Gradient background glow */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${tech.gradient} rounded-2xl opacity-0 group-hover:opacity-70 blur transition-all duration-500`}
      />
      
      <Card className="relative h-full p-5 bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className={`w-full h-full bg-gradient-to-br ${tech.gradient} rounded-full blur-2xl`} />
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Featured</span>
              </div>
              <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </h4>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 text-xs font-medium">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>{tech.yearsExp}+ yrs</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {tech.description}
          </p>
          
          {/* Proficiency */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Proficiency</span>
              <span className="font-semibold">{tech.proficiency}%</span>
            </div>
            <SkillBar proficiency={tech.proficiency} gradient={tech.gradient} />
          </div>
          
          {/* Highlights */}
          {tech.highlights && (
            <div className="flex flex-wrap gap-1.5">
              {tech.highlights.map((highlight) => (
                <Badge 
                  key={highlight} 
                  variant="secondary" 
                  className="text-xs px-2 py-0.5 bg-muted/50 hover:bg-muted transition-colors"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

// Regular tech item (compact)
function TechItem({ tech }: { tech: TechItem }) {
  return (
    <div className="group relative flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-border/50 transition-all duration-200">
      {/* Gradient accent bar */}
      <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${tech.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">{tech.name}</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{tech.yearsExp}+ yrs</span>
        </div>
        <div className="mt-1.5">
          <SkillBar proficiency={tech.proficiency} gradient={tech.gradient} />
        </div>
      </div>
    </div>
  )
}

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<TechItem["category"] | "all">("all")
  
  const featuredTech = techStack.filter(tech => tech.featured)
  const filteredTech = activeCategory === "all" 
    ? techStack.filter(tech => !tech.featured)
    : techStack.filter(tech => tech.category === activeCategory && !tech.featured)
  
  // Group by category for "all" view
  const groupedTech = categoryOrder.reduce((acc, category) => {
    acc[category] = techStack.filter(tech => tech.category === category && !tech.featured)
    return acc
  }, {} as Record<TechItem["category"], TechItem[]>)
  
  return (
    <section aria-labelledby="tech-stack-heading" itemScope itemType="https://schema.org/ItemList">
      {/* SEO-friendly hidden content for crawlers and AI agents */}
      <div className="sr-only">
        <h3 id="tech-stack-heading">Technology Stack</h3>
        <meta itemProp="name" content="Kiarash Adl Technology Stack" />
        <p>10+ years of hands-on experience across the full development spectrum</p>
        
        <section aria-label="Core expertise technologies">
          <h4>Core Expertise</h4>
          <ul role="list">
            <li itemProp="itemListElement">Python: 95% proficiency, 10+ years - Primary language for AI/ML, backend APIs, automation, and data pipelines</li>
            <li itemProp="itemListElement">TypeScript: 90% proficiency, 6+ years - Full-stack web development with type safety for React and Node.js</li>
            <li itemProp="itemListElement">React/React Native: 90% proficiency, 5+ years - Production web and mobile apps with complex state management</li>
            <li itemProp="itemListElement">FastAPI: 92% proficiency, 4+ years - High-performance async Python APIs with OpenAPI docs</li>
            <li itemProp="itemListElement">PostgreSQL: 85% proficiency, 8+ years - Complex queries, optimization, JSON operations</li>
            <li itemProp="itemListElement">Azure: 88% proficiency, 5+ years - Azure OpenAI, App Services, Functions, DevOps</li>
            <li itemProp="itemListElement">Docker: 90% proficiency, 6+ years - Containerization, multi-stage builds, orchestration</li>
          </ul>
        </section>
        
        <section aria-label="All technologies">
          <h4>All Technologies</h4>
          <ul role="list">
            <li>Languages: Python, TypeScript, JavaScript, C++/CUDA</li>
            <li>Frameworks: React/React Native, FastAPI, Next.js</li>
            <li>Databases: PostgreSQL, Redis</li>
            <li>Cloud: Azure, Docker, AWS, GCP</li>
            <li>Tools: Git, Linux, CI/CD</li>
          </ul>
        </section>
      </div>
      
    <Card flat className="p-6 md:p-8 overflow-hidden relative">
      {/* Decorative background elements - reduced blur for performance */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 fill-primary text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Technology Stack</h3>
            </div>
            <p className="text-muted-foreground">
              10+ years of hands-on experience across the full development spectrum
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{techStack.length}</div>
              <div className="text-xs text-muted-foreground">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{featuredTech.length}</div>
              <div className="text-xs text-muted-foreground">Expert Level</div>
            </div>
          </div>
        </div>
        
        {/* Featured Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Core Expertise
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTech.map((tech) => (
              <FeaturedTechCard key={tech.name} tech={tech} />
            ))}
          </div>
        </div>
        
        {/* Category Tabs */}
        <div className="mb-6">
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as typeof activeCategory)}>
            <TabsList className="h-auto flex-wrap gap-1 bg-muted/30 p-1">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs px-3 py-1.5"
              >
                All
              </TabsTrigger>
              {categoryOrder.map((category) => {
                const config = categoryConfig[category]
                const Icon = config.icon
                return (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs px-3 py-1.5 gap-1.5"
                  >
                    <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    <span className="hidden sm:inline">{config.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Tech Grid */}
        {activeCategory === "all" ? (
          <div className="space-y-6">
            {categoryOrder.map((category) => {
              const techs = groupedTech[category]
              if (techs.length === 0) return null
              
              const config = categoryConfig[category]
              const Icon = config.icon
              
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      {config.label}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {techs.map((tech) => (
                      <TechItem key={tech.name} tech={tech} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredTech.map((tech) => (
              <TechItem key={tech.name} tech={tech} />
            ))}
          </div>
        )}
        
        {/* Bottom accent */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
              <span>90%+ Expert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
              <span>80-89% Advanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
              <span>70-79% Proficient</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </section>
  )
}
