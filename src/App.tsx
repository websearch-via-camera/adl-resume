import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { EnvelopeSimple, Phone, Download, GithubLogo, LinkedinLogo, ArrowUpRight, PaperPlaneTilt, CaretUp } from "@phosphor-icons/react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import profileImage from "@/assets/images/Kiarash_Adl_Linkedin_Image.jpg"
import resumePdf from "@/assets/documents/Kiarash-Adl-Resume-20251129.pdf"

function App() {
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
  
  const { scrollY } = useScroll()
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsNavVisible(latest > 200)
    setShowScrollTop(latest > 400)
    
    const sections = ["home", "projects", "experience", "contact"]
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
      const mailtoLink = `mailto:kiarasha@alum.mit.edu?subject=${encodeURIComponent(
        formData.subject || `Contact from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`
      
      window.location.href = mailtoLink
      
      toast.success("Opening your email client...")
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      toast.error("There was an error. Please try emailing directly.")
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
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" }
  ]

  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors"
            >
              Kiarash Adl
            </button>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
                Kiarash Adl
              </h1>
              <div className="space-y-2 mb-6">
                <p className="text-xl md:text-2xl font-semibold text-primary">
                  Human + AI Projects
                </p>
                <p className="text-xl md:text-2xl font-semibold text-secondary">
                  Senior Software Engineering
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-muted-foreground mb-6">
                <a href="mailto:kiarasha@alum.mit.edu" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <EnvelopeSimple size={20} weight="fill" />
                  <span>kiarasha@alum.mit.edu</span>
                </a>
                <a href="tel:+18579281608" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <Phone size={20} weight="fill" />
                  <span>+1-857-928-1608</span>
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a 
                  href="https://www.linkedin.com/in/kiarashadl/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                >
                  <LinkedinLogo size={24} weight="fill" />
                  <span className="font-medium">LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/kiarashplusplus/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg"
                >
                  <GithubLogo size={24} weight="fill" />
                  <span className="font-medium">GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <Separator className="max-w-5xl mx-auto" />

      <section id="projects" className="py-16 px-6 md:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Featured Projects
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <motion.div variants={fadeIn}>
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      Financial Intelligence Meta-Layer (FIML)
                    </h3>
                    <GithubLogo size={28} weight="fill" className="text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Built an AI-native MCP server for financial data aggregation with intelligent multi-provider orchestration and multilingual compliance guardrails.
                    </p>
                    <p className="text-foreground leading-relaxed">
                      Architected a <strong className="text-primary">32,000+ LOC</strong> codebase in Python featuring a custom DSL, mobile app (Expo), usage analytics & quota management, and comprehensive CI/CD pipelines with <strong className="text-primary">1,403+ automated tests</strong> at 100% pass rate.
                    </p>
                    <p className="text-muted-foreground">
                      Phase 1 complete with infrastructure tests, agent workflows, and provider integrations. Open-source on GitHub with active Phase 2 development.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="secondary">Python</Badge>
                      <Badge variant="secondary">MCP Server</Badge>
                      <Badge variant="secondary">AI Orchestration</Badge>
                      <Badge variant="secondary">Expo</Badge>
                      <Badge variant="secondary">CI/CD</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-primary/50 group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      HireAligna.ai
                    </h3>
                    <ArrowUpRight size={28} weight="bold" className="text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Developed a conversational AI recruiter platform that schedules and conducts voice interviews via LiveKit, transcribes with Azure OpenAI, and performs automated candidate-job matching.
                    </p>
                    <p className="text-foreground leading-relaxed">
                      Backend stack: Express.js API, Next.js 16 frontend, PostgreSQL, Redis, Python-based LiveKit voice agent; deployed via Docker with Prometheus metrics, Grafana dashboards, and Sentry error tracking.
                    </p>
                    <p className="text-muted-foreground">
                      Implemented bi-directional smart matching with skill-based scoring, AI-generated candidate summaries, and dual user flows for candidates and employers.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="secondary">Next.js 16</Badge>
                      <Badge variant="secondary">LiveKit</Badge>
                      <Badge variant="secondary">Azure OpenAI</Badge>
                      <Badge variant="secondary">PostgreSQL</Badge>
                      <Badge variant="secondary">Docker</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section id="experience" className="py-16 px-6 md:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Experience & Background</h2>
              <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all" asChild>
                <a href={resumePdf} download="Kiarash-Adl-Resume.pdf">
                  <Download size={20} weight="bold" />
                  Download Full Resume (PDF)
                </a>
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-primary">Summary</h3>
                <p className="text-foreground leading-relaxed text-lg">
                  AI innovator and entrepreneur with <strong>10+ years</strong> building scalable computer vision and machine learning solutions, from Google Search features serving billions of queries to patent-pending applications in home services. Proven track record taking products from prototype to production, securing venture funding, and leading high-performing engineering teams. Seeking to drive AI product innovation leveraging deep learning, full-stack development, and strategic technical leadership.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Professional Experience</h3>
              <div className="space-y-6">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xl font-bold">Founder & CEO</h4>
                      <p className="text-primary font-semibold">AI Vision</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>Austin, TX</p>
                      <p>Feb 2024 – Present</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-foreground list-disc list-inside">
                    <li>Built patent-pending AI and computer vision solutions to address real-world challenges in repair estimation and home improvement services</li>
                    <li>Led the development and deployment of production-grade AI features, moving innovations from prototype to market-ready app in the App Store</li>
                    <li>Established company strategy and built a high-performing multidisciplinary team</li>
                    <li>Drove technical infrastructure decisions, ensuring scalable, efficient delivery of advanced AI-driven services</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xl font-bold">Technical Consulting</h4>
                      <p className="text-primary font-semibold">Various Clients</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>USA</p>
                      <p>Mar 2019 – Jan 2024</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-foreground list-disc list-inside">
                    <li>Collaborated on engineering projects, delivered MVPs and prototypes, and established best practices in product development</li>
                    <li>Advised companies on technology roadmaps to support innovation</li>
                    <li>Collaborated with executives to translate product vision into actionable engineering plans and effective delivery</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xl font-bold">Founder & CEO</h4>
                      <p className="text-primary font-semibold">Monir</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>New York, NY</p>
                      <p>Mar 2018 – Mar 2019</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-foreground list-disc list-inside">
                    <li>Developed AI technology for personalized content creation in shopping</li>
                    <li>Architected and delivered a scalable, serverless platform using Python microservices</li>
                    <li>Secured venture capital funding; recruited and led a team of full-time employees and creative contractors</li>
                    <li>Oversaw all aspects of product development, team management, and go-to-market strategy</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xl font-bold">Software Engineer</h4>
                      <p className="text-primary font-semibold">Google</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>New York, NY</p>
                      <p>Dec 2014 – Mar 2018</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-foreground list-disc list-inside">
                    <li>Designed, built prototypes, and deployed to production new features in the Search Knowledge Panel</li>
                    <li>Improved infrastructure for delivering informational messages to users across Google</li>
                    <li>Implemented quality improvements on a system designed to select a representative image for every entity in the Knowledge Graph</li>
                    <li>Collaborated with cross-functional teams to enhance user experience for billions of daily queries</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xl font-bold">Software Engineering Intern</h4>
                      <p className="text-primary font-semibold">Twitter Ads</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>San Francisco, CA</p>
                      <p>June 2014 – Sep 2014</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-foreground list-disc list-inside">
                    <li>Contributed to an experimental machine learning algorithm for Twitter Ads to expand the target audience to non-Twitter users</li>
                    <li>Implemented a scalable multi-label ridge regression model by utilizing matrix factorization and multiplications in Hadoop and Scalding</li>
                  </ul>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xl font-bold">Student Researcher</h4>
                      <p className="text-primary font-semibold">BlockedOnline.com</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>Cambridge, MA</p>
                      <p>Feb 2014 – Oct 2014</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-foreground list-disc list-inside">
                    <li>Student under the supervision of Sir Tim Berners-Lee, founder of the World Wide Web</li>
                    <li>Developed servers and multiple client-side tools to gather and visualize internet censorship data</li>
                    <li>Implemented processes to automate data validation and scrubbing</li>
                  </ul>
                </Card>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Education</h3>
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h4 className="text-xl font-bold">Massachusetts Institute of Technology (MIT)</h4>
                    <p className="text-primary font-semibold">B.S. in Electrical Engineering and Computer Science</p>
                  </div>
                  <div className="text-muted-foreground text-sm sm:text-right">
                    <p>Cambridge, MA</p>
                    <p>Class of 2014</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h3 className="text-2xl font-bold mb-6">Skills</h3>
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-6"
              >
                <motion.div variants={fadeIn}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg mb-3 text-primary">AI & Machine Learning</h4>
                    <p className="text-foreground leading-relaxed">
                      Deep learning (PyTorch, Transformers, CLIP), distributed ML (Ray), classical ML (scikit-learn, XGBoost), GPU acceleration (CUDA/cuDNN/NCCL), data tooling (NumPy, Pandas)
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg mb-3 text-primary">Backend & Distributed Systems</h4>
                    <p className="text-foreground leading-relaxed">
                      Python (FastAPI/Flask, asyncio, AIOHTTP), microservices, event-driven architectures, task orchestration (Celery, Ray), messaging systems (Kafka), caching (Redis), SQL/ORMs (PostgreSQL, SQLAlchemy, Peewee)
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg mb-3 text-primary">DevOps & Infrastructure</h4>
                    <p className="text-foreground leading-relaxed">
                      Docker & multi-service Compose (17+ services), async/high-performance servers (Uvicorn/uvloop), CI/CD, build/test tooling (Black, Ruff, PyTest), cloud platforms (Azure primary; AWS, GCP)
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg mb-3 text-primary">Observability & Performance</h4>
                    <p className="text-foreground leading-relaxed">
                      Prometheus, Grafana, OpenTelemetry, structlog, Sentry, profiling & benchmarking (pytest-benchmark)
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg mb-3 text-primary">Leadership & Product</h4>
                    <p className="text-foreground leading-relaxed">
                      Technical roadmapping, architecture decisions, team building, MVP-to-production execution, startup leadership and fundraising
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div variants={fadeIn}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-lg mb-3 text-primary">Frontend & Mobile</h4>
                    <p className="text-foreground leading-relaxed">
                      React.js, Expo React Native, UI prototyping, API integration, client-side AI workflows
                    </p>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeIn}>
              <h3 className="text-2xl font-bold mb-6">Research</h3>
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-bold">MIT CSAIL Laboratory</h4>
                      <p className="text-muted-foreground text-sm">Machine Learning Research</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>Cambridge, MA</p>
                      <p>Jan 2014 – May 2014</p>
                    </div>
                  </div>
                  <p className="text-foreground mb-2">
                    Contributed to machine learning research based on online students' activity data from edX courses
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Co-authored "Feature factory: Crowdsourced feature discovery," in Proc. ACM Conference on Learning @ Scale – L@S '15, pp. 373–376, ACM, 2015
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-bold">MIT CSAIL Laboratory</h4>
                      <p className="text-muted-foreground text-sm">GPU-Accelerated Speech Recognition</p>
                    </div>
                    <div className="text-muted-foreground text-sm sm:text-right">
                      <p>Cambridge, MA</p>
                      <p>June 2011 – Jan 2012</p>
                    </div>
                  </div>
                  <p className="text-foreground mb-2">
                    Achieved <strong className="text-primary">55x speed-up</strong> by implementing novel speech recognition method to run on GPUs
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Co-authored "Fast Spoken Query Detection Using Lower-Bound Dynamic Time Warping on Graphical Processing Units," in Proc. ICASSP, pp. 5173–5176, Kyoto, Apr. 2012
                  </p>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section id="contact" className="py-16 px-6 md:py-24 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Interested in collaborating or discussing opportunities? Feel free to reach out using the form below or contact me directly.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <motion.div variants={fadeIn}>
                <Card className="p-8 h-full">
                  <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <EnvelopeSimple size={24} weight="fill" className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email</h4>
                        <a 
                          href="mailto:kiarasha@alum.mit.edu" 
                          className="text-accent hover:underline transition-colors"
                        >
                          kiarasha@alum.mit.edu
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                        <Phone size={24} weight="fill" className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Phone</h4>
                        <a 
                          href="tel:+18579281608" 
                          className="text-accent hover:underline transition-colors"
                        >
                          +1-857-928-1608
                        </a>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <p className="text-foreground leading-relaxed">
                        Whether you're looking to discuss AI innovation, explore collaboration opportunities, or talk about your next big project, I'd love to hear from you.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell me about your project or opportunity..."
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                    >
                      <PaperPlaneTilt size={20} weight="fill" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground">
          <p className="mb-4">© 2024 Kiarash Adl. All rights reserved.</p>
          <p className="text-sm">US Citizen | MIT EECS 2014 | AI Innovation & Engineering Leadership</p>
        </div>
      </footer>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-40 disabled:opacity-0"
        disabled={!showScrollTop}
        aria-label="Scroll to top"
      >
        <CaretUp size={24} weight="bold" />
      </motion.button>
    </div>
  )
}

export default App
