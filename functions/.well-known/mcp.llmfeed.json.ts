/**
 * Cloudflare Pages Function for signing MCP discovery file
 * 
 * This function serves the MCP manifest and signs it with Ed25519 if
 * the MCP_PRIVATE_KEY environment variable is configured.
 * 
 * Path: /.well-known/mcp.llmfeed.json
 */

interface Env {
  MCP_PRIVATE_KEY?: string; // Base64-encoded Ed25519 private key
}

// The static MCP manifest (without signature)
const mcpManifest = {
  "@context": "https://spec.webmcp.org/v1",
  "type": "mcp",
  "version": "1.0",
  "name": "Kiarash Adl Portfolio",
  "description": "AI-enabled portfolio of Kiarash Adl, AI Systems Architect and Full-Stack Engineer. Query projects, skills, and contact information programmatically.",
  "homepage": "https://kiarash-adl.pages.dev",
  "server": {
    "endpoint": "https://kiarash-adl.pages.dev/mcp/invoke",
    "transport": "https",
    "protocol": "json-rpc",
    "documentation": "POST with JSON body: { \"tool\": \"tool_name\", \"input\": { ... } }"
  },
  "tools": [
    {
      "name": "get_project_details",
      "description": "Get detailed information about a specific portfolio project including title, description, tech stack, metrics, and status. Use this to learn about Kiarash's work.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "projectId": {
            "type": "string",
            "description": "The project ID to retrieve (e.g., 'fiml', 'hirealigna', 'aivision')",
            "enum": ["fiml", "hirealigna", "aivision"]
          },
          "includeStack": {
            "type": "boolean",
            "description": "Whether to include the technology stack in the response",
            "default": true
          }
        },
        "required": ["projectId"]
      }
    },
    {
      "name": "run_terminal_command",
      "description": "Execute a terminal command to get information about Kiarash. Available commands: about, skills, projects, contact, experience, mcp, help. Returns formatted text output.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "command": {
            "type": "string",
            "description": "The terminal command to execute",
            "enum": ["about", "skills", "projects", "contact", "experience", "mcp", "help"]
          }
        },
        "required": ["command"]
      }
    }
  ],
  "capabilities": {
    "rateLimit": "10/min",
    "auth": "none",
    "cors": true
  },
  "contact": {
    "email": "kiarasha@alum.mit.edu",
    "github": "https://github.com/kiarashplusplus"
  },
  "metadata": {
    "owner": "Kiarash Adl",
    "category": "portfolio",
    "keywords": ["ai", "machine-learning", "full-stack", "portfolio", "mit"],
    "lastUpdated": "2025-11-30"
  }
};

async function signManifest(manifest: object, privateKeyBase64: string): Promise<string> {
  try {
    // Decode the private key from base64
    const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
    
    // Determine key format based on length
    // PKCS#8 Ed25519 keys are 48 bytes, raw seeds are 32 bytes
    let cryptoKey: CryptoKey;
    
    if (privateKeyBytes.length === 48) {
      // PKCS#8 format - import directly
      cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        privateKeyBytes,
        { name: "Ed25519" },
        false,
        ["sign"]
      );
    } else if (privateKeyBytes.length === 32) {
      // Raw 32-byte seed - need to wrap in PKCS#8
      // Ed25519 PKCS#8 prefix: 302e020100300506032b657004220420
      const pkcs8Prefix = new Uint8Array([
        0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06,
        0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
      ]);
      const pkcs8Key = new Uint8Array(48);
      pkcs8Key.set(pkcs8Prefix);
      pkcs8Key.set(privateKeyBytes, 16);
      
      cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        pkcs8Key,
        { name: "Ed25519" },
        false,
        ["sign"]
      );
    } else {
      throw new Error(`Invalid key length: ${privateKeyBytes.length} (expected 32 or 48)`);
    }
    
    // Create canonical JSON (sorted keys for reproducibility)
    const sortedManifest = JSON.parse(JSON.stringify(manifest, Object.keys(manifest).sort()));
    const canonicalJson = JSON.stringify(sortedManifest);
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalJson);
    
    // Sign the data
    const signature = await crypto.subtle.sign("Ed25519", cryptoKey, data);
    
    // Return base64-encoded signature
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } catch (err) {
    console.error("Signing error:", err);
    throw err;
  }
}

// Cloudflare Pages Function handler
export const onRequest = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context;
  
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  
  // Only allow GET requests
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  
  const responseManifest: Record<string, unknown> = { ...mcpManifest };
  
  // Add trust section with signature if private key is configured
  if (env.MCP_PRIVATE_KEY) {
    try {
      const signature = await signManifest(mcpManifest, env.MCP_PRIVATE_KEY);
      responseManifest.trust = {
        signature,
        signatureAlgorithm: "ed25519",
        signedAt: new Date().toISOString(),
        mode: "production"
      };
    } catch (err) {
      console.error("Failed to sign manifest:", err);
      responseManifest.trust = {
        signature: "unsigned",
        signatureAlgorithm: "ed25519",
        error: "Signing failed - check MCP_PRIVATE_KEY format",
        mode: "development"
      };
    }
  } else {
    // No signing key configured
    responseManifest.trust = {
      signature: "unsigned",
      signatureAlgorithm: "ed25519",
      note: "No MCP_PRIVATE_KEY configured - running in development mode",
      mode: "development"
    };
  }
  
  return new Response(JSON.stringify(responseManifest, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "public, max-age=3600",
      "X-MCP-Version": "1.0",
      "X-MCP-Signed": env.MCP_PRIVATE_KEY ? "true" : "false",
    },
  });
};
