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

// ============================================================================
// Console Easter Egg - A delightful surprise for curious developers
// ============================================================================
const styles = {
  banner: 'font-size: 14px; font-weight: bold; color: #22c55e; line-height: 1.4;',
  title: 'font-size: 18px; font-weight: bold; background: linear-gradient(90deg, #22c55e, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;',
  subtitle: 'font-size: 13px; color: #a78bfa; font-style: italic;',
  hint: 'font-size: 12px; color: #fbbf24; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;',
  body: 'font-size: 12px; color: #94a3b8; line-height: 1.6;',
  email: 'font-size: 13px; color: #38bdf8; font-weight: 600; text-decoration: underline;',
  tech: 'font-size: 11px; color: #64748b; font-family: monospace;',
  divider: 'font-size: 10px; color: #334155;',
}

// ASCII Art Banner
console.log(`%c
    ╭─────────────────────────────────────╮
    │                                     │
    │   👋  Hey there, curious dev!       │
    │                                     │
    ╰─────────────────────────────────────╯
`, styles.banner);

console.log('%c🎉 Achievement Unlocked: Source Code Explorer!', styles.subtitle);

console.log('%c\n💡 Secret: Try the Konami code → ↑ ↑ ↓ ↓ ← → ← →', styles.hint);

console.log('%c\nSince you appreciate looking under the hood...\nI bet you build cool stuff too! Let\'s collaborate.', styles.body);

console.log('%c\n📧 kiarasha@alum.mit.edu', styles.email);

console.log('%c\n─────────────────────────────────────────', styles.divider);
console.log('%c⚡ Preact • TypeScript • Tailwind 4 • Vite • Web Audio • MCP', styles.tech);
console.log('%c─────────────────────────────────────────', styles.divider);

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
