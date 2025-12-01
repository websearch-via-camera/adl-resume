/**
 * Cloudflare Pages Function to serve the MCP public key
 * 
 * Path: /.well-known/public.pem
 * 
 * This serves the Ed25519 public key used to verify MCP manifest signatures.
 * The public key is derived from MCP_PRIVATE_KEY at runtime.
 */

interface Env {
  MCP_PRIVATE_KEY?: string; // Base64-encoded Ed25519 private key (PKCS#8 format)
}

async function derivePublicKey(privateKeyBase64: string): Promise<string> {
  // Decode the private key from base64
  const privateKeyBytes = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0));
  
  // Determine key format based on length
  let cryptoKey: CryptoKey;
  
  if (privateKeyBytes.length === 48) {
    // PKCS#8 format - import directly
    cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyBytes,
      { name: "Ed25519" },
      true, // extractable - needed to export public key
      ["sign"]
    );
  } else if (privateKeyBytes.length === 32) {
    // Raw 32-byte seed - need to wrap in PKCS#8
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
      true,
      ["sign"]
    );
  } else {
    throw new Error(`Invalid key length: ${privateKeyBytes.length} (expected 32 or 48)`);
  }
  
  // Export public key in SPKI format
  const publicKeySpki = await crypto.subtle.exportKey("spki", cryptoKey);
  const publicKeyBytes = new Uint8Array(publicKeySpki);
  
  // Convert to PEM format
  const publicKeyBase64 = btoa(String.fromCharCode(...publicKeyBytes));
  const pemLines = publicKeyBase64.match(/.{1,64}/g) || [];
  const pem = `-----BEGIN PUBLIC KEY-----\n${pemLines.join('\n')}\n-----END PUBLIC KEY-----\n`;
  
  return pem;
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
  
  // Check if private key is configured
  if (!env.MCP_PRIVATE_KEY) {
    return new Response("Public key not available - MCP_PRIVATE_KEY not configured", {
      status: 503,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  
  try {
    const publicKeyPem = await derivePublicKey(env.MCP_PRIVATE_KEY);
    
    return new Response(publicKeyPem, {
      headers: {
        "Content-Type": "application/x-pem-file",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "X-Key-Algorithm": "Ed25519",
      },
    });
  } catch (err) {
    console.error("Failed to derive public key:", err);
    return new Response("Failed to derive public key", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
