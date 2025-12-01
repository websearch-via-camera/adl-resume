/**
 * MCP Health Check Endpoint
 * 
 * Path: /mcp/health
 * 
 * Returns server health status for uptime monitoring.
 * Useful for services like UptimeRobot, Pingdom, or custom monitoring.
 */

interface Env {}

export const onRequest = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request } = context;
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow GET
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  const startTime = Date.now();
  
  // Health check response
  const health = {
    status: "healthy",
    service: "kiarash-portfolio-mcp",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: "edge-function", // Cloudflare functions are stateless
    endpoints: {
      discovery: "/.well-known/mcp.llmfeed.json",
      invoke: "/mcp/invoke",
      health: "/mcp/health"
    },
    capabilities: {
      tools: ["get_project_details", "run_terminal_command", "submit_contact"],
      protocol: "json-rpc",
      signed: true
    },
    latency_ms: Date.now() - startTime
  };
  
  return new Response(JSON.stringify(health, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate", // Health checks should not be cached
      "X-MCP-Health": "ok"
    }
  });
};
