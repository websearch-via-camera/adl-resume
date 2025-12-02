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

// Console greeting with animated waving hand
const wave = ['👋', '🖐️', '👋', '✋', '👋', '✋', '👋', '✋', '👋'];
let waveIndex = 0;

const printConsoleGreeting = (emoji: string, isFinal = false) => {
  console.log(
    `%c${emoji} Hey there, curious dev!`,
    'font-size: 16px; font-weight: bold; color: #22c55e;'
  );
  console.log('%c\n💡 Konami: Try this arrow keys on the screen  ↑ ↑ ↓ ↓ ← → ← →', 'font-size: 12px; color: #fbbf24; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;');
  console.log(
    '%cWelcome to the console of Kiarash Adl\'s portfolio site.',
    'font-size: 12px; color: #94a3b8;'
  );
  console.log('%c⚡ Built with Preact • TypeScript • Tailwind • Vite • ♥', 'color: white;');
  console.log(
    '%cSince you\'re poking around, let\'s connect: kiarasha@alum.mit.edu',
    'font-size: 12px; color: #94a3b8;'
  );
  if (isFinal) {
    console.log(
      '%c✨ Let\'s create some magic!',
      'font-size: 12px; color: #fbbf24; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;'
    );
  }
};

// Print first frame immediately
printConsoleGreeting(wave[0]);
waveIndex = 1;

const waveInterval = setInterval(() => {
  console.clear();
  
  if (waveIndex >= wave.length) {
    clearInterval(waveInterval);
    printConsoleGreeting('👋', true);
    return;
  }
  
  printConsoleGreeting(wave[waveIndex]);
  waveIndex++;
}, 400);

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
