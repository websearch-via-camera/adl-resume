#!/usr/bin/env node
/**
 * MCP Proxy for Kiarash Adl Portfolio
 * 
 * This script bridges Claude Desktop to the remote MCP server.
 * 
 * Usage:
 *   1. Save this file somewhere (e.g., ~/mcp-proxy.mjs)
 *   2. Add to claude_desktop_config.json:
 *      "kiarash-portfolio": {
 *        "command": "node",
 *        "args": ["/path/to/mcp-proxy.mjs"]
 *      }
 *   3. Restart Claude Desktop
 */

const MCP_ENDPOINT = "https://kiarash-adl.pages.dev/mcp/invoke";

// Read from stdin, write to stdout (MCP stdio transport)
process.stdin.setEncoding("utf8");

let buffer = "";

process.stdin.on("data", async (chunk) => {
  buffer += chunk;
  
  // Try to parse complete JSON-RPC messages
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    try {
      const request = JSON.parse(line);
      const response = await handleRequest(request);
      console.log(JSON.stringify(response));
    } catch (err) {
      console.error(JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32700, message: "Parse error" },
        id: null
      }));
    }
  }
});

async function handleRequest(request) {
  const { id, method, params } = request;
  
  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: {
              name: "kiarash-portfolio",
              version: "1.0.0"
            }
          }
        };
      
      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            tools: [
              {
                name: "get_project_details",
                description: "Get detailed information about a portfolio project",
                inputSchema: {
                  type: "object",
                  properties: {
                    projectId: {
                      type: "string",
                      enum: ["fiml", "hirealigna", "aivision"],
                      description: "The project ID"
                    },
                    includeStack: {
                      type: "boolean",
                      default: true
                    }
                  },
                  required: ["projectId"]
                }
              },
              {
                name: "run_terminal_command",
                description: "Execute a terminal command to get portfolio info",
                inputSchema: {
                  type: "object",
                  properties: {
                    command: {
                      type: "string",
                      enum: ["about", "skills", "projects", "contact", "experience", "help"],
                      description: "The command to run"
                    }
                  },
                  required: ["command"]
                }
              }
            ]
          }
        };
      
      case "tools/call":
        const { name, arguments: args } = params;
        const result = await callRemoteTool(name, args);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
          }
        };
      
      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        };
    }
  } catch (err) {
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32000, message: err.message }
    };
  }
}

async function callRemoteTool(tool, input) {
  const response = await fetch(MCP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, input })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}
