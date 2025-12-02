import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider"
import { A11yProvider } from "@/components/A11yProvider"
import { SoundProvider } from "@/hooks/useSoundEffects"
import { initMCP } from "@/mcp/useMCP"

// Single consolidated CSS import (main.css imports index.css)
import "./main.css"

// Initialize MCP tools for AI agent discovery
initMCP()

// Fun console message for fellow developers 👋
console.log(
  '%c👋 Hey there, curious developer!',
  'font-size: 20px; font-weight: bold; color: #22c55e; text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);'
);

console.log(
  '%c🎉 You found the secret console! Achievement unlocked!',
  'font-size: 14px; color: #a78bfa; margin: 4px 0;'
);

console.log(
  '%c💡 Try the Konami code on the page: ↑ ↑ ↓ ↓ ← → ← →',
  'font-size: 12px; color: #fbbf24; font-family: monospace;'
);

console.log(
  '%c\nSince you\'re already poking around...\nWhy not build something awesome together?',
  'font-size: 12px; color: #94a3b8; line-height: 1.8;'
);

console.log(
  '%c📧 kiarasha@alum.mit.edu',
  'font-size: 13px; color: #38bdf8; font-weight: 500;'
);

console.log(
  '%c\n✨ Built with React 19 • TypeScript • Tailwind 4 • Web Audio API • Custom MCP Server',
  'font-size: 11px; color: #64748b;'
);

// Separate MCP info for AI agents (collapsed by default)
console.groupCollapsed('%c🤖 MCP Tools for AI Agents', 'font-size: 11px; color: #64748b;');
console.log('%cDiscovery URL:', 'color: #64748b; font-size: 11px;');
console.log('%chttps://kiarash-adl.pages.dev/.well-known/mcp.llmfeed.json', 'color: #22c55e; font-family: monospace; font-size: 11px;');
console.log('%c\nAvailable tools:', 'color: #64748b; font-size: 11px;');
console.log('  • about, skills, projects, experience, contact');
console.log('  • submit_contact - Send a message');
console.log('  • run_terminal_command - Interactive terminal');
console.groupEnd();

// Mark hydration complete and remove initial loader
const root = document.getElementById('root')
if (root) {
  root.setAttribute('data-hydrated', 'true')
  const loader = document.getElementById('initial-loader')
  if (loader) loader.remove()
}

createRoot(root!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <A11yProvider>
        <SoundProvider>
          <App />
          <Toaster />
        </SoundProvider>
      </A11yProvider>
    </ThemeProvider>
   </ErrorBoundary>
)
