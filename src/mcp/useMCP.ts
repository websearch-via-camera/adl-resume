/**
 * WebMCP Bootstrap Hook
 * 
 * Registers MCP tools with navigator.modelContext for AI agent discovery.
 * This follows the WebMCP standard for client-side tool registration.
 * 
 * @see https://spec.webmcp.org/
 */

import { useEffect, useRef, useCallback } from "react"
import { mcpTools, zodToJsonSchema, type MCPToolResult } from "./tools"

// ============================================================================
// TypeScript Declarations for WebMCP
// ============================================================================

interface MCPToolDefinition {
  name: string
  description: string
  inputSchema: object
}

interface ModelContextAPI {
  tools: MCPToolDefinition[]
  registerTool: (tool: MCPToolDefinition & { handler: (input: unknown) => Promise<MCPToolResult> }) => void
  callTool: (name: string, input: unknown) => Promise<MCPToolResult>
  version: string
}

declare global {
  interface Navigator {
    modelContext?: ModelContextAPI
  }
}

// ============================================================================
// MCP Mode Detection
// ============================================================================

export function isMCPMode(): boolean {
  if (typeof window === "undefined") return false
  
  // Check URL param
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get("mcp") === "true") return true
  
  // Check localStorage
  try {
    if (localStorage.getItem("kiarash-mcp-mode") === "true") return true
  } catch {
    // localStorage not available
  }
  
  return false
}

export function enableMCPMode(): void {
  try {
    localStorage.setItem("kiarash-mcp-mode", "true")
  } catch {
    // localStorage not available
  }
}

export function disableMCPMode(): void {
  try {
    localStorage.removeItem("kiarash-mcp-mode")
  } catch {
    // localStorage not available
  }
}

// ============================================================================
// Polyfill for navigator.modelContext
// ============================================================================

function createModelContextPolyfill(): ModelContextAPI {
  const registeredTools: Map<string, {
    definition: MCPToolDefinition
    handler: (input: unknown) => Promise<MCPToolResult>
  }> = new Map()

  return {
    version: "1.0.0",
    
    get tools() {
      return Array.from(registeredTools.values()).map(t => t.definition)
    },

    registerTool(tool) {
      const definition: MCPToolDefinition = {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }
      registeredTools.set(tool.name, { definition, handler: tool.handler })
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[MCP] Registered tool: ${tool.name}`)
      }
    },

    async callTool(name: string, input: unknown): Promise<MCPToolResult> {
      const tool = registeredTools.get(name)
      if (!tool) {
        return {
          success: false,
          error: `Tool not found: ${name}. Available: ${Array.from(registeredTools.keys()).join(", ")}`,
        }
      }

      try {
        return await tool.handler(input)
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }
      }
    },
  }
}

// ============================================================================
// Hook: useMCP
// ============================================================================

export interface UseMCPOptions {
  /** Enable verbose logging in development */
  debug?: boolean
}

export interface UseMCPResult {
  /** Whether MCP is initialized and ready */
  isReady: boolean
  /** Whether running in MCP mode */
  isMCPMode: boolean
  /** Call an MCP tool by name */
  callTool: (name: string, input: unknown) => Promise<MCPToolResult>
  /** Get all registered tool names */
  getToolNames: () => string[]
}

export function useMCP(options: UseMCPOptions = {}): UseMCPResult {
  const { debug = false } = options
  const isReadyRef = useRef(false)
  const mcpModeRef = useRef(false)

  useEffect(() => {
    // Initialize polyfill if needed
    if (!navigator.modelContext) {
      navigator.modelContext = createModelContextPolyfill()
      if (debug) {
        console.log("[MCP] Created modelContext polyfill")
      }
    }

    // Register all tools
    for (const tool of mcpTools) {
      navigator.modelContext.registerTool({
        name: tool.name,
        description: tool.description,
        inputSchema: zodToJsonSchema(tool.inputSchema),
        handler: tool.handler,
      })
    }

    isReadyRef.current = true
    mcpModeRef.current = isMCPMode()

    if (debug) {
      console.log(`[MCP] Initialized with ${mcpTools.length} tools`)
      console.log(`[MCP] Mode: ${mcpModeRef.current ? "enabled" : "disabled"}`)
      console.log("[MCP] Test with: navigator.modelContext.tools")
    }

    // Announce to console for AI agents
    if (process.env.NODE_ENV === "development") {
      console.log(`
%c🤖 MCP Tools Available
%cThis site supports Model Context Protocol for AI agents.
Tools: ${mcpTools.map(t => t.name).join(", ")}

Test: navigator.modelContext.callTool("run_terminal_command", { command: "about" })
`,
        "font-size: 14px; font-weight: bold; color: #8b5cf6;",
        "font-size: 12px; color: #64748b;"
      )
    }
  }, [debug])

  const callTool = useCallback(async (name: string, input: unknown): Promise<MCPToolResult> => {
    if (!navigator.modelContext) {
      return { success: false, error: "MCP not initialized" }
    }
    return navigator.modelContext.callTool(name, input)
  }, [])

  const getToolNames = useCallback((): string[] => {
    return navigator.modelContext?.tools.map(t => t.name) ?? []
  }, [])

  return {
    isReady: isReadyRef.current,
    isMCPMode: mcpModeRef.current,
    callTool,
    getToolNames,
  }
}

// ============================================================================
// Standalone init function (for non-React contexts like main.tsx)
// ============================================================================

let initialized = false

export function initMCP(): void {
  if (initialized) return
  initialized = true

  // Create polyfill
  if (!navigator.modelContext) {
    navigator.modelContext = createModelContextPolyfill()
  }

  // Register tools
  for (const tool of mcpTools) {
    navigator.modelContext.registerTool({
      name: tool.name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.inputSchema),
      handler: tool.handler,
    })
  }

  // Log for verification (always log in production for AI agent debugging)
  console.log("[MCP] WebMCP initialized with tools:", navigator.modelContext.tools.length)
}
