import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnvelopeSimple, Phone, Download, GithubLogo, LinkedinLogo, ArrowUpRight, PaperPlaneTilt, CaretUp, CaretDown } from "@phosphor-icons/react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState, useEffect, useRef, lazy, Suspense } from "react"
import { toast } from "sonner"
import resumePdf from "@/assets/documents/Kiarash-Adl-Resume-20251129.pdf"

// Responsive profile images - WebP with JPEG fallback
import profileWebp192 from "@/assets/images/profile-192w.webp"
import profileWebp384 from "@/assets/images/profile-384w.webp"
import profileWebp224 from "@/assets/images/profile-224w.webp"
import profileWebp448 from "@/assets/images/profile-448w.webp"
import profileJpg384 from "@/assets/images/profile-384w.jpg"

// Lightweight components loaded immediately
import { ThemeToggle } from "@/components/ThemeToggle"
import { TypewriterTagline } from "@/components/TypewriterTagline"
import { CustomCursor } from "@/components/CustomCursor"
import { OnboardingChoice } from "@/components/OnboardingChoice"
import { WeatherIndicator } from "@/components/WeatherIndicator"
import { useKeyboardNavigation, KeyboardHelp } from "@/hooks/useKeyboardNavigation"
import { A11yProvider, SkipLinks, useA11y } from "@/components/A11yProvider"
import { 
  ScrollReveal, 
  StaggerContainer, 
  StaggerItem, 
  SectionTransition,
  HoverCard,
  PageTransition
} from "@/components/ScrollAnimations"

// Heavy components lazy loaded for better initial performance
const GitHubActivity = lazy(() => import("@/components/GitHubActivity").then(m => ({ default: m.GitHubActivity })))
const TechStack = lazy(() => import("@/components/TechStack").then(m => ({ default: m.TechStack })))
const EngineeringMetrics = lazy(() => import("@/components/EngineeringMetrics").then(m => ({ default: m.EngineeringMetrics })))
const TerminalSection = lazy(() => import("@/components/TerminalSection").then(m => ({ default: m.TerminalSection })))
const Guestbook = lazy(() => import("@/components/Guestbook").then(m => ({ default: m.Guestbook })))
const InteractiveTimeline = lazy(() => import("@/components/InteractiveTimeline").then(m => ({ default: m.InteractiveTimeline })))

// Recharts components lazy loaded (heavy charting library)
const SkillsCharts = lazy(() => import("@/components/SkillsCharts"))

// Loading fallback component
const SectionLoader = ({ height = "h-64" }: { height?: string }) => (
  <div className={`${height} flex items-center justify-center bg-muted/20 rounded-lg animate-pulse`}>
    <div className="text-muted-foreground text-sm">Loading...</div>
  </div>
)

function App() {
  const [isMounted, setIsMounted] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [visitorType, setVisitorType] = useState<"developer" | "visitor" | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsMounted(true)
    
    // Check if user has already made a choice
    try {
      const savedType = localStorage.getItem("kiarash-visitor-type")
      
      // Validate that the saved type is one of our expected values
      if (savedType === "developer" || savedType === "visitor") {
        setVisitorType(savedType)
        setShowOnboarding(false)
        
        // If returning developer, scroll to terminal
        if (savedType === "developer") {
          setTimeout(() => {
            const terminalElement = document.getElementById("showcase")
            if (terminalElement) {
              const offset = 80
              const elementPosition = terminalElement.getBoundingClientRect().top
              const offsetPosition = elementPosition + window.pageYOffset - offset
              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              })
            }
          }, 100)
        }
      } else {
        // Clear any invalid values and show onboarding
        if (savedType !== null) {
          localStorage.removeItem("kiarash-visitor-type")
        }
        setShowOnboarding(true)
      }
    } catch {
      // localStorage might not be available (private browsing, etc.)
      setShowOnboarding(true)
    }
    
    // Signal that app is ready - removes initial opacity:0
    requestAnimationFrame(() => {
      document.getElementById('root')?.classList.add('ready')
    })
  }, [])
  
  // Handle onboarding choice
  const handleOnboardingChoice = (isDeveloper: boolean) => {
    const type = isDeveloper ? "developer" : "visitor"
    setVisitorType(type)
    setShowOnboarding(false)
    
    // Store preference safely (localStorage might throw in some browsers)
    try {
      localStorage.setItem("kiarash-visitor-type", type)
    } catch {
      // localStorage not available, preference won't persist
    }
    
    // If developer, scroll to terminal after a short delay
    if (isDeveloper) {
      setTimeout(() => {
        const terminalElement = document.getElementById("showcase")
        if (terminalElement) {
          const offset = 80
          const elementPosition = terminalElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, 100)
    } else {
      // For regular visitors, ensure we're at the top
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }
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

  // Accessibility context - must be before animation variants
  const { announce, prefersReducedMotion } = useA11y()

  // Enhanced animation variants with reduced motion support
  const fadeIn = prefersReducedMotion 
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            ease: "easeOut" as const
          }
        }
      }

  const staggerContainer = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
          }
        }
      }
  
  // Slide in from left for alternating effects
  const slideInLeft = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: -50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.6, ease: "easeOut" as const }
        }
      }
  
  // Slide in from right
  const slideInRight = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, x: 50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.6, ease: "easeOut" as const }
        }
      }
  
  // Scale up effect for cards
  const scaleIn = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.5, ease: "easeOut" as const }
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
      announce("Form error: Please fill in all required fields", "assertive")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      announce("Form error: Please enter a valid email address", "assertive")
      return
    }

    setIsSubmitting(true)
    announce("Sending message, please wait")

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
      announce("Message sent successfully", "assertive")
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMsg = error instanceof Error ? error.message : "Failed to send message. Please try emailing directly."
      toast.error(errorMsg)
      announce(`Error: ${errorMsg}`, "assertive")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "showcase", label: "Showcase" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" }
  ]
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? "instant" : "smooth"
      })
      
      // Announce section navigation to screen readers
      const sectionLabel = navItems.find(item => item.id === sectionId)?.label || sectionId
      announce(`Navigated to ${sectionLabel} section`)
    }
  }
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth"
    })
    announce("Scrolled to top of page")
  }

  // Keyboard navigation hook
  const sections = navItems.map(item => item.id)
  const { showHelp, setShowHelp } = useKeyboardNavigation({
    sections,
    scrollToSection,
    scrollToTop
  })

  return (
    <>
      {/* Skip Links for keyboard/screen reader navigation */}
      <SkipLinks />
      
      {/* Onboarding Choice Modal */}
      {showOnboarding && (
        <OnboardingChoice onChoice={handleOnboardingChoice} />
      )}
      
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
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
        aria-label="Main navigation"
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors flex-shrink-0"
              aria-label="Go to home section"
            >
              Kiarash Adl
            </button>
            
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-shrink min-w-0" role="navigation">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  aria-current={activeSection === item.id ? "true" : undefined}
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

      <main id="main-content" role="main" aria-label="Portfolio content">
      <motion.header 
        id="home"
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate="visible"
        variants={prefersReducedMotion ? undefined : staggerContainer}
        className="py-16 px-6 md:py-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div variants={fadeIn} className="flex-shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-2xl">
                <picture>
                  {/* WebP sources for modern browsers */}
                  <source
                    type="image/webp"
                    srcSet={`${profileWebp192} 192w, ${profileWebp384} 384w, ${profileWebp224} 224w, ${profileWebp448} 448w`}
                    sizes="(max-width: 768px) 192px, 224px"
                  />
                  {/* JPEG fallback */}
                  <img 
                    src={profileJpg384}
                    alt="Kiarash Adl - AI Systems Architect"
                    className="w-full h-full object-cover"
                    width={224}
                    height={224}
                    fetchPriority="high"
                    decoding="async"
                    loading="eager"
                  />
                </picture>
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="flex-1 text-center md:text-left">
              {/* Live Status & Weather */}
              <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Available for work
                  </span>
                </div>
              </div>
              
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
              <Suspense fallback={<SectionLoader height="h-[500px]" />}>
                <SkillsCharts />
              </Suspense>
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
              <Suspense fallback={<SectionLoader />}>
                <EngineeringMetrics />
              </Suspense>
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={fadeIn} className="mb-8">
              <Suspense fallback={<SectionLoader />}>
                <TechStack />
              </Suspense>
            </motion.div>

            {/* GitHub Activity */}
            <motion.div variants={fadeIn} className="mb-8">
              <Suspense fallback={<SectionLoader />}>
                <GitHubActivity />
              </Suspense>
            </motion.div>

            {/* Interactive Terminal */}
            <motion.div variants={fadeIn}>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">Interactive Terminal</h3>
                <p className="text-sm text-muted-foreground">
                  Explore my profile using familiar terminal commands
                </p>
              </div>
              <Suspense fallback={<SectionLoader height="h-96" />}>
                <TerminalSection />
              </Suspense>
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
              <Suspense fallback={<SectionLoader height="h-96" />}>
                <InteractiveTimeline />
              </Suspense>
            </motion.div>

            <motion.div variants={fadeIn} className="grid md:grid-cols-2 gap-6">
              {/* Education */}
              <Card className="p-6 relative overflow-hidden group">
                {/* Decorative MIT-inspired gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-gray-500/5 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Education
                </h3>
                
                <div className="relative z-10 space-y-4">
                  {/* MIT Main Entry */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-gray-800 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        MIT
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">Massachusetts Institute of Technology</h4>
                      <p className="text-primary text-sm font-semibold">B.S. Electrical Engineering & Computer Science</p>
                      <p className="text-muted-foreground text-xs mt-0.5">Cambridge, MA • Class of 2014</p>
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div className="pl-16 space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0"></span>
                      <span className="text-muted-foreground">Research at <span className="text-foreground font-medium">MIT CSAIL</span> - Computer Science & AI Laboratory</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                      <span className="text-muted-foreground">Focus: <span className="text-foreground font-medium">Machine Learning, GPU Computing, Systems</span></span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                      <span className="text-muted-foreground">Published research achieving <span className="text-foreground font-medium">55x GPU speedup</span></span>
                    </div>
                  </div>
                  
                  {/* Skills badges */}
                  <div className="pl-16 flex flex-wrap gap-1.5 pt-1">
                    {["Algorithms", "ML/AI", "Systems", "Python"].map((skill) => (
                      <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-muted/60 text-muted-foreground border border-border/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Research Publications */}
              <Card className="p-6 relative overflow-hidden group">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-lg font-bold mb-5 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Research Publications
                </h3>
                
                <div className="relative z-10 space-y-5">
                  {/* Feature Factory Paper */}
                  <a 
                    href="https://dl.acm.org/doi/abs/10.1145/2724660.2728696" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block space-y-2 p-3 -m-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group/paper"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover/paper:shadow-lg group-hover/paper:scale-105 transition-all duration-200">
                        L@S
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground leading-tight group-hover/paper:text-primary transition-colors">Feature Factory: Crowdsourced Feature Discovery</h4>
                        <p className="text-xs text-primary font-medium mt-0.5">ACM Learning @ Scale 2015</p>
                        <p className="text-xs text-muted-foreground">MIT CSAIL • Jan – May 2014</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pl-13 leading-relaxed">
                      Machine learning research on edX student activity data. Published in Proc. ACM L@S '15, pp. 373–376.
                    </p>
                  </a>
                  
                  {/* GPU Speech Recognition Paper */}
                  <a 
                    href="https://ieeexplore.ieee.org/abstract/document/6289085" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block space-y-2 p-3 -m-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group/paper"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover/paper:shadow-lg group-hover/paper:scale-105 transition-all duration-200">
                        IEEE
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground leading-tight group-hover/paper:text-primary transition-colors">Fast Spoken Query Detection Using GPU DTW</h4>
                        <p className="text-xs text-primary font-medium mt-0.5">IEEE ICASSP 2012 • Kyoto</p>
                        <p className="text-xs text-muted-foreground">MIT CSAIL • June 2011 – Jan 2012</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pl-13 leading-relaxed">
                      Achieved <span className="text-foreground font-medium">55x speedup</span> with novel GPU speech recognition. Published in Proc. ICASSP, pp. 5173–5176.
                    </p>
                  </a>
                </div>
                
                {/* Citation count hint */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Peer-reviewed & published in top-tier venues</span>
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
              <Suspense fallback={<SectionLoader />}>
                <Guestbook />
              </Suspense>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </main>

      <footer className="py-8 px-6 border-t border-border" role="contentinfo">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/kiarashadl/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <LinkedinLogo size={20} weight="fill" />
              </a>
              <a href="https://github.com/kiarashplusplus/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <GithubLogo size={20} weight="fill" />
              </a>
              <span className="text-border">|</span>
              <p>© 2025 Kiarash Adl</p>
            </div>
            <div className="flex items-center gap-3">
              <WeatherIndicator />
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
    </>
  )
}

export default App
