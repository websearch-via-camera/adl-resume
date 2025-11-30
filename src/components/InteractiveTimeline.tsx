import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Briefcase, 
  Lightbulb, 
  GraduationCap, 
  Code, 
  Rocket,
  Building2,
  MapPin,
  Calendar,
  ArrowRight,
  X,
  ChevronDown,
  Sparkles,
  Target
} from "lucide-react"

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
  icon: React.ComponentType<{ className?: string }>
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
    icon: Building2
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
  const detailRef = useRef<HTMLDivElement>(null)
  
  // Calculate timeline span
  const minYear = Math.min(...timelineData.map(e => e.startYear))
  const maxYear = new Date().getFullYear()
  const totalYears = maxYear - minYear + 1
  
  // Determine the index of the selected entry to insert detail panel after its row
  const selectedIndex = selectedEntry 
    ? timelineData.findIndex(e => e.id === selectedEntry.id)
    : -1
  
  // Calculate which row the selected entry is in (3 columns on lg, 2 on md, 1 on sm)
  // We'll use a simple approach: insert detail after the card on mobile/tablet
  // For desktop (3 cols), find the end of the row
  const getRowEndIndex = (index: number, cols: number) => {
    const row = Math.floor(index / cols)
    return Math.min((row + 1) * cols - 1, timelineData.length - 1)
  }
  
  // Scroll to detail panel when opened - use a more stable approach
  useEffect(() => {
    if (selectedEntry && detailRef.current) {
      // Use requestAnimationFrame for smoother scrolling after layout settles
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      })
    }
  }, [selectedEntry])
  
  // Create a rendering array that includes detail panels at the right positions
  const renderItems = useMemo(() => {
    if (selectedIndex === -1) {
      return timelineData.map((entry, index) => ({ type: 'card' as const, entry, index }))
    }
    
    const items: Array<{ type: 'card' | 'detail'; entry: TimelineEntry; index: number }> = []
    
    // For responsive layout, we'll insert the detail right after the selected card
    // The CSS grid will handle the full-width spanning
    timelineData.forEach((entry, index) => {
      items.push({ type: 'card', entry, index })
      
      // Insert detail panel right after the selected card
      if (entry.id === selectedEntry?.id) {
        items.push({ type: 'detail', entry, index })
      }
    })
    
    return items
  }, [selectedIndex, selectedEntry])
  
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
                onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
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
      
      {/* Clickable Cards Grid with Inline Detail Panels */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {renderItems.map((item, renderIndex) => {
          if (item.type === 'detail') {
            // Render the detail panel spanning full width
            return (
              <motion.div
                key={`detail-${item.entry.id}`}
                ref={detailRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="col-span-full"
                layout={false}
              >
                <Card className="relative p-0 overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-card via-card to-muted/30 shadow-xl shadow-primary/5">
                  {/* Decorative gradient backgrounds */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        {/* Icon with glow effect */}
                        <div className="relative group/icon">
                          <div className={`absolute inset-0 bg-gradient-to-br ${typeColors[item.entry.type]} rounded-2xl blur-lg opacity-50 group-hover/icon:opacity-80 transition-opacity`} />
                          <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${typeColors[item.entry.type]} text-white shadow-lg`}>
                            <item.entry.icon className="h-8 w-8" />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`text-xs ${typeBadgeStyles[item.entry.type]}`}>
                              {typeLabels[item.entry.type]}
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground">{item.entry.role}</h3>
                          <p className="text-xl text-primary font-semibold">{item.entry.company}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-primary/70" />
                              {item.entry.period}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-primary/70" />
                              {item.entry.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedEntry(null)}
                        className="min-h-[44px] min-w-[44px] p-2.5 bg-muted/50 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all duration-200 flex items-center justify-center group/close self-start"
                        aria-label="Close details panel"
                      >
                        <X className="h-5 w-5 transition-transform duration-200 group-hover/close:rotate-90" aria-hidden="true" />
                      </button>
                    </div>
                    
                    {/* Summary */}
                    <p className="text-foreground/90 text-lg leading-relaxed mb-6">{item.entry.summary}</p>
                    
                    {/* Impact badge - prominent */}
                    {item.entry.impact && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border border-primary/20 flex items-start gap-3"
                      >
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Impact</span>
                          <p className="text-foreground font-medium mt-0.5">{item.entry.impact}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Two column layout for achievements and technologies */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Highlights */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {item.entry.highlights.map((highlight, i) => (
                            <li 
                              key={i}
                              className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors group/item"
                            >
                              <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
                              <span className="text-foreground/80 group-hover/item:text-foreground transition-colors">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Technologies */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Code className="h-4 w-4 text-primary" />
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {item.entry.technologies.map((tech, i) => (
                            <Badge 
                              key={tech}
                              variant="secondary" 
                              className="px-3 py-1.5 text-sm bg-muted/60 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30 transition-all duration-200 cursor-default"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          }
          
          // Render normal card
          const entry = item.entry
          const Icon = entry.icon
          const isSelected = selectedEntry?.id === entry.id
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.index * 0.05 }}
            >
              <Card 
                className={`relative p-4 cursor-pointer transition-all duration-300 hover:shadow-xl group overflow-hidden ${
                  isSelected 
                    ? "ring-2 ring-primary shadow-xl shadow-primary/10 bg-primary/5" 
                    : "hover:border-primary/50 hover:-translate-y-1"
                }`}
                onClick={() => setSelectedEntry(isSelected ? null : entry)}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10 flex items-start gap-3">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${typeColors[entry.type]} text-white shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <Icon className="h-5 w-5" />
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
                    
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                      {entry.summary}
                    </p>
                    
                    {/* Expand indicator */}
                    <div className={`flex items-center gap-1.5 mt-3 text-xs font-medium transition-all duration-300 ${
                      isSelected 
                        ? "text-primary" 
                        : "text-muted-foreground group-hover:text-primary"
                    }`}>
                      <span>{isSelected ? "Hide details" : "View details"}</span>
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isSelected ? "rotate-180" : "group-hover:translate-y-0.5"}`} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
