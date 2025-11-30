import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Briefcase, 
  Lightbulb, 
  GraduationCap, 
  Code, 
  Rocket,
  Buildings,
  MapPin,
  Calendar,
  ArrowRight,
  X
} from "@phosphor-icons/react"

interface TimelineEntry {
  id: string
  role: string
  company: string
  location: string
  period: string
  startYear: number
  endYear: number | null
  type: "current" | "founder" | "corporate" | "research" | "education"
  summary: string
  highlights: string[]
  technologies: string[]
  impact?: string
  icon: typeof Briefcase
}

const timelineData: TimelineEntry[] = [
  {
    id: "ai-vision",
    role: "Founder & CEO",
    company: "AI Vision",
    location: "Boston, MA",
    period: "2024 – Present",
    startYear: 2024,
    endYear: null,
    type: "current",
    summary: "Building patent-pending AI and computer vision solutions for home services.",
    highlights: [
      "Led development from prototype to App Store launch",
      "Established company strategy and built high-performing team",
      "Designed end-to-end AI pipeline for real-time image analysis",
      "Patent-pending computer vision technology"
    ],
    technologies: ["Python", "React Native", "Computer Vision", "iOS", "TensorFlow"],
    impact: "App Store ready with patent-pending technology",
    icon: Rocket
  },
  {
    id: "consulting",
    role: "Technical Consulting",
    company: "Various Clients",
    location: "Remote",
    period: "2019 – 2024",
    startYear: 2019,
    endYear: 2024,
    type: "founder",
    summary: "Delivered MVPs, established best practices, and advised on technology roadmaps.",
    highlights: [
      "Built production-ready MVPs for multiple startups",
      "Established engineering best practices and CI/CD pipelines",
      "Translated product vision into actionable engineering plans",
      "Mentored engineering teams on AI/ML integration"
    ],
    technologies: ["Python", "TypeScript", "React", "FastAPI", "Docker", "AWS"],
    impact: "Multiple successful product launches",
    icon: Lightbulb
  },
  {
    id: "monir",
    role: "Founder & CEO",
    company: "Monir",
    location: "Boston, MA",
    period: "2018 – 2019",
    startYear: 2018,
    endYear: 2019,
    type: "founder",
    summary: "AI technology for personalized shopping content with serverless architecture.",
    highlights: [
      "Secured VC funding and led multidisciplinary team",
      "Built serverless Python microservices platform",
      "Developed AI-powered personalization engine",
      "Managed product roadmap and investor relations"
    ],
    technologies: ["Python", "AWS Lambda", "Machine Learning", "Serverless"],
    impact: "VC-funded startup with innovative AI technology",
    icon: Briefcase
  },
  {
    id: "google",
    role: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    period: "2014 – 2018",
    startYear: 2014,
    endYear: 2018,
    type: "corporate",
    summary: "Search Knowledge Panel features serving billions of queries daily.",
    highlights: [
      "Built Knowledge Panel features serving billions of queries",
      "Developed Knowledge Graph image selection system",
      "Cross-functional collaboration on search UX improvements",
      "Worked on large-scale distributed systems"
    ],
    technologies: ["C++", "Python", "Go", "Borg", "MapReduce", "Spanner"],
    impact: "Features serving billions of users worldwide",
    icon: Buildings
  },
  {
    id: "twitter",
    role: "SWE Intern",
    company: "Twitter Ads",
    location: "San Francisco, CA",
    period: "Summer 2014",
    startYear: 2014,
    endYear: 2014,
    type: "corporate",
    summary: "Experimental ML algorithm for audience expansion in advertising.",
    highlights: [
      "Developed ML algorithm for audience expansion",
      "Built scalable multi-label ridge regression system",
      "Implemented in Hadoop/Scalding framework",
      "Improved ad targeting accuracy"
    ],
    technologies: ["Scala", "Hadoop", "Scalding", "Machine Learning"],
    impact: "Production ML system for ad targeting",
    icon: Code
  },
  {
    id: "mit-research",
    role: "Research Assistant",
    company: "MIT CSAIL",
    location: "Cambridge, MA",
    period: "2012 – 2014",
    startYear: 2012,
    endYear: 2014,
    type: "research",
    summary: "GPU acceleration research and work under Sir Tim Berners-Lee.",
    highlights: [
      "Achieved 55x GPU speedup in speech recognition (ICASSP 2012)",
      "Worked under Sir Tim Berners-Lee on internet censorship analysis",
      "Co-authored Feature Factory paper (ACM L@S 2015)",
      "CUDA kernel development for ML acceleration"
    ],
    technologies: ["CUDA", "C++", "Python", "GPU Computing", "Speech Recognition"],
    impact: "Published research with 55x performance improvement",
    icon: GraduationCap
  }
]

const typeColors = {
  current: "from-primary/70 to-primary/50",
  founder: "from-muted-foreground/60 to-muted-foreground/40",
  corporate: "from-primary/50 to-primary/30",
  research: "from-muted-foreground/50 to-muted-foreground/30",
  education: "from-primary/40 to-primary/20"
}

const typeBadgeStyles = {
  current: "bg-primary/10 text-primary border-primary/30",
  founder: "bg-muted text-muted-foreground border-border",
  corporate: "bg-primary/10 text-primary border-primary/30",
  research: "bg-muted text-muted-foreground border-border",
  education: "bg-primary/10 text-primary border-primary/30"
}

const typeLabels = {
  current: "Current",
  founder: "Founder",
  corporate: "Corporate",
  research: "Research",
  education: "Education"
}

export function InteractiveTimeline() {
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)
  
  // Calculate timeline span
  const minYear = Math.min(...timelineData.map(e => e.startYear))
  const maxYear = new Date().getFullYear()
  const totalYears = maxYear - minYear + 1
  
  return (
    <div className="space-y-8">
      {/* Visual Timeline Bar */}
      <div className="relative">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
        <div className="relative h-16 bg-muted/30 rounded-xl overflow-hidden">
          {/* Year markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalYears }, (_, i) => (
              <div 
                key={i} 
                className="flex-1 border-r border-border/30 last:border-r-0"
              />
            ))}
          </div>
          
          {/* Timeline entries as bars */}
          {timelineData.map((entry) => {
            const startOffset = ((entry.startYear - minYear) / totalYears) * 100
            const endYear = entry.endYear || maxYear
            const duration = ((endYear - entry.startYear + 1) / totalYears) * 100
            
            return (
              <motion.button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                onMouseEnter={() => setHoveredEntry(entry.id)}
                onMouseLeave={() => setHoveredEntry(null)}
                className={`absolute top-2 h-12 rounded-lg cursor-pointer transition-all duration-200 ${
                  hoveredEntry === entry.id || selectedEntry?.id === entry.id 
                    ? "z-20 scale-y-110 shadow-lg" 
                    : "z-10"
                }`}
                style={{
                  left: `${startOffset}%`,
                  width: `${Math.max(duration, 3)}%`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`${entry.role} at ${entry.company}, ${entry.period}. Click to view details.`}
                aria-pressed={selectedEntry?.id === entry.id}
              >
                <div 
                  className={`w-full h-full rounded-lg bg-gradient-to-r ${typeColors[entry.type]} ${
                    selectedEntry?.id === entry.id ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                />
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {hoveredEntry === entry.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-md shadow-lg whitespace-nowrap z-30 border"
                    >
                      {entry.company} • {entry.period}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 justify-start">
          {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map((type) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded bg-gradient-to-r ${typeColors[type]}`} />
              <span className="text-xs text-muted-foreground">{typeLabels[type]}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Clickable Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {timelineData.map((entry, index) => {
          const Icon = entry.icon
          const isSelected = selectedEntry?.id === entry.id
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg group ${
                  isSelected 
                    ? "ring-2 ring-primary shadow-lg" 
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedEntry(isSelected ? null : entry)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${typeColors[entry.type]} text-white shrink-0`}>
                    <Icon size={20} weight="fill" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">
                          {entry.role}
                        </h4>
                        <p className="text-primary text-sm font-medium">{entry.company}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs shrink-0 ${typeBadgeStyles[entry.type]}`}>
                        {entry.period.split(" ")[0]}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {entry.summary}
                    </p>
                    
                    {/* Expand indicator */}
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View details</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
      
      {/* Expanded Detail Panel */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-background to-muted/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${typeColors[selectedEntry.type]} text-white`}>
                    <selectedEntry.icon size={28} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedEntry.role}</h3>
                    <p className="text-primary font-medium text-lg">{selectedEntry.company}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {selectedEntry.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {selectedEntry.location}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="min-h-[44px] min-w-[44px] p-2 hover:bg-muted rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Close details panel"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              
              <p className="text-foreground mb-4">{selectedEntry.summary}</p>
              
              {/* Impact badge */}
              {selectedEntry.impact && (
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-sm font-medium text-primary">
                    🎯 Impact: {selectedEntry.impact}
                  </span>
                </div>
              )}
              
              {/* Highlights */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                  Key Achievements
                </h4>
                <ul className="space-y-2">
                  {selectedEntry.highlights.map((highlight, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-primary mt-1">●</span>
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Technologies */}
              <div>
                <h4 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
