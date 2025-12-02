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

// Console Easter Egg
console.log(
  '%c👋 Hey there, curious dev!',
  'font-size: 16px; font-weight: bold; color: #22c55e;'
);
console.log(
  '%cSince you\'re poking around, let\'s connect: kiarasha@alum.mit.edu',
  'font-size: 12px; color: #94a3b8;'
);
console.log(
  '%c⚡ Built with Preact • TypeScript • Tailwind • Vite',
  'font-size: 11px; color: #64748b;'
);

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
