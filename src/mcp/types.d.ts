/**
 * Type declarations for WebMCP
 * Extends the Navigator interface with modelContext API
 */

interface MCPToolDefinition {
  name: string
  description: string
  inputSchema: object
}

interface MCPToolResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
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

export {}
