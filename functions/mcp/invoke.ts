/**
 * MCP Tool Invocation Endpoint
 * 
 * This Cloudflare Pages Function handles incoming MCP tool calls from AI agents.
 * POST /mcp/invoke with JSON body: { "tool": "tool_name", "input": { ... } }
 */

interface Env {}

// Project data (synced from src/data/projects.ts for serverless context)
const projects: Record<string, {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  status: string;
  links: { website?: string; github?: string; demo?: string };
  impact: string;
  category: string;
}> = {
  fiml: {
    id: "fiml",
    title: "Financial Intelligence Meta-Layer (FIML)",
    description: "AI-native MCP server for financial data aggregation with intelligent multi-provider orchestration and multilingual compliance guardrails. Open source project demonstrating enterprise-grade AI architecture.",
    shortDescription: "AI-native MCP server for financial data aggregation",
    stack: ["Python", "MCP Server", "AI Orchestration", "Expo", "CI/CD"],
    metrics: [
      { label: "Lines of Code", value: "32K+" },
      { label: "Automated Tests", value: "1,403" },
      { label: "Pass Rate", value: "100%" },
      { label: "Status", value: "Phase 2" }
    ],
    status: "development",
    links: {
      website: "https://kiarashplusplus.github.io/FIML/",
      github: "https://github.com/kiarashplusplus/FIML"
    },
    impact: "Reduces financial data integration time by 70%",
    category: "open-source"
  },
  hirealigna: {
    id: "hirealigna",
    title: "HireAligna.ai",
    description: "Conversational AI recruiter that schedules and conducts voice interviews via LiveKit, transcribes with Azure OpenAI, and performs automated candidate-job matching with full observability.",
    shortDescription: "Conversational AI recruiter with voice interviews",
    stack: ["Next.js", "LiveKit", "Azure OpenAI", "PostgreSQL", "Docker"],
    metrics: [
      { label: "Feature", value: "AI Voice Interviews" },
      { label: "Docker Services", value: "17+" },
      { label: "Matching", value: "2-Way Smart" },
      { label: "Observability", value: "Full" }
    ],
    status: "live",
    links: {},
    impact: "Helps startups cut hiring time by 40% with AI interviews",
    category: "saas"
  },
  aivision: {
    id: "aivision",
    title: "AI Vision",
    description: "Patent-pending AI and computer vision solutions for home services industry. Founder and CEO. Mobile app live on App Store.",
    shortDescription: "AI/CV solutions for home services",
    stack: ["Computer Vision", "iOS", "Machine Learning", "Mobile"],
    metrics: [
      { label: "Status", value: "App Store Live" },
      { label: "Progress", value: "80%" }
    ],
    status: "live",
    links: {},
    impact: "Patent-pending CV technology for home services",
    category: "startup"
  }
};

// Terminal command outputs
const terminalCommands: Record<string, string> = {
  about: `
┌─────────────────────────────────────────────────────────────┐
│                    KIARASH ADL                               │
│           AI Systems Architect & Full-Stack Engineer         │
├─────────────────────────────────────────────────────────────┤
│  MIT Alumnus | 10+ Years Experience | Human + AI Projects   │
│                                                              │
│  Specializing in:                                            │
│  • Large Language Models & AI Systems                        │
│  • Distributed Systems Architecture                          │
│  • Full-Stack Development (React, Node, Python)              │
│  • Cloud Infrastructure (AWS, GCP, Cloudflare)               │
└─────────────────────────────────────────────────────────────┘`,
  
  skills: `
TECHNICAL SKILLS
================

Languages:     Python ████████████ 95%
               TypeScript ██████████ 90%
               Go ████████ 80%
               Rust ██████ 70%

AI/ML:         PyTorch ████████████ 95%
               TensorFlow ██████████ 85%
               LangChain ████████ 80%

Frontend:      React ████████████ 95%
               Next.js ██████████ 90%

Backend:       Node.js ██████████ 90%
               FastAPI ████████████ 95%

Cloud:         AWS ██████████ 90%
               GCP ████████ 85%
               Cloudflare ████████ 80%`,

  projects: `
FEATURED PROJECTS
=================

1. FIML - Financial Intelligence Meta-Layer
   Status: Development | Stack: Python, MCP Server, AI Orchestration
   → AI-native MCP server for financial data aggregation
   → 32K+ LOC | 1,403 tests | 100% pass rate

2. HireAligna.ai  
   Status: Live | Stack: Next.js, LiveKit, Azure OpenAI
   → Conversational AI recruiter with voice interviews
   → Helps startups cut hiring time by 40%

3. AI Vision
   Status: Live | Stack: Computer Vision, iOS, ML
   → Patent-pending AI/CV solutions for home services
   → Mobile app live on App Store

Use 'get_project_details' tool for more information.`,

  contact: `
CONTACT INFORMATION
===================

Email:    kiarasha@alum.mit.edu
GitHub:   github.com/kiarashplusplus
LinkedIn: linkedin.com/in/kiarashadl
Phone:    +1-857-928-1608

Open to: Consulting, Advisory, Full-time opportunities`,

  experience: `
EXPERIENCE
==========

2020-Present  AI Systems Architect
              → Leading AI infrastructure for Fortune 500 clients
              → Built ML pipelines processing 1B+ daily events

2017-2020     Senior Full-Stack Engineer  
              → Led team of 8 engineers
              → Scaled platform to 10M+ users

2015-2017     Software Engineer
              → MIT Media Lab research
              → Published 3 papers on computer vision

EDUCATION
=========
MIT - BS Computer Science & Engineering`,

  help: `
AVAILABLE COMMANDS
==================

about       - Learn about Kiarash Adl
skills      - View technical skills and proficiency
projects    - List featured projects
contact     - Get contact information
experience  - View work history and education
mcp         - How to connect AI agents (Claude, etc.)
help        - Show this help message

MCP TOOLS
=========
get_project_details  - Get detailed project information
run_terminal_command - Execute terminal commands`,

  mcp: `
🤖 CONNECT AI AGENTS TO THIS PORTFOLIO
======================================

This portfolio supports the Model Context Protocol (MCP),
allowing AI assistants like Claude to query it directly.

FOR CLAUDE DESKTOP
------------------
Add to your claude_desktop_config.json:

{
  "mcpServers": {
    "kiarash-portfolio": {
      "url": "https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json"
    }
  }
}

Then restart Claude Desktop.

FOR OTHER AI AGENTS
-------------------
Discovery URL:
  https://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json

Tool Endpoint:
  POST https://kiarash-adl.pages.dev/mcp/invoke
  Body: { "tool": "tool_name", "input": { ... } }

AVAILABLE TOOLS
---------------
• get_project_details - Get info about projects (fiml, hirealigna, aivision)
• run_terminal_command - Run commands (about, skills, projects, contact, experience)

EXAMPLE CURL
------------
curl -X POST https://kiarash-adl.pages.dev/mcp/invoke \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"get_project_details","input":{"projectId":"fiml"}}'

The manifest is cryptographically signed with Ed25519.`
};

// Tool handlers
function handleGetProjectDetails(input: { projectId: string; includeStack?: boolean }) {
  const project = projects[input.projectId];
  if (!project) {
    return {
      error: `Project not found: ${input.projectId}`,
      availableProjects: Object.keys(projects)
    };
  }

  const result: Record<string, unknown> = {
    id: project.id,
    title: project.title,
    description: project.description,
    shortDescription: project.shortDescription,
    status: project.status,
    metrics: project.metrics,
    impact: project.impact,
    category: project.category
  };

  if (input.includeStack !== false) {
    result.stack = project.stack;
  }

  // Include links if available
  if (project.links.website) result.website = project.links.website;
  if (project.links.github) result.github = project.links.github;
  if (project.links.demo) result.demo = project.links.demo;

  return result;
}

function handleRunTerminalCommand(input: { command: string }) {
  const output = terminalCommands[input.command];
  if (!output) {
    return {
      error: `Unknown command: ${input.command}`,
      availableCommands: Object.keys(terminalCommands)
    };
  }
  return {
    command: input.command,
    output: output.trim()
  };
}

// Cloudflare Pages Function handler
export const onRequest = async (context: { request: Request }): Promise<Response> => {
  const { request } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await request.json() as { tool?: string; input?: Record<string, unknown> };
    const { tool, input } = body;

    if (!tool) {
      return new Response(JSON.stringify({ 
        error: "Missing 'tool' field",
        availableTools: ["get_project_details", "run_terminal_command"]
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let result: unknown;

    switch (tool) {
      case "get_project_details":
        if (!input?.projectId) {
          return new Response(JSON.stringify({ 
            error: "Missing required field: projectId",
            availableProjects: Object.keys(projects)
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        result = handleGetProjectDetails(input as { projectId: string; includeStack?: boolean });
        break;

      case "run_terminal_command":
        if (!input?.command) {
          return new Response(JSON.stringify({ 
            error: "Missing required field: command",
            availableCommands: Object.keys(terminalCommands)
          }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        result = handleRunTerminalCommand(input as { command: string });
        break;

      default:
        return new Response(JSON.stringify({ 
          error: `Unknown tool: ${tool}`,
          availableTools: ["get_project_details", "run_terminal_command"]
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify(result, null, 2), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json",
        "X-MCP-Tool": tool
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: "Invalid JSON body",
      usage: {
        method: "POST",
        body: { tool: "tool_name", input: { "...": "..." } }
      }
    }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};
