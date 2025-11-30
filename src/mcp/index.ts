/**
 * MCP (Model Context Protocol) Module
 * 
 * Provides WebMCP integration for AI agent discovery and tool execution.
 * 
 * @module mcp
 */

export { mcpTools, zodToJsonSchema, type MCPTool, type MCPToolResult } from "./tools"
export { 
  useMCP, 
  initMCP, 
  isMCPMode, 
  enableMCPMode, 
  disableMCPMode,
  type UseMCPOptions,
  type UseMCPResult 
} from "./useMCP"
