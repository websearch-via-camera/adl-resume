# Kiarash Adl Portfolio

AI-enabled portfolio with MCP (Model Context Protocol) integration, allowing AI agents to query projects, skills, and experience programmatically.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Cloudflare Pages Functions
- **MCP:** JSON-RPC protocol with Ed25519 signed manifests

## 🛠️ Development

```bash
npm install
npm run dev
```

## 📄 Updating the Resume PDF

When you update the resume PDF, the Vite build will generate a new content-based hash in the filename. You'll need to update the URL in these files:

1. **Replace the PDF file:**
   ```
   src/assets/documents/Kiarash-Adl-Resume-YYYYMMDD.pdf
   ```

2. **Build to get the new hash:**
   ```bash
   npm run build
   ```
   Check `dist/assets/` for the new filename (e.g., `Kiarash-Adl-Resume-20251201-NEWHASH.pdf`)

3. **Update these files with the new URL:**
   - `functions/mcp/invoke.ts` (2 locations - terminal output and resources field)
   - `src/components/TerminalSection.tsx` (2 locations - display text and window.open)
   - `src/mcp/tools.ts` (1 location)

4. **Search for the old hash to find all occurrences:**
   ```bash
   grep -r "DFXsl4HJ" src/ functions/
   ```

## 🤖 MCP Endpoints

- **Discovery:** `/.well-known/mcp.llmfeed.json`
- **Invoke:** `/mcp/invoke`

### Available Commands
- `about` - Background info
- `skills` - Technical skills
- `projects` - Portfolio projects
- `contact` - Contact information
- `experience` - Work history
- `resume` - Resume download link (includes PDF resource)
- `mcp` - MCP integration details
- `help` - List all commands

## 📄 License

MIT
