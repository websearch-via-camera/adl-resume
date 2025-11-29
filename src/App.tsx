import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnvelopeSimple, Phone, Download, GithubLogo, LinkedinLogo, ArrowUpRight, PaperPlaneTilt, CaretUp, ChartBar, CaretDown } from "@phosphor-icons/react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import profileImage from "@/assets/images/Kiarash_Adl_Linkedin_Image.jpg"
import resumePdf from "@/assets/documents/Kiarash-Adl-Resume-20251129.pdf"

// New components for enhanced tech showcase
import { ThemeToggle } from "@/components/ThemeToggle"
import { GitHubActivity } from "@/components/GitHubActivity"
import { TechStack } from "@/components/TechStack"
import { EngineeringMetrics } from "@/components/EngineeringMetrics"
import { TerminalSection } from "@/components/TerminalSection"
import { TypewriterTagline } from "@/components/TypewriterTagline"
import { CustomCursor } from "@/components/CustomCursor"
import { Guestbook } from "@/components/Guestbook"
import { useKeyboardNavigation, KeyboardHelp } from "@/hooks/useKeyboardNavigation"

function App() {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    // Signal that app is ready - removes initial opacity:0
    requestAnimationFrame(() => {
      document.getElementById('root')?.classList.add('ready')
    })
  }, [])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isNavVisible, setIsNavVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  
  const { scrollY } = useScroll()
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsNavVisible(latest > 200)
    setShowScrollTop(latest > 400)
    setShowScrollIndicator(latest < 100)
    
    const sections = ["home", "projects", "skills", "showcase", "experience", "contact"]
    const sectionElements = sections.map(id => document.getElementById(id))
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = sectionElements[i]
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 150) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollableHeight = documentHeight - windowHeight
    const progress = (latest / scrollableHeight) * 100
    setScrollProgress(Math.min(Math.max(progress, 0), 100))
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Send to Cloudflare Pages Function
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      toast.success("Message sent successfully! I'll get back to you soon.")
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try emailing directly.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
  
  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "showcase", label: "Showcase" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" }
  ]

  // Keyboard navigation hook
  const sections = navItems.map(item => item.id)
  const { showHelp, setShowHelp } = useKeyboardNavigation({
    sections,
    scrollToSection,
    scrollToTop
  })

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

  return (
    <div className="min-h-screen bg-background cursor-none">
      <CustomCursor />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-muted z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 0 ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />
      </motion.div>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isNavVisible ? 0 : -100,
          opacity: isNavVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors flex-shrink-0"
            >
              Kiarash Adl
            </button>
            
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-shrink min-w-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="ml-2 border-l border-border pl-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.header 
        id="home"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="py-16 px-6 md:py-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div variants={fadeIn} className="flex-shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-2xl">
                <img 
                  src={profileImage}
                  alt="Kiarash Adl"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex-1 text-center md:text-left">
              {/* Name & Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2">
                Kiarash Adl
              </h1>
              <TypewriterTagline />
              
              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                  MIT EECS '14
                </Badge>
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                  10+ Years Experience
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium border-primary/30 text-primary">
                  Human + AI Projects
                </Badge>
              </div>
              
              {/* What I Do - Concise */}
              <p className="text-lg text-foreground mb-6 max-w-xl">
                Building end-to-end AI platforms, agentic systems, and scalable cloud architectures.
              </p>
              
              {/* Contact & Socials - Unified Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a 
                  href="mailto:kiarasha@alum.mit.edu" 
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-all text-sm font-medium"
                >
                  <EnvelopeSimple size={18} weight="fill" className="text-primary" />
                  <span>kiarasha@alum.mit.edu</span>
                </a>
                <a 
                  href="tel:+18579281608" 
                  className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-all text-sm font-medium"
                >
                  <Phone size={18} weight="fill" className="text-primary" />
                  <span>857-928-1608</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/kiarashadl/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <LinkedinLogo size={18} weight="fill" />
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/kiarashplusplus/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <GithubLogo size={18} weight="fill" />
                  <span>GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showScrollIndicator ? 0.7 : 0
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <CaretDown size={28} weight="bold" className="text-muted-foreground" />
        </motion.div>
      </motion.div>

      <Separator className="max-w-5xl mx-auto" />

      <section className="py-12 px-6 md:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center"
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-foreground/80 italic leading-relaxed">
              Simple ideas are hard-earned, but that's where true power lives.
            </p>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section id="projects" className="py-16 px-6 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-10">
              Featured Projects
            </motion.h2>
            
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <Card className="p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:border-primary/40 group">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                          Financial Intelligence Meta-Layer (FIML)
                        </h3>
                        <Badge variant="outline" className="border-green-500/50 text-green-600 text-xs">Open Source</Badge>
                      </div>
                      <p className="text-foreground mb-4">
                        AI-native MCP server for financial data aggregation with intelligent multi-provider orchestration and multilingual compliance guardrails.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">32K+</div>
                          <div className="text-xs text-muted-foreground">Lines of Code</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">1,403</div>
                          <div className="text-xs text-muted-foreground">Automated Tests</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">100%</div>
                          <div className="text-xs text-muted-foreground">Pass Rate</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">Phase 2</div>
                          <div className="text-xs text-muted-foreground">In Progress</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">Python</Badge>
                        <Badge variant="secondary" className="text-xs">MCP Server</Badge>
                        <Badge variant="secondary" className="text-xs">AI Orchestration</Badge>
                        <Badge variant="secondary" className="text-xs">Expo</Badge>
                        <Badge variant="secondary" className="text-xs">CI/CD</Badge>
                      </div>
                    </div>
                    <a href="https://github.com/kiarashplusplus/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                      <GithubLogo size={24} weight="fill" className="text-foreground" />
                    </a>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:border-primary/40 group">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                          HireAligna.ai
                        </h3>
                        <Badge variant="outline" className="border-blue-500/50 text-blue-600 text-xs">SaaS Platform</Badge>
                      </div>
                      <p className="text-foreground mb-4">
                        Conversational AI recruiter that schedules and conducts voice interviews via LiveKit, transcribes with Azure OpenAI, and performs automated candidate-job matching.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">AI</div>
                          <div className="text-xs text-muted-foreground">Voice Interviews</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">17+</div>
                          <div className="text-xs text-muted-foreground">Docker Services</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">2-Way</div>
                          <div className="text-xs text-muted-foreground">Smart Matching</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-primary">Full</div>
                          <div className="text-xs text-muted-foreground">Observability</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">Next.js</Badge>
                        <Badge variant="secondary" className="text-xs">LiveKit</Badge>
                        <Badge variant="secondary" className="text-xs">Azure OpenAI</Badge>
                        <Badge variant="secondary" className="text-xs">PostgreSQL</Badge>
                        <Badge variant="secondary" className="text-xs">Docker</Badge>
                      </div>
                    </div>
                    <div className="flex-shrink-0 p-3 rounded-lg bg-muted">
                      <ArrowUpRight size={24} weight="bold" className="text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section id="skills" className="py-16 px-6 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Technical Expertise</h2>
              <p className="text-muted-foreground">
                From AI/ML to full-stack development and engineering leadership
              </p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="technical">Technical Stack</TabsTrigger>
                  <TabsTrigger value="aiml">AI & ML</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  <Card className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-center">Competency Radar</h3>
                    {isMounted ? (
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
                    ) : (
                      <div className="w-full h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">Loading chart...</p>
                      </div>
                    )}
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
                    {isMounted ? (
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
                    ) : (
                      <div className="w-full h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
                        <p className="text-muted-foreground">Loading chart...</p>
                      </div>
                    )}
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Enhanced Technical Showcase Section */}
      <section id="showcase" className="py-16 px-6 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Developer Showcase</h2>
              <p className="text-muted-foreground">
                Interactive demonstrations of engineering capabilities and code quality
              </p>
            </motion.div>

            {/* Engineering Metrics */}
            <motion.div variants={fadeIn} className="mb-8">
              <EngineeringMetrics />
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={fadeIn} className="mb-8">
              <TechStack />
            </motion.div>

            {/* GitHub Activity */}
            <motion.div variants={fadeIn} className="mb-8">
              <GitHubActivity />
            </motion.div>

            {/* Interactive Terminal */}
            <motion.div variants={fadeIn}>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Interactive Terminal</h3>
                <p className="text-sm text-muted-foreground">
                  Explore my profile using familiar terminal commands
                </p>
              </div>
              <TerminalSection />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section id="experience" className="py-16 px-6 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Experience</h2>
                <p className="text-muted-foreground">10+ years building AI systems at scale</p>
              </div>
              <Button className="gap-2 shadow-md" asChild>
                <a href={resumePdf} download="Kiarash-Adl-Resume.pdf">
                  <Download size={18} weight="bold" />
                  Resume (PDF)
                </a>
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-10">
              <div className="relative border-l-2 border-primary/20 pl-6 space-y-8 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                    <h4 className="text-lg font-bold">Founder & CEO</h4>
                    <span className="text-primary font-medium">AI Vision</span>
                    <span className="text-muted-foreground text-sm">2024 – Present</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    Built patent-pending AI and computer vision solutions for home services. Led development from prototype to App Store. Established company strategy and high-performing team.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary/60 border-4 border-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                    <h4 className="text-lg font-bold">Technical Consulting</h4>
                    <span className="text-primary font-medium">Various Clients</span>
                    <span className="text-muted-foreground text-sm">2019 – 2024</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    Delivered MVPs and prototypes, established best practices. Advised on technology roadmaps. Translated product vision into actionable engineering plans.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary/60 border-4 border-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                    <h4 className="text-lg font-bold">Founder & CEO</h4>
                    <span className="text-primary font-medium">Monir</span>
                    <span className="text-muted-foreground text-sm">2018 – 2019</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    AI technology for personalized shopping content. Serverless Python microservices platform. Secured VC funding and led multidisciplinary team.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary/60 border-4 border-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                    <h4 className="text-lg font-bold">Software Engineer</h4>
                    <span className="text-primary font-medium">Google</span>
                    <span className="text-muted-foreground text-sm">2014 – 2018</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    Search Knowledge Panel features serving billions of queries. Knowledge Graph image selection system. Cross-functional collaboration on user experience.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                    <h4 className="text-lg font-bold">SWE Intern</h4>
                    <span className="text-primary font-medium">Twitter Ads</span>
                    <span className="text-muted-foreground text-sm">2014</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    Experimental ML algorithm for audience expansion. Scalable multi-label ridge regression in Hadoop/Scalding.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background"></div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                    <h4 className="text-lg font-bold">Researcher</h4>
                    <span className="text-primary font-medium">Tim Berners-Lee Lab</span>
                    <span className="text-muted-foreground text-sm">2014</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    Under Sir Tim Berners-Lee. Built tools for internet censorship data visualization and analysis.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="grid md:grid-cols-2 gap-6">
              {/* Education */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Education
                </h3>
                <div>
                  <h4 className="font-bold">MIT</h4>
                  <p className="text-primary text-sm font-medium">B.S. Electrical Engineering & Computer Science</p>
                  <p className="text-muted-foreground text-sm">Class of 2014</p>
                </div>
              </Card>

              {/* Research Publications */}
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Research Publications
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">55x GPU Speech Recognition Speed-up</p>
                    <p className="text-xs text-muted-foreground">ICASSP 2012 • MIT CSAIL</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Feature Factory: Crowdsourced Discovery</p>
                    <p className="text-xs text-muted-foreground">ACM L@S 2015 • MIT CSAIL</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section id="contact" className="py-16 px-6 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Get In Touch</h2>
              <p className="text-muted-foreground">
                Let's discuss AI innovation, collaboration, or your next project.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-6 md:gap-8">
              <motion.div variants={fadeIn} className="md:col-span-2 space-y-4">
                <a 
                  href="mailto:kiarasha@alum.mit.edu" 
                  className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <EnvelopeSimple size={20} weight="fill" className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium group-hover:text-primary transition-colors">kiarasha@alum.mit.edu</div>
                  </div>
                </a>

                <a 
                  href="tel:+18579281608" 
                  className="flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone size={20} weight="fill" className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium group-hover:text-primary transition-colors">+1-857-928-1608</div>
                  </div>
                </a>

                <div className="flex gap-3 pt-2">
                  <a 
                    href="https://www.linkedin.com/in/kiarashadl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-medium"
                  >
                    <LinkedinLogo size={20} weight="fill" />
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/kiarashplusplus/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all font-medium"
                  >
                    <GithubLogo size={20} weight="fill" />
                    GitHub
                  </a>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="md:col-span-3">
                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-sm">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-sm">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2"
                    >
                      <PaperPlaneTilt size={18} weight="fill" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Guestbook Section */}
      <section id="guestbook" className="py-16 px-6 md:py-20 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Guestbook />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 Kiarash Adl</p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/kiarashadl/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <LinkedinLogo size={20} weight="fill" />
              </a>
              <a href="https://github.com/kiarashplusplus/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <GithubLogo size={20} weight="fill" />
              </a>
              <span className="text-border">|</span>
              <span>MIT EECS '14</span>
              <span className="text-border">|</span>
              <span className="hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border">?</kbd> for shortcuts
              </span>
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-40 animate-in fade-in zoom-in"
          aria-label="Scroll to top"
        >
          <CaretUp size={24} weight="bold" />
        </button>
      )}

      {/* Keyboard Navigation */}
      <KeyboardHelp show={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}

export default App
