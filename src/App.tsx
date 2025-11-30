import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SectionDivider } from "@/components/SectionDivider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Download, Github, Linkedin, ArrowUpRight, Send, ChevronUp, ChevronDown, Link } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect, lazy, Suspense } from "react"
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
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation"
import { useNativeScroll } from "@/hooks/useNativeScroll"

// Lazy load onboarding modal (not needed for initial render)
const OnboardingChoice = lazy(() => import("@/components/OnboardingChoice").then(m => ({ default: m.OnboardingChoice })))

// Decorative components lazy-loaded (not critical for initial render)
const CustomCursor = lazy(() => import("@/components/CustomCursor").then(m => ({ default: m.CustomCursor })))
const KeyboardHelp = lazy(() => import("@/components/KeyboardHelp").then(m => ({ default: m.KeyboardHelp })))
import { A11yProvider, SkipLinks, useA11y } from "@/components/A11yProvider"

// Heavy components lazy loaded for better initial performance
const GitHubActivity = lazy(() => import("@/components/GitHubActivity").then(m => ({ default: m.GitHubActivity })))
const TechStack = lazy(() => import("@/components/TechStack").then(m => ({ default: m.TechStack })))
const EngineeringMetrics = lazy(() => import("@/components/EngineeringMetrics").then(m => ({ default: m.EngineeringMetrics })))
const TerminalSection = lazy(() => import("@/components/TerminalSection").then(m => ({ default: m.TerminalSection })))
const Guestbook = lazy(() => import("@/components/Guestbook").then(m => ({ default: m.Guestbook })))
const InteractiveTimeline = lazy(() => import("@/components/InteractiveTimeline").then(m => ({ default: m.InteractiveTimeline })))

// Recharts components lazy loaded (heavy charting library)
const SkillsCharts = lazy(() => import("@/components/SkillsCharts"))

// Loading fallback component with SEO-friendly content for AI agents
const SectionLoader = ({ height = "h-64", section = "content" }: { height?: string; section?: string }) => (
  <div className={`${height} flex items-center justify-center bg-muted/20 rounded-lg`}>
    <div className="text-center p-6">
      <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto mb-3" />
      <p className="text-muted-foreground text-sm">Loading {section}...</p>
      {/* SEO content for AI agents - hidden visually but accessible */}
      <noscript>
        <p>Kiarash Adl - AI Systems Architect portfolio. Contact: kiarasha@alum.mit.edu</p>
      </noscript>
    </div>
  </div>
)

function App() {
  // Start with null to indicate we haven't checked localStorage yet
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)
  const [visitorType, setVisitorType] = useState<"developer" | "visitor" | null>(null)
  // Track if this is a fresh onboarding choice (not a page reload)
  const [isNewVisitorChoice, setIsNewVisitorChoice] = useState(false)
  const [isNewDeveloperChoice, setIsNewDeveloperChoice] = useState(false)
  
  useEffect(() => {
    // Check if user has already made a choice
    try {
      const savedType = localStorage.getItem("kiarash-visitor-type")
      
      // Validate that the saved type is one of our expected values
      if (savedType === "developer" || savedType === "visitor") {
        setVisitorType(savedType)
        setShowOnboarding(false)
        
        // For visitors, disable browser's automatic scroll restoration
        // This prevents the browser from restoring the previous scroll position
        if (savedType === "visitor" && "scrollRestoration" in history) {
          history.scrollRestoration = "manual"
        }
        
        // Scroll based on visitor type - use the same robust approach as new choices
        if (savedType === "developer") {
          // Returning developer: use the same scroll effect as new developers
          setIsNewDeveloperChoice(true)
        } else {
          // Returning visitor: scroll to top immediately and repeatedly to ensure override
          // Browser scroll restoration can happen at unpredictable times, so we
          // scroll to top multiple times in quick succession
          const scrollToTop = () => window.scrollTo({ top: 0, behavior: "instant" })
          scrollToTop()
          setTimeout(scrollToTop, 0)
          setTimeout(scrollToTop, 50)
          setTimeout(scrollToTop, 100)
          setTimeout(scrollToTop, 200)
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
    
    // For non-developers, disable browser's automatic scroll restoration
    // to ensure we stay at the top
    if (!isDeveloper && "scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
    
    // Mark as fresh choice - scroll handling is done by dedicated useEffects
    if (isDeveloper) {
      setIsNewDeveloperChoice(true)
    } else {
      setIsNewVisitorChoice(true)
    }
  }
  
  // Effect to force scroll to terminal for new developer choices
  // Uses continuous scrolling until the terminal is in view, to handle lazy loading
  useEffect(() => {
    if (!isNewDeveloperChoice || showOnboarding !== false) return
    
    let attempts = 0
    const maxAttempts = 30 // Try for up to 3 seconds
    let intervalId: NodeJS.Timeout
    let timeoutId: NodeJS.Timeout
    
    const scrollToTerminal = () => {
      const terminalElement = document.getElementById("terminal")
      if (!terminalElement) return false
      
      const rect = terminalElement.getBoundingClientRect()
      const targetTop = 80 // We want the terminal 80px from top
      
      // Check if terminal is close enough to target position (within 20px)
      if (Math.abs(rect.top - targetTop) < 20) {
        return true // We're at the right spot
      }
      
      // Scroll to terminal
      const offset = 80
      const elementPosition = rect.top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: "instant" // Use instant to avoid animation conflicts
      })
      
      return false
    }
    
    // Initial delay to let React render
    timeoutId = setTimeout(() => {
      // Keep trying every 100ms until terminal is in correct position
      intervalId = setInterval(() => {
        attempts++
        const success = scrollToTerminal()
        
        if (success || attempts >= maxAttempts) {
          clearInterval(intervalId)
          setIsNewDeveloperChoice(false)
          
          // One final smooth scroll to make it look nice
          if (success) {
            const terminalElement = document.getElementById("terminal")
            if (terminalElement) {
              terminalElement.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          }
        }
      }, 100)
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [isNewDeveloperChoice, showOnboarding])
  
  // Effect to force scroll to top for new visitor choices
  // This runs after React has committed the DOM update
  useEffect(() => {
    if (!isNewVisitorChoice || showOnboarding !== false) return
    
    // Aggressively scroll to top using requestAnimationFrame for proper timing
    const forceScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
    
    // Immediate scroll
    forceScrollToTop()
    
    // Use RAF to scroll after paint
    let rafId = requestAnimationFrame(() => {
      forceScrollToTop()
      rafId = requestAnimationFrame(() => {
        forceScrollToTop()
        // Continue for a bit longer to fight any layout shifts
        rafId = requestAnimationFrame(forceScrollToTop)
      })
    })
    
    // Also use timeouts as backup
    const timeouts = [
      setTimeout(forceScrollToTop, 50),
      setTimeout(forceScrollToTop, 100),
      setTimeout(forceScrollToTop, 200),
      setTimeout(forceScrollToTop, 300),
      setTimeout(forceScrollToTop, 500),
    ]
    
    // Clear the flag after scrolling is done
    const clearFlag = setTimeout(() => {
      setIsNewVisitorChoice(false)
    }, 600)
    
    return () => {
      cancelAnimationFrame(rafId)
      timeouts.forEach(clearTimeout)
      clearTimeout(clearFlag)
    }
  }, [isNewVisitorChoice, showOnboarding])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Navigation sections for scroll tracking
  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "showcase", label: "Showcase" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" }
  ]
  
  // Use native scroll tracking (saves ~120KB by not loading framer-motion for scroll)
  const { 
    isNavVisible, 
    showScrollTop, 
    showScrollIndicator, 
    scrollProgress, 
    activeSection 
  } = useNativeScroll(navItems.map(item => item.id))

  // Accessibility context
  const { announce, prefersReducedMotion } = useA11y()

  // Animation variants with reduced motion support
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
      
      {/* Show nothing while checking localStorage to prevent flash */}
      {showOnboarding === null ? (
        <div className="min-h-screen bg-background" />
      ) : showOnboarding ? (
        /* Onboarding Choice Modal - lazy loaded, nothing else renders until choice is made */
        <Suspense fallback={
          <div className="fixed inset-0 z-[100] bg-background overflow-auto">
            {/* SEO-friendly content for AI agents while JS loads */}
            <article className="max-w-4xl mx-auto px-6 py-8">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Kiarash Adl</h1>
                <p className="text-xl text-primary mb-4">AI Systems Architect | Full Stack Engineer | MIT EECS '14</p>
                <p className="text-muted-foreground">
                  Building end-to-end AI platforms, agentic systems, and scalable cloud architectures.
                  10+ years of experience turning complex AI into production reality.
                </p>
              </header>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Technical Expertise</h2>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li>AI/ML: LLM Orchestration, Computer Vision, NLP, RAG Systems, Agentic Workflows</li>
                  <li>Backend: Python, Node.js, FastAPI, PostgreSQL, Redis, Kafka</li>
                  <li>Frontend: React, TypeScript, Next.js, Tailwind CSS</li>
                  <li>Cloud: AWS, Azure, GCP, Kubernetes, Docker, Terraform</li>
                </ul>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Featured Projects</h2>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <h3 className="font-medium text-foreground">Financial Intelligence Meta-Layer (FIML)</h3>
                    <p>AI-native MCP server for financial data aggregation. 32K+ lines, 1,403 tests, 100% pass rate.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">HireAligna.ai</h3>
                    <p>Conversational AI recruiter with voice interviews and automated matching. 17+ Docker services.</p>
                  </div>
                </div>
              </section>
              
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Contact</h2>
                <ul className="text-muted-foreground space-y-1">
                  <li>Email: <a href="mailto:kiarasha@alum.mit.edu" className="text-primary">kiarasha@alum.mit.edu</a></li>
                  <li>Phone: <a href="tel:+18579281608" className="text-primary">+1-857-928-1608</a></li>
                  <li>LinkedIn: <a href="https://www.linkedin.com/in/kiarashadl/" className="text-primary">linkedin.com/in/kiarashadl</a></li>
                  <li>GitHub: <a href="https://github.com/kiarashplusplus/" className="text-primary">github.com/kiarashplusplus</a></li>
                </ul>
              </section>
              
              <footer className="border-t border-border pt-6 text-center">
                <p className="text-muted-foreground text-sm mb-4">© 2025 Kiarash Adl | MIT EECS '14 | <a href="#contact" className="text-primary hover:underline">Available for work</a></p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
                  <span className="text-muted-foreground text-sm">Loading interactive experience...</span>
                </div>
              </footer>
            </article>
          </div>
        }>
          <OnboardingChoice onChoice={handleOnboardingChoice} />
        </Suspense>
      ) : (
        /* Main content - only renders after onboarding is complete */
        <div className="min-h-screen bg-background cursor-none">
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
      {/* Scroll Progress Bar - CSS-based for performance */}
      <div
        className={`fixed top-0 left-0 right-0 h-1 bg-muted z-50 transition-opacity duration-200 ${
          scrollProgress > 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation - Beautiful glassmorphism with gradient border */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isNavVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        } ${prefersReducedMotion ? '!transition-none' : ''}`}
        aria-label="Main navigation"
      >
        {/* Gradient border bottom */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        {/* Glassmorphism background - reduced blur for scroll performance */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        
        <div className="max-w-5xl mx-auto px-6 py-4 relative z-10">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground hover:from-primary hover:to-accent transition-all duration-300 flex-shrink-0"
              aria-label="Go to home section"
            >
              Kiarash Adl
            </button>
            
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-shrink min-w-0" role="navigation">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                  aria-current={activeSection === item.id ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
              <div className="ml-2 border-l border-border/50 pl-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" role="main" aria-label="Portfolio content" tabIndex={-1}>
      {/* Hero Section - Beautiful glassmorphism with floating elements */}
      <header 
        id="home"
        className="relative py-16 px-6 md:py-24 overflow-hidden hero-pattern"
      >
        {/* Decorative gradient elements - static for performance (no animation on blurred elements) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-accent/5 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-[20%] w-64 h-64 bg-primary/3 rounded-full blur-2xl" />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* LCP element - Enhanced with glow effect */}
            <div className="flex-shrink-0 relative group">
              {/* Outer glow ring - reduced blur for performance */}
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Rotating gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: 'conic-gradient(from 0deg, var(--primary), var(--accent), var(--primary))' }} />
              
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden ring-2 ring-background shadow-2xl">
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
                    alt="Kiarash Adl, AI Systems Architect - professional headshot"
                    className="w-full h-full object-cover"
                    width={224}
                    height={224}
                    fetchPriority="high"
                    decoding="async"
                    loading="eager"
                  />
                </picture>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {/* Live Status - Enhanced pulsing button with sub-line */}
              <div className="flex flex-col items-center md:items-start gap-1 mb-4">
                <a href="#contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-lg shadow-green-500/10 animate-pulse-slow">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Available for Work
                  </span>
                </a>
                <span className="text-xs text-muted-foreground mt-1">Let's build your AI dream team — starting today</span>
              </div>
              
              {/* Name with gradient effect */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground hover:from-primary hover:via-foreground hover:to-accent transition-all duration-700">
                  Kiarash Adl
                </span>
              </h1>
              <TypewriterTagline />
              
              {/* Quick Stats with glassmorphism */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium glass">
                  <span className="mr-1.5">🎓</span> MIT EECS '14
                </Badge>
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium glass">
                  <span className="mr-1.5">⚡</span> 10+ Years Experience
                </Badge>
                <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium border-primary/30 text-primary bg-primary/5">
                  <span className="mr-1.5">🤖</span> Human + AI Projects
                </Badge>
              </div>
              
              {/* What I Deliver - Outcome-focused for non-coders with icons */}
              <p className="text-lg md:text-xl text-foreground/90 mb-5 max-w-xl leading-relaxed">
                I build <span className="font-semibold text-primary">AI tools that automate workflows</span>, chat like humans, and scale effortlessly. <span className="font-medium italic text-primary/90">No coding required from you.</span>
              </p>
              
              {/* What I Deliver - Beautiful icon cards for non-coders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-xl">
                <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      💬
                    </div>
                    <div className="font-bold text-foreground mb-1">AI Chatbots</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">Make your app talk back intelligently</div>
                  </div>
                </div>
                
                <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      🚀
                    </div>
                    <div className="font-bold text-foreground mb-1">End-to-End</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">From idea to launch, millions of users</div>
                  </div>
                </div>
                
                <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      ☁️
                    </div>
                    <div className="font-bold text-foreground mb-1">Cloud Magic</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">Secure, fast, scales with you</div>
                  </div>
                </div>
              </div>
              
              {/* Fun Fact - Personal touch */}
              <div className="mb-6 p-3 rounded-xl bg-muted/50 border border-border/50 max-w-xl">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">✨ Fun fact:</span> I built my first startup at 14.
                </p>
              </div>
              
              {/* Contact & Socials - Personalized CTAs with glow effects */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a 
                  href="mailto:kiarasha@alum.mit.edu?subject=Let's%20Chat%20About%20AI" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 text-sm font-semibold group"
                >
                  <Mail className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
                  <span>Book a Free AI Chat</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
                <a 
                  href="#projects" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted rounded-xl transition-all duration-300 text-sm font-medium group hover:shadow-lg hover:-translate-y-0.5 border border-border/50"
                >
                  <span>🎯</span>
                  <span>See My Work</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/kiarashadl/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 hover:bg-muted rounded-xl transition-all duration-300 text-sm font-medium group hover:shadow-lg hover:-translate-y-0.5 border border-border/50"
                >
                  <Linkedin className="h-[18px] w-[18px] text-primary group-hover:scale-110 transition-transform" />
                  <span>Connect</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll indicator - integrated into hero section */}
        <div
          className={`flex flex-col items-center mt-12 md:mt-16 transition-opacity duration-500 ${
            showScrollIndicator ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Explore
          </span>
          <button
            onClick={() => scrollToSection('projects')}
            className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-2"
            aria-label="Scroll down to explore content"
          >
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-2 group-hover:border-primary/60 transition-colors">
              <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-scroll-dot group-hover:bg-primary transition-colors" />
            </div>
            <ChevronDown 
              className="h-5 w-5 text-muted-foreground/60 animate-scroll-arrow group-hover:text-primary transition-colors" 
            />
          </button>
        </div>
      </header>

      <SectionDivider variant="sparkle" />

      <section className="py-12 px-6 md:py-16 relative">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center"
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-foreground/80 italic leading-relaxed">
              <span className="text-primary">"</span>
              Simple ideas are hard-earned, but that's where true power lives.
              <span className="text-primary">"</span>
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="constellation" />

      <section id="projects" className="py-16 px-6 md:py-20 scroll-mt-20 relative" tabIndex={-1}>
        {/* Background mesh pattern */}
        <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Portfolio</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Featured Projects
              </h2>
            </motion.div>
            
            <div className="space-y-6">
              <motion.div variants={fadeIn}>
                <div className="group relative">
                  {/* Gradient glow on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                  
                  <Card className="relative p-6 md:p-8 hover:shadow-xl transition-all duration-500 hover:border-primary/40 bg-card/80 backdrop-blur-sm overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                            Financial Intelligence Meta-Layer (FIML)
                          </h3>
                          <Badge variant="outline" className="border-green-500/50 text-green-600 bg-green-500/10 text-xs">Open Source</Badge>
                        </div>
                        <p className="text-foreground/80 mb-4 leading-relaxed">
                          AI-native MCP server for financial data aggregation with intelligent multi-provider orchestration and multilingual compliance guardrails.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-primary/30 transition-colors">
                            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">32K+</div>
                            <div className="text-xs text-muted-foreground">Lines of Code</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-primary/30 transition-colors">
                            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">1,403</div>
                            <div className="text-xs text-muted-foreground">Automated Tests</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-primary/30 transition-colors">
                            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">100%</div>
                            <div className="text-xs text-muted-foreground">Pass Rate</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-primary/30 transition-colors">
                            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Phase 2</div>
                            <div className="text-xs text-muted-foreground">In Progress</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <Badge variant="secondary" className="text-xs bg-secondary/50">Python</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">MCP Server</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">AI Orchestration</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">Expo</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">CI/CD</Badge>
                        </div>
                        {/* Client Story Snippet */}
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20 text-xs">
                          <span className="text-green-500">✓</span>
                          <span className="text-muted-foreground"><span className="font-medium text-foreground">Impact:</span> Reduces financial data integration time by 70%</span>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2">
                        <a href="https://kiarashplusplus.github.io/FIML/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 min-h-[44px] min-w-[44px] p-3 rounded-xl bg-muted/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group/btn hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5" aria-label="View FIML project website">
                          <Link className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        </a>
                        <a href="https://github.com/kiarashplusplus/FIML" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 min-h-[44px] min-w-[44px] p-3 rounded-xl bg-muted/80 hover:bg-foreground hover:text-background transition-all duration-300 flex items-center justify-center group/btn hover:shadow-lg hover:-translate-y-0.5" aria-label="View FIML project on GitHub">
                          <Github className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <div className="group relative">
                  {/* Gradient glow on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500" />
                  
                  <Card className="relative p-6 md:p-8 hover:shadow-xl transition-all duration-500 hover:border-blue-500/40 bg-card/80 backdrop-blur-sm overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl md:text-2xl font-bold group-hover:text-blue-500 transition-colors">
                            HireAligna.ai
                          </h3>
                          <Badge variant="outline" className="border-blue-500/50 text-blue-600 bg-blue-500/10 text-xs">SaaS Platform</Badge>
                        </div>
                        <p className="text-foreground/80 mb-4 leading-relaxed">
                          Conversational AI recruiter that schedules and conducts voice interviews via LiveKit, transcribes with Azure OpenAI, and performs automated candidate-job matching.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-blue-500/30 transition-colors">
                            <div className="text-xl font-bold text-blue-500">AI</div>
                            <div className="text-xs text-muted-foreground">Voice Interviews</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-blue-500/30 transition-colors">
                            <div className="text-xl font-bold text-blue-500">17+</div>
                            <div className="text-xs text-muted-foreground">Docker Services</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-blue-500/30 transition-colors">
                            <div className="text-xl font-bold text-blue-500">2-Way</div>
                            <div className="text-xs text-muted-foreground">Smart Matching</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/80 to-muted/40 rounded-xl border border-border/50 group-hover:border-blue-500/30 transition-colors">
                            <div className="text-xl font-bold text-blue-500">Full</div>
                            <div className="text-xs text-muted-foreground">Observability</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <Badge variant="secondary" className="text-xs bg-secondary/50">Next.js</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">LiveKit</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">Azure OpenAI</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">PostgreSQL</Badge>
                          <Badge variant="secondary" className="text-xs bg-secondary/50">Docker</Badge>
                        </div>
                        {/* Client Story Snippet */}
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs">
                          <span className="text-blue-500">✓</span>
                          <span className="text-muted-foreground"><span className="font-medium text-foreground">Impact:</span> Helps startups cut hiring time by 40% with AI interviews</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="sparkle" />

      <section id="skills" className="py-16 px-6 md:py-20 scroll-mt-20 relative" tabIndex={-1}>
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Expertise</span>
              </div>
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

      <SectionDivider variant="ornate" />

      {/* Enhanced Technical Showcase Section */}
      <section id="showcase" className="py-16 px-6 md:py-20 scroll-mt-20 relative">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Developer</span>
              </div>
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
            <motion.div variants={fadeIn} id="terminal" className="scroll-mt-20">
              <div className="mb-4 text-center">
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

      <SectionDivider variant="gradient" />

      <section id="experience" className="py-16 px-6 md:py-20 scroll-mt-20 relative">
        {/* Subtle diagonal pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'linear-gradient(135deg, transparent 0%, transparent 49%, oklch(from var(--primary) l c h / 0.03) 49%, oklch(from var(--primary) l c h / 0.03) 51%, transparent 51%, transparent 100%)', backgroundSize: '20px 20px' }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Career</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Experience</h2>
                <p className="text-muted-foreground">10+ years building AI systems at scale</p>
              </div>
              <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300" asChild>
                <a href={resumePdf} download="Kiarash-Adl-Resume.pdf">
                  <Download className="h-[18px] w-[18px]" />
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

      <SectionDivider variant="constellation" />

      <section id="contact" className="py-16 px-6 md:py-20 scroll-mt-20 relative" tabIndex={-1}>
        {/* Beautiful gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Contact</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Let's discuss AI innovation, collaboration, or your next project.</h2>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-6 md:gap-8">
              <motion.div variants={fadeIn} className="md:col-span-2 space-y-4">
                <a 
                  href="mailto:kiarasha@alum.mit.edu" 
                  className="flex items-center gap-4 p-5 bg-gradient-to-br from-muted/60 to-muted/30 hover:from-primary/10 hover:to-accent/5 rounded-2xl transition-all duration-300 group border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl group-hover:from-primary/30 group-hover:to-accent/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email</div>
                    <div className="font-semibold group-hover:text-primary transition-colors">kiarasha@alum.mit.edu</div>
                  </div>
                </a>

                <a 
                  href="tel:+18579281608" 
                  className="flex items-center gap-4 p-5 bg-gradient-to-br from-muted/60 to-muted/30 hover:from-primary/10 hover:to-accent/5 rounded-2xl transition-all duration-300 group border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl group-hover:from-primary/30 group-hover:to-accent/20 transition-colors">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Phone</div>
                    <div className="font-semibold group-hover:text-primary transition-colors">+1-857-928-1608</div>
                  </div>
                </a>

                <div className="flex gap-3 pt-2">
                  <a 
                    href="https://www.linkedin.com/in/kiarashadl/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 font-medium group"
                  >
                    <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/kiarashplusplus/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-4 bg-foreground text-background rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-medium group"
                  >
                    <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    GitHub
                  </a>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="md:col-span-3">
                <div className="relative group">
                  {/* Gradient glow effect - reduced blur for performance */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500" />
                  
                  <Card className="relative p-8 bg-card/90 backdrop-blur-sm border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl">
                        <Send className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Send a Message</h3>
                        <p className="text-xs text-muted-foreground">I'll get back to you within 24 hours</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Name <span className="text-primary">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-primary">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">Message <span className="text-primary">*</span></Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="resize-none rounded-xl border-border/50 focus:border-primary focus:ring-primary/20 focus:ring-[3px] transition-all duration-300 bg-background/50 hover:border-primary/30"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 h-12 text-base"
                    >
                      <Send className="h-[18px] w-[18px]" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="dots" />

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

      <footer className="relative py-12 px-6 border-t border-border/50 overflow-hidden" role="contentinfo">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col items-center gap-6">
            {/* Logo/Name */}
            <div className="text-center">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                Kiarash Adl
              </h3>
              <p className="text-sm text-muted-foreground">AI Systems Architect • MIT EECS '14</p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/kiarashadl/" target="_blank" rel="noopener noreferrer" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 group" aria-label="Visit Kiarash's LinkedIn profile">
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://github.com/kiarashplusplus/" target="_blank" rel="noopener noreferrer" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/50 hover:bg-foreground hover:text-background transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group" aria-label="Visit Kiarash's GitHub profile">
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="mailto:kiarasha@alum.mit.edu" className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 group" aria-label="Email Kiarash">
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
            
            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            
            {/* Bottom info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
              <p>© 2025 Kiarash Adl</p>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border">?</kbd> for shortcuts
              </span>
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 min-h-[48px] min-w-[48px] p-3 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-110 transition-all duration-300 z-40 animate-in fade-in zoom-in group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Keyboard Navigation */}
      <Suspense fallback={null}>
        <KeyboardHelp show={showHelp} onClose={() => setShowHelp(false)} />
      </Suspense>
    </div>
      )}
    </>
  )
}

export default App
