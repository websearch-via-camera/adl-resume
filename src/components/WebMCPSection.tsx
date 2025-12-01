import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { 
  Bot, 
  Shield, 
  Zap, 
  Copy, 
  Check, 
  ExternalLink,
  Terminal,
  Globe,
  Lock,
  Code2,
  Sparkles,
  Play,
  ChevronRight,
  Radio
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
} as const

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
} as const

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
}

export function WebMCPSection() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [liveStatus, setLiveStatus] = useState<"idle" | "loading" | "success">("idle")
  const [demoResponse, setDemoResponse] = useState<string | null>(null)
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(id)
      setTimeout(() => setCopiedItem(null), 2000)
    })
  }
  
  const discoveryUrl = "https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json"
  const invokeUrl = "https://kiarash-adl.pages.dev/mcp/invoke"
  
  const runLiveDemo = async () => {
    setLiveStatus("loading")
    setDemoResponse(null)
    try {
      const response = await fetch(invokeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "run_terminal_command", input: { command: "about" } })
      })
      const data = await response.json()
      setDemoResponse(JSON.stringify(data, null, 2))
      setLiveStatus("success")
    } catch {
      setLiveStatus("idle")
    }
  }

  // Animated particles effect
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2
  }))

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="relative"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.id * 0.1
            }}
          />
        ))}
      </div>

      {/* Hero Header */}
      <motion.div variants={fadeIn} className="text-center mb-16 relative">
        <motion.div 
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-cyan-500/20 rounded-full mb-6 border border-violet-500/30"
          animate={pulseAnimation}
        >
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Live • AI Agent API
          </span>
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-foreground">WebMCP</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
            Integration
          </span>
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
          This portfolio speaks fluent AI. Query projects, skills, and experience 
          through a <span className="text-violet-400">cryptographically signed</span> API 
          that any AI agent can discover and use.
        </p>

        {/* Try with Claude - Moved here */}
        <div className="max-w-2xl mx-auto text-sm text-muted-foreground bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <p className="mb-2 font-medium text-zinc-200">Try it with Claude (or any AI assistant)</p>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(
                "Connect to this MCP server: https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json and then run the commands: about, skills, projects, experience, and contact?",
                "assistant-prompt-hero"
              )
            }
            className="w-full text-left font-mono text-xs bg-black/60 border border-zinc-800 rounded-lg px-3 py-2 hover:border-violet-500/40 hover:bg-zinc-900/80 transition-all group relative overflow-hidden"
          >
            <span className="inline-flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center rounded border border-zinc-700 bg-zinc-900/80 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-300 group-hover:border-violet-500/50 group-hover:text-violet-300 transition-colors">
                {copiedItem === "assistant-prompt-hero" ? (
                  <><Check className="h-3 w-3 mr-1 text-emerald-400" />Copied!</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" />Copy prompt</>
                )}
              </span>
              {copiedItem === "assistant-prompt-hero" && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-emerald-400 text-[10px]"
                >
                  Ready to paste!
                </motion.span>
              )}
            </span>
            <span className="text-zinc-400 block">
              In Claude Desktop, can you connect to this MCP server: https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json and
              then run the commands: about, skills, projects, experience, and contact?
            </span>
          </button>
        </div>
      </motion.div>

      {/* Main Interactive Card */}
      <motion.div variants={scaleIn} className="mb-12">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-violet-500/5">
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-violet-500/50 via-transparent to-cyan-500/50 pointer-events-none">
            <div className="absolute inset-[1px] rounded-xl bg-zinc-900" />
          </div>
          
          <div className="relative p-8">
            {/* Live Demo Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Endpoints */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                    <Globe className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-100">Discovery Endpoint</h3>
                    <p className="text-sm text-zinc-400">Where AI agents find your tools</p>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3 bg-black/40 rounded-xl p-4 border border-zinc-800 group-hover:border-violet-500/30 transition-colors">
                    <code className="flex-1 text-sm font-mono text-violet-300 break-all">
                      /.well-known/mcp.llmfeed.json
                    </code>
                    <div className="flex gap-2">
                      <a
                        href={discoveryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-zinc-400 hover:text-violet-400" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(discoveryUrl, "discovery")}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        {copiedItem === "discovery" ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-zinc-400 hover:text-violet-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 mt-8">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    <Terminal className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-100">Invoke Endpoint</h3>
                    <p className="text-sm text-zinc-400">Call tools programmatically</p>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-3 bg-black/40 rounded-xl p-4 border border-zinc-800 group-hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded">POST</span>
                      <code className="text-sm font-mono text-cyan-300">/mcp/invoke</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(invokeUrl, "invoke")}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      {copiedItem === "invoke" ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-400 hover:text-cyan-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Live Demo */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                      <Play className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-zinc-100">Live Demo</h3>
                      <p className="text-sm text-zinc-400">Try the API right now</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={runLiveDemo}
                    disabled={liveStatus === "loading"}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-medium rounded-lg transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {liveStatus === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Run Demo
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="bg-black/60 rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono ml-2">response.json</span>
                  </div>
                  <div className="p-4 h-48 overflow-auto">
                    <AnimatePresence mode="wait">
                      {demoResponse ? (
                        <motion.pre
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-emerald-300 font-mono whitespace-pre-wrap"
                        >
                          {demoResponse}
                        </motion.pre>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center text-zinc-600"
                        >
                          <Bot className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">Click "Run Demo" to see the API in action</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Feature Pills */}
      <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-3 mb-12">
        {[
          { icon: Shield, label: "Ed25519 Signed", colorClass: "violet" },
          { icon: Zap, label: "Edge Deployed", colorClass: "cyan" },
          { icon: Lock, label: "CORS Enabled", colorClass: "emerald" },
          { icon: Globe, label: "Open Standard", colorClass: "amber" },
        ].map((feature) => (
          <motion.div
            key={feature.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              feature.colorClass === "violet" ? "bg-violet-500/10 border-violet-500/20" :
              feature.colorClass === "cyan" ? "bg-cyan-500/10 border-cyan-500/20" :
              feature.colorClass === "emerald" ? "bg-emerald-500/10 border-emerald-500/20" :
              "bg-amber-500/10 border-amber-500/20"
            } border`}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <feature.icon className={`h-4 w-4 ${
              feature.colorClass === "violet" ? "text-violet-400" :
              feature.colorClass === "cyan" ? "text-cyan-400" :
              feature.colorClass === "emerald" ? "text-emerald-400" :
              "text-amber-400"
            }`} />
            <span className="text-sm font-medium text-zinc-300">{feature.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Tools Grid */}
      <motion.div variants={fadeIn} className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h3 className="text-xl font-semibold">Available Tools</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "get_project_details",
              description: "Retrieve detailed project information including stack, metrics, and impact",
              example: '{ "projectId": "fiml" }',
              colorClass: "violet"
            },
            {
              name: "run_terminal_command",
              description: "Execute terminal commands: about, skills, projects, contact, experience",
              example: '{ "command": "about" }',
              colorClass: "cyan"
            }
          ].map((tool) => (
            <motion.div
              key={tool.name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className={`p-6 h-full border-zinc-800 transition-all ${
                tool.colorClass === "violet" 
                  ? "bg-gradient-to-br from-violet-500/5 via-transparent to-transparent hover:border-violet-500/30" 
                  : "bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent hover:border-cyan-500/30"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${
                    tool.colorClass === "violet" 
                      ? "bg-violet-500/10 border-violet-500/20" 
                      : "bg-cyan-500/10 border-cyan-500/20"
                  }`}>
                    <Code2 className={`h-5 w-5 ${
                      tool.colorClass === "violet" ? "text-violet-400" : "text-cyan-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-mono text-base font-semibold mb-2 ${
                      tool.colorClass === "violet" ? "text-violet-300" : "text-cyan-300"
                    }`}>
                      {tool.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <ChevronRight className="h-3 w-3" />
                      <code className="font-mono">{tool.example}</code>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Architecture Flow */}
      <motion.div variants={fadeIn}>
        <Card className="p-8 bg-zinc-900/30 border-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent" />
          
          <h3 className="text-lg font-semibold mb-8 text-center relative">How It Works</h3>
          
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-violet-500/50 via-cyan-500/50 to-emerald-500/50" />
            
            {[
              { icon: Bot, label: "AI Agent", sublabel: "Claude, GPT, etc.", colorClass: "violet" },
              { icon: Globe, label: "Discovery", sublabel: "Find capabilities", colorClass: "cyan" },
              { icon: Zap, label: "Edge Function", sublabel: "Global CDN", colorClass: "emerald" },
              { icon: Terminal, label: "Tool Call", sublabel: "Get response", colorClass: "amber" },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div 
                  className={`p-4 rounded-2xl border mb-3 ${
                    step.colorClass === "violet" ? "bg-gradient-to-br from-violet-500/20 to-violet-500/5 border-violet-500/30" :
                    step.colorClass === "cyan" ? "bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border-cyan-500/30" :
                    step.colorClass === "emerald" ? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30" :
                    "bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/30"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <step.icon className={`h-6 w-6 ${
                    step.colorClass === "violet" ? "text-violet-400" :
                    step.colorClass === "cyan" ? "text-cyan-400" :
                    step.colorClass === "emerald" ? "text-emerald-400" :
                    "text-amber-400"
                  }`} />
                </motion.div>
                <span className="font-medium text-sm">{step.label}</span>
                <span className="text-xs text-muted-foreground">{step.sublabel}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div variants={fadeIn} className="text-center mt-12">
        <p className="text-muted-foreground">
          Try it in the terminal above →{" "}
          <code className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-400 font-mono text-sm">
            mcp connect
          </code>
        </p>
      </motion.div>
    </motion.div>
  )
}
