/**
 * MCP Tool Invocation Endpoint
 * 
 * This Cloudflare Pages Function handles incoming MCP tool calls from AI agents.
 * POST /mcp/invoke with JSON body: { "tool": "tool_name", "input": { ... } }
 */

interface Env {}

// Project data (duplicated from src/data/projects.ts for serverless context)
const projects: Record<string, {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  status: string;
  url?: string;
  github?: string;
}> = {
  fiml: {
    id: "fiml",
    title: "FIML - AI Film Production",
    description: "AI-powered film production platform enabling creators to generate cinematic content using advanced machine learning models.",
    longDescription: "FIML revolutionizes film production by leveraging state-of-the-art AI models for script generation, scene composition, and visual effects. The platform reduces production costs by 80% while maintaining Hollywood-quality output.",
    stack: ["Python", "PyTorch", "React", "TypeScript", "AWS", "FFmpeg", "Stable Diffusion"],
    metrics: [
      { label: "Processing Speed", value: "10x faster" },
      { label: "Cost Reduction", value: "80%" },
      { label: "User Rating", value: "4.9/5" }
    ],
    status: "production",
    url: "https://fiml.ai"
  },
  hirealigna: {
    id: "hirealigna",
    title: "HireAligna - AI Recruiting",
    description: "Intelligent recruiting platform that uses AI to match candidates with opportunities based on skills, culture fit, and career goals.",
    longDescription: "HireAligna transforms the hiring process using advanced NLP and machine learning to analyze resumes, predict candidate success, and reduce time-to-hire. The platform has helped companies reduce hiring costs by 60% while improving retention rates.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "OpenAI", "React", "Redis", "Kubernetes"],
    metrics: [
      { label: "Time-to-Hire", value: "-45%" },
      { label: "Retention Rate", value: "+35%" },
      { label: "Candidates Matched", value: "50K+" }
    ],
    status: "production",
    url: "https://hirealigna.com"
  },
  aivision: {
    id: "aivision",
    title: "AIVision - Computer Vision Platform",
    description: "Enterprise computer vision platform for real-time object detection, tracking, and analysis in manufacturing environments.",
    longDescription: "AIVision provides manufacturing companies with cutting-edge computer vision capabilities for quality control, safety monitoring, and process optimization. The platform processes millions of frames daily with 99.7% accuracy.",
    stack: ["Python", "TensorFlow", "OpenCV", "C++", "CUDA", "Docker", "Kafka"],
    metrics: [
      { label: "Accuracy", value: "99.7%" },
      { label: "Frames/Day", value: "10M+" },
      { label: "Defect Detection", value: "98%" }
    ],
    status: "production"
  }
};

// Terminal command outputs
const terminalCommands: Record<string, string> = {
  about: `
┌─────────────────────────────────────────────────────────────┐
│                    KIARASH ADL                               │
│           AI Systems Architect & Full-Stack Engineer         │
├─────────────────────────────────────────────────────────────┤
│  MIT Alumnus | 10+ Years Experience | Based in San Francisco │
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

1. FIML - AI Film Production
   Status: Production | Stack: Python, PyTorch, React
   → AI-powered cinematic content generation

2. HireAligna - AI Recruiting  
   Status: Production | Stack: Node.js, OpenAI, PostgreSQL
   → Intelligent candidate matching platform

3. AIVision - Computer Vision Platform
   Status: Production | Stack: Python, TensorFlow, CUDA
   → Real-time object detection for manufacturing

Use 'get_project_details' tool for more information.`,

  contact: `
CONTACT INFORMATION
===================

Email:    kiarasha@alum.mit.edu
GitHub:   github.com/kiarashplusplus
LinkedIn: linkedin.com/in/kiarashadl
Location: San Francisco, CA

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
help        - Show this help message

MCP TOOLS
=========
get_project_details  - Get detailed project information
run_terminal_command - Execute terminal commands`
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
    longDescription: project.longDescription,
    status: project.status,
    metrics: project.metrics
  };

  if (input.includeStack !== false) {
    result.stack = project.stack;
  }

  if (project.url) result.url = project.url;
  if (project.github) result.github = project.github;

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

export const onRequest: PagesFunction<Env> = async (context) => {
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
