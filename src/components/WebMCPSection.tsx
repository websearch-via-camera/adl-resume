import { useState } from "react"
import { motion } from "framer-motion"
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
  Code2
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export function WebMCPSection() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"discover" | "invoke">("discover")
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(id)
      setTimeout(() => setCopiedItem(null), 2000)
    })
  }
  
  const discoveryUrl = "https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json"
  const invokeUrl = "https://kiarash-adl.pages.dev/mcp/invoke"
  const curlExample = `curl -X POST ${invokeUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"run_terminal_command","input":{"command":"about"}}'`

  const tools = [
    {
      name: "get_project_details",
      description: "Retrieve detailed information about portfolio projects",
      params: ["projectId: fiml | hirealigna | aivision", "includeStack?: boolean"]
    },
    {
      name: "run_terminal_command", 
      description: "Execute terminal commands programmatically",
      params: ["command: about | skills | projects | contact | experience"]
    }
  ]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeIn} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full mb-4">
          <Bot className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium text-violet-400">WebMCP Enabled</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          AI Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Integration</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This portfolio implements the WebMCP standard, allowing AI agents to discover and interact with it programmatically. 
          Query projects, skills, and contact information via API.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-violet-500/5 to-transparent border-violet-500/20 hover:border-violet-500/40 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <Globe className="h-5 w-5 text-violet-400" />
            </div>
            <h3 className="font-semibold">Open Standard</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Built on WebMCP, an open protocol for AI agent discovery and interaction.
          </p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-transparent border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Lock className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="font-semibold">Ed25519 Signed</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Manifest cryptographically signed for trust verification by AI agents.
          </p>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold">Edge Powered</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Runs on Cloudflare's global edge network for ultra-low latency responses.
          </p>
        </Card>
      </motion.div>

      {/* Interactive API Explorer */}
      <motion.div variants={fadeIn}>
        <Card className="overflow-hidden border-zinc-800">
          {/* Tab Header */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/50">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "discover" 
                  ? "text-violet-400 border-b-2 border-violet-400 bg-violet-500/5" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                Discovery Manifest
              </div>
            </button>
            <button
              onClick={() => setActiveTab("invoke")}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "invoke" 
                  ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Terminal className="h-4 w-4" />
                Tool Invocation
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "discover" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">MCP Discovery Endpoint</h3>
                    <p className="text-sm text-muted-foreground">
                      AI agents use this URL to discover available tools and capabilities
                    </p>
                  </div>
                  <a
                    href={discoveryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    View Live <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between bg-zinc-950 rounded-lg p-4 font-mono text-sm">
                    <code className="text-violet-300 break-all">{discoveryUrl}</code>
                    <button
                      onClick={() => copyToClipboard(discoveryUrl, "discovery")}
                      className="ml-3 p-2 hover:bg-zinc-800 rounded-md transition-colors flex-shrink-0"
                    >
                      {copiedItem === "discovery" ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <div className="flex items-center gap-2 text-sm text-emerald-400 mb-2">
                    <Lock className="h-4 w-4" />
                    Signed Manifest Response
                  </div>
                  <pre className="text-xs text-zinc-400 overflow-x-auto">
{`{
  "@context": "https://spec.webmcp.org/v1",
  "name": "Kiarash Adl Portfolio",
  "server": { "endpoint": "${invokeUrl}" },
  "tools": [...],
  "trust": {
    "signature": "WXWJLaGx...",
    "signatureAlgorithm": "ed25519",
    "mode": "production"
  }
}`}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Tool Invocation Endpoint</h3>
                  <p className="text-sm text-muted-foreground">
                    POST requests to call tools and get structured responses
                  </p>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between bg-zinc-950 rounded-lg p-4 font-mono text-sm">
                    <code className="text-cyan-300">POST {invokeUrl}</code>
                    <button
                      onClick={() => copyToClipboard(curlExample, "curl")}
                      className="ml-3 p-2 hover:bg-zinc-800 rounded-md transition-colors flex-shrink-0"
                    >
                      {copiedItem === "curl" ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950/50 rounded-lg p-4 border border-zinc-800">
                  <div className="flex items-center gap-2 text-sm text-cyan-400 mb-2">
                    <Code2 className="h-4 w-4" />
                    Example Request
                  </div>
                  <pre className="text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap">
                    {curlExample}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Available Tools */}
      <motion.div variants={fadeIn}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5 text-violet-400" />
          Available Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Card 
              key={tool.name} 
              className="p-5 bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 mt-0.5">
                  <Terminal className="h-4 w-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-mono text-sm font-semibold text-violet-300 mb-1">
                    {tool.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tool.description}
                  </p>
                  <div className="space-y-1">
                    {tool.params.map((param, i) => (
                      <code key={i} className="block text-xs text-zinc-500 font-mono">
                        → {param}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Architecture Diagram */}
      <motion.div variants={fadeIn}>
        <Card className="p-6 bg-zinc-900/30 border-zinc-800">
          <h3 className="text-lg font-semibold mb-4">Architecture</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
              <Bot className="h-4 w-4 text-violet-400" />
              <span>AI Agent</span>
            </div>
            <div className="text-muted-foreground hidden md:block">→</div>
            <div className="text-muted-foreground md:hidden">↓</div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>/.well-known/mcp.llmfeed.json</span>
            </div>
            <div className="text-muted-foreground hidden md:block">→</div>
            <div className="text-muted-foreground md:hidden">↓</div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Cloudflare Edge</span>
            </div>
            <div className="text-muted-foreground hidden md:block">→</div>
            <div className="text-muted-foreground md:hidden">↓</div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Terminal className="h-4 w-4 text-amber-400" />
              <span>/mcp/invoke</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Try it prompt */}
      <motion.div variants={fadeIn} className="text-center">
        <p className="text-muted-foreground mb-2">
          Try it yourself! Type <code className="px-2 py-1 bg-zinc-800 rounded text-violet-400 font-mono text-sm">mcp connect</code> in the terminal above.
        </p>
      </motion.div>
    </motion.div>
  )
}
