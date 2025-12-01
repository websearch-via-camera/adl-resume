import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Terminal, Sparkles, Copy, Check } from "lucide-react"
import { isMCPMode, enableMCPMode, disableMCPMode, type UseMCPResult } from "@/mcp/useMCP"

interface CommandOutput {
  command: string
  output: string[]
  isError?: boolean
  isMCP?: boolean
  showCopyButton?: boolean
}

const commands: Record<string, string[]> = {
  help: [
    "Available Commands",
    "",
    "  about       Learn about Kiarash",
    "  skills      View technical skills",
    "  projects    List featured projects",
    "  contact     Get contact information",
    "  resume      Download resume (PDF)",
    "  book        Schedule a call",
    "  experience  View work history",
    "  guestbook   Sign the guestbook",
    "  whoami      Identity and profile info",
    "  mcp         Toggle MCP mode for AI agents",
    "  mcp connect How to connect AI assistants",
    "  clear       Clear terminal",
    "  help        Show this help message",
    "",
    "Tip: Try 'mcp connect' to connect AI assistants"
  ],
  about: [
    "KIARASH ADL",
    "Senior Software Engineer",
    "Full-Stack AI Systems Architect",
    "",
    "Education: MIT EECS '14",
    "Experience: 10+ Years",
    "",
    "Building end-to-end AI platforms, agentic systems,",
    "and scalable cloud architectures.",
    "",
    "Focus Areas:",
    "  • AI/ML Systems",
    "  • Computer Vision", 
    "  • Full-Stack Development"
  ],
  skills: [
    "Technical Expertise",
    "",
    "Languages",
    "  Python         ●●●●●●●●●○  95%",
    "  TypeScript     ●●●●●●●●●○  90%",
    "  C++/CUDA       ●●●●●●●○○○  75%",
    "",
    "AI & Machine Learning",
    "  Deep Learning      Expert",
    "  Computer Vision    Expert",
    "  NLP/LLMs           Expert",
    "  MLOps              Advanced"
  ],
  "skills --ai": [
    "AI/ML Deep Dive",
    "",
    "Transformers & LLMs",
    "  • Custom architectures, fine-tuning, RAG",
    "  • Production LLM orchestration",
    "",
    "Computer Vision",
    "  • Object detection, segmentation",
    "  • Patent-pending CV solutions",
    "",
    "GPU Optimization",
    "  • CUDA kernel development",
    "  • 55x speedup achievement (ICASSP 2012)",
    "",
    "Production ML",
    "  • Model serving at scale"
  ],
  projects: [
    "Featured Projects",
    "",
    "1. Financial Intelligence Meta-Layer (FIML)",
    "   AI-native MCP server",
    "   32K+ LOC, 1,403 tests, 100% pass rate",
    "   Tech: Python, MCP, AI Orchestration",
    "",
    "2. HireAligna.ai",
    "   Conversational AI Recruiter",
    "   Voice interviews via LiveKit",
    "   Tech: Next.js, Azure OpenAI, Docker",
    "",
    "Tip: Try 'projects --latest' for current work"
  ],
  "projects --latest": [
    "Current Focus (2024-2025)",
    "",
    "AI Vision (Founder & CEO)",
    "  Patent-pending AI and computer vision",
    "  solutions for home services",
    "  Progress: 80% - App Store Live",
    "",
    "FIML Open Source",
    "  Phase 2 development in progress",
    "  Progress: 60% - Active Development"
  ],
  contact: [
    "Contact Information",
    "",
    "Email: kiarasha@alum.mit.edu",
    "Phone: +1-857-928-1608",
    "",
    "LinkedIn: linkedin.com/in/kiarashadl",
    "GitHub: github.com/kiarashplusplus",
    "",
    "Schedule: calendly.com/kiarasha-alum/30min",
    "",
    "Open to: AI roles, consulting, collaboration",
    "",
    "Tip: Type 'book' to open scheduling page"
  ],
  book: [
    "Schedule a Call",
    "",
    "Book a free 30-minute call with Kiarash:",
    "calendly.com/kiarasha-alum/30min",
    "",
    "Topics we can discuss:",
    "  • AI/ML projects and architecture",
    "  • Technical consulting",
    "  • Collaboration opportunities",
    "  • Your next big idea",
    "",
    "Opening Calendly in new tab..."
  ],
  guestbook: [
    "Guestbook",
    "",
    "Leave a message for future visitors!",
    "",
    "How to sign:",
    "  1. Scroll down to find the guestbook section",
    "  2. Click 'Sign Guestbook'",
    "  3. Pick an emoji, write a message",
    "  4. Your entry will appear after review",
    "",
    "Be the first to sign!"
  ],
  resume: [
    "Resume - Kiarash Adl",
    "",
    "Download PDF:",
    "  https://kiarash-adl.pages.dev/assets/Kiarash-Adl-Resume-20251129-DFXsl4HJ.pdf",
    "",
    "Summary:",
    "  Senior Software Engineer & AI Systems Architect",
    "  MIT EECS '14 | 10+ Years Experience",
    "",
    "Highlights:",
    "  • AI Vision (Founder & CEO) - Patent-pending CV solutions",
    "  • Google - Search Knowledge Panel & Knowledge Graph",
    "  • 500K+ lines of production code shipped",
    "  • Published researcher (ICASSP 2012)",
    "",
    "Opening resume in new tab..."
  ],
  experience: [
    "Work History",
    "",
    "2024-Present",
    "  AI Vision (Founder & CEO)",
    "  AI/CV solutions for home services",
    "",
    "2019-2024",
    "  Technical Consulting",
    "  MVPs, architecture, AI systems",
    "",
    "2018-2019",
    "  Monir (Founder & CEO)",
    "  Personalized shopping AI, VC funded",
    "",
    "2014-2018",
    "  Google (Software Engineer)",
    "  Search Knowledge Panel, Knowledge Graph",
    "",
    "2014",
    "  Twitter Ads (SWE Intern)",
    "  ML for audience expansion"
  ],
  whoami: [
    "Identity",
    "",
    "User: senior-engineer",
    "Group: mit-alum",
    "Roles: ai-ml, full-stack, leadership",
    "",
    "Profile",
    "",
    "EXPERTISE: AI/ML, Full-Stack, Computer Vision",
    "EDUCATION: MIT EECS 2014",
    "PASSION: Building things that matter"
  ],
  neofetch: [
    "        .--.        kiarash@portfolio",
    "       |o_o |       ",
    "       |:_/ |       OS: SeniorEngineer v10.0",
    "      //   \\ \\      Host: MIT EECS '14",
    "     (|     | )     Kernel: AI/ML-optimized",
    "    /'\\_   _/`\\     Shell: TypeScript/Python",
    "    \\___)=(___/     Uptime: 10+ years experience",
    "                    DE: Full-Stack Architecture",
    "                    WM: Agile/Leadership",
    "                    CPU: Problem-solving @ 100%",
    "                    GPU: CUDA-enabled (55x speedup)",
    "                    Memory: 500K+ LOC shipped"
  ]
}

export function TerminalSection() {
  const [history, setHistory] = useState<CommandOutput[]>([
    { command: "", output: ["Welcome to Kiarash's Portfolio Terminal", "Type 'resume' or 'help' for available commands.", ""] }
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [mcpEnabled, setMcpEnabled] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  
  // Example curl command for copy button
  const curlExample = `curl -X POST https://kiarash-adl.pages.dev/mcp/invoke \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"run_terminal_command","input":{"command":"about"}}'`
  
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }
  
  // Check MCP mode on mount
  useEffect(() => {
    setMcpEnabled(isMCPMode())
  }, [])
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])
  
  // MCP tool caller
  const callMCPTool = useCallback(async (name: string, input: unknown): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    if (typeof navigator !== "undefined" && navigator.modelContext) {
      try {
        return await navigator.modelContext.callTool(name, input)
      } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" }
      }
    }
    return { success: false, error: "MCP not available" }
  }, [])
  
  const processCommand = async (input: string) => {
    const trimmedInput = input.trim().toLowerCase()
    
    if (trimmedInput === "clear") {
      setHistory([])
      return
    }
    
    // MCP connection info
    if (trimmedInput === "mcp connect" || trimmedInput === "mcp info") {
      setHistory(prev => [...prev, {
        command: input,
        output: [
          "WEBMCP - AI AGENT API",
          "",
          "This portfolio implements the WebMCP standard, allowing AI agents",
          "to discover and call tools programmatically.",
          "",
          "Discovery (signed manifest):",
          "  https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json",
          "",
          "API Endpoint:",
          "  POST https://kiarash-adl.pages.dev/mcp/invoke",
          "",
          "Available Tools:",
          "  • get_project_details  Get project info (fiml, hirealigna, aivision)",
          "  • run_terminal_command Run: about, skills, projects, contact, experience",
          "",
          "Example:",
          '  curl -X POST https://kiarash-adl.pages.dev/mcp/invoke \\',
          '    -H "Content-Type: application/json" \\',
          '    -d \'{"tool":"run_terminal_command","input":{"command":"about"}}\'',
          ""
        ],
        isMCP: true,
        showCopyButton: true
      }])
      if (trimmedInput) {
        setCommandHistory(prev => [...prev, trimmedInput])
      }
      setHistoryIndex(-1)
      return
    }
    
    // MCP mode toggle
    if (trimmedInput === "mcp" || trimmedInput === "mcp on" || trimmedInput === "mcp off") {
      const shouldEnable = trimmedInput === "mcp on" || (trimmedInput === "mcp" && !mcpEnabled)
      if (shouldEnable) {
        enableMCPMode()
        setMcpEnabled(true)
        setHistory(prev => [...prev, {
          command: input,
          output: [
            "🤖 MCP Mode: ENABLED",
            "",
            "AI agents can now discover and call tools on this site.",
            "Tools available: get_project_details, run_terminal_command",
            "",
            "Commands in MCP mode will also trigger tool calls.",
            "Type 'mcp off' to disable.",
            ""
          ],
          isMCP: true
        }])
      } else {
        disableMCPMode()
        setMcpEnabled(false)
        setHistory(prev => [...prev, {
          command: input,
          output: ["🔒 MCP Mode: DISABLED", ""],
          isMCP: true
        }])
      }
      if (trimmedInput) {
        setCommandHistory(prev => [...prev, trimmedInput])
      }
      setHistoryIndex(-1)
      return
    }
    
    // MCP status check
    if (trimmedInput === "mcp status") {
      const toolCount = navigator.modelContext?.tools?.length ?? 0
      setHistory(prev => [...prev, {
        command: input,
        output: [
          `MCP Status: ${mcpEnabled ? "ENABLED" : "DISABLED"}`,
          `Tools registered: ${toolCount}`,
          `Discovery: /.well-known/mcp.llmfeed.json`,
          ""
        ],
        isMCP: true
      }])
      if (trimmedInput) {
        setCommandHistory(prev => [...prev, trimmedInput])
      }
      setHistoryIndex(-1)
      return
    }
    
    // Special handling for 'book' command - open Calendly
    if (trimmedInput === "book" || trimmedInput === "schedule" || trimmedInput === "calendly") {
      window.open("https://calendly.com/kiarasha-alum/30min", "_blank", "noopener,noreferrer")
    }
    
    // Special handling for 'resume' command - open resume PDF
    if (trimmedInput === "resume" || trimmedInput === "cv") {
      window.open("/assets/Kiarash-Adl-Resume-20251129-DFXsl4HJ.pdf", "_blank", "noopener,noreferrer")
    }
    
    let output: string[]
    let isError = false
    let isMCP = false
    
    // If MCP mode is enabled, try calling MCP tools for supported commands
    const mcpCommands = ["about", "skills", "projects", "contact", "experience", "help"]
    if (mcpEnabled && mcpCommands.includes(trimmedInput)) {
      const result = await callMCPTool("run_terminal_command", { command: trimmedInput })
      if (result.success && result.data) {
        const data = result.data as { output: string }
        // Split the output into lines and add MCP indicator
        output = [
          "✨ [MCP Response]",
          "",
          ...data.output.split("\n"),
          ""
        ]
        isMCP = true
      } else {
        // Fallback to regular command
        output = commands[trimmedInput] || [`zsh: command not found: ${input}`, "Type 'help' for available commands."]
      }
    } else if (trimmedInput === "") {
      output = [""]
    } else if (trimmedInput === "schedule" || trimmedInput === "calendly") {
      // Alias commands for book
      output = commands["book"]
    } else if (commands[trimmedInput]) {
      output = commands[trimmedInput]
    } else {
      output = [`zsh: command not found: ${input}`, "Type 'help' for available commands."]
      isError = true
    }
    
    setHistory(prev => [...prev, { command: input, output, isError, isMCP }])
    
    if (trimmedInput) {
      setCommandHistory(prev => [...prev, trimmedInput])
    }
    setHistoryIndex(-1)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(currentInput)
      setCurrentInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || "")
      } else {
        setHistoryIndex(-1)
        setCurrentInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(currentInput.toLowerCase()))
      if (matches.length === 1) {
        setCurrentInput(matches[0])
      }
    }
  }
  
  return (
    <section aria-labelledby="terminal-section-heading" itemScope itemType="https://schema.org/WebApplication">
      {/* SEO-friendly hidden content for crawlers and AI agents */}
      <div className="sr-only">
        <h2 id="terminal-section-heading">Interactive Portfolio Terminal</h2>
        <meta itemProp="name" content="Kiarash Adl Portfolio Terminal" />
        <meta itemProp="applicationCategory" content="Portfolio" />
        
        <section aria-label="About Kiarash Adl">
          <h3>About</h3>
          <p>Kiarash Adl - Senior Software Engineer and Full-Stack AI Systems Architect. MIT EECS 2014 graduate with 10+ years experience building end-to-end AI platforms, agentic systems, and scalable cloud architectures. Focus areas: AI/ML, Computer Vision, Full-Stack Development.</p>
        </section>
        
        <section aria-label="Technical Skills">
          <h3>Skills</h3>
          <ul role="list">
            <li>Python: 95% proficiency - Primary language for AI/ML and backend</li>
            <li>TypeScript: 90% proficiency - Full-stack web development</li>
            <li>C++/CUDA: 75% proficiency - GPU programming, 55x speedup achievement</li>
            <li>Deep Learning: Expert level</li>
            <li>Computer Vision: Expert level</li>
            <li>NLP/LLMs: Expert level</li>
            <li>MLOps: Advanced level</li>
          </ul>
        </section>
        
        <section aria-label="Featured Projects">
          <h3>Projects</h3>
          <ul role="list">
            <li>Financial Intelligence Meta-Layer (FIML): AI-native MCP server, 32K+ LOC, 1,403 tests, 100% pass rate. Tech: Python, MCP, AI Orchestration.</li>
            <li>HireAligna.ai: Conversational AI Recruiter with voice interviews via LiveKit. Tech: Next.js, Azure OpenAI, Docker.</li>
          </ul>
        </section>
        
        <section aria-label="Contact Information">
          <h3>Contact</h3>
          <ul role="list">
            <li>Email: kiarasha@alum.mit.edu</li>
            <li>Phone: +1-857-928-1608</li>
            <li>LinkedIn: linkedin.com/in/kiarashadl</li>
            <li>GitHub: github.com/kiarashplusplus</li>
            <li>Schedule a call: calendly.com/kiarasha-alum/30min</li>
          </ul>
        </section>
        
        <section aria-label="Work Experience">
          <h3>Experience</h3>
          <ul role="list">
            <li>2024-Present: AI Vision (Founder & CEO) - AI/CV solutions for home services</li>
            <li>2019-2024: Technical Consulting - MVPs, architecture, AI systems</li>
            <li>2018-2019: Monir (Founder & CEO) - Personalized shopping AI, VC funded</li>
            <li>2014-2018: Google (Software Engineer) - Search Knowledge Panel, Knowledge Graph</li>
            <li>2014: Twitter Ads (SWE Intern) - ML for audience expansion</li>
          </ul>
        </section>
      </div>
      
      <Card className="p-0 overflow-hidden" role="application" aria-label="Interactive terminal emulator">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5" role="group" aria-label="Terminal window controls (decorative)">
            <div className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" aria-hidden="true"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true"></div>
          </div>
          <Terminal className="h-4 w-4 text-zinc-400 ml-2" aria-hidden="true" />
          <span className="text-xs text-zinc-400 font-mono">kiarash@portfolio — zsh</span>
        </div>
        <div className="flex items-center gap-2">
          {mcpEnabled && (
            <span className="flex items-center gap-1 text-xs text-violet-400 font-mono" aria-label="MCP mode enabled">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              MCP
            </span>
          )}
          <span className="text-xs text-zinc-500 font-mono" aria-hidden="true">bash</span>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        onClick={(e) => {
          // Don't focus input if user is selecting text or clicking a button
          const selection = window.getSelection()
          if (selection && selection.toString().length > 0) return
          const target = e.target as HTMLElement
          if (target.tagName === 'BUTTON' || target.closest('button')) return
          inputRef.current?.focus()
        }}
        className="bg-zinc-950 p-4 h-[400px] overflow-y-auto font-mono text-sm cursor-text"
        role="log"
        aria-label="Terminal output"
        aria-live="polite"
      >
        <AnimatePresence>
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
            >
              {item.command && (
                <div className="flex items-center gap-2 text-zinc-100">
                  <span className="text-green-400">kiarash@portfolio</span>
                  <span className="text-zinc-500">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-zinc-500">$</span>
                  <span>{item.command}</span>
                  {item.isMCP && <Sparkles className="h-3 w-3 text-violet-400 ml-1" aria-hidden="true" />}
                </div>
              )}
              {item.output.map((line, lineIndex) => (
                <div 
                  key={lineIndex} 
                  className={`whitespace-pre select-text ${item.isError ? "text-red-400" : item.isMCP ? "text-violet-300" : "text-zinc-300"}`}
                >
                  {line || "\u00A0"}
                </div>
              ))}
              {/* Copy button for MCP connect command */}
              {item.showCopyButton && (
                <div className="mt-3 bg-zinc-900 rounded-lg p-3 border border-zinc-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wide">
                      Try it now
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(curlExample, index)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-md transition-colors font-medium"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy Config
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-green-300 text-xs bg-black/50 p-2 rounded overflow-x-auto select-all font-mono">
                    {curlExample}
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Current Input Line */}
        <div className="flex items-center gap-2 text-zinc-100">
          <span className="text-green-400" aria-hidden="true">kiarash@portfolio</span>
          <span className="text-zinc-500" aria-hidden="true">:</span>
          <span className="text-blue-400" aria-hidden="true">~</span>
          <span className="text-zinc-500" aria-hidden="true">$</span>
          <label htmlFor="terminal-input" className="sr-only">Enter terminal command</label>
          <input
            id="terminal-input"
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-zinc-100 caret-zinc-100"
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command input. Type help for available commands."
          />
        </div>
      </div>
      
      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-800 text-xs text-zinc-500 font-mono flex items-center justify-between">
        <div>
          <span>↑↓ History</span>
          <span className="mx-3">|</span>
          <span>Mens et Manus</span>
          <span className="mx-3">|</span>
          <span>Try: neofetch, whoami</span>
        </div>
        <div className="flex items-center gap-2">
          {mcpEnabled ? (
            <span className="text-violet-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Mode
            </span>
          ) : (
            <span className="text-zinc-600 hover:text-zinc-400 cursor-help" title="Type 'mcp' to enable AI agent mode">
              mcp
            </span>
          )}
        </div>
      </div>
    </Card>
    </section>
  )
}
