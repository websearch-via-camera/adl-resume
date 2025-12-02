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

// Check if console.clear() works (disabled when "Preserve log" is enabled)
const canClearConsole = (() => {
  const marker = '__console_clear_test__';
  (console as any)[marker] = true;
  console.clear();
  const cleared = !(console as any)[marker];
  delete (console as any)[marker];
  return cleared;
})();

// Console greeting - animated if console.clear works, static otherwise
if (canClearConsole) {
  // Animated waving hand in console
  const wave = ['👋', '🖐️', '👋', '✋', '👋'];
  let waveIndex = 0;
  const waveInterval = setInterval(() => {
    console.clear();
    console.log(
      `%c${wave[waveIndex]} Hey there!`,
      'font-size: 16px; font-weight: bold; color: #22c55e;'
    );
    console.log('%c💡 Konami: Try arrow keys → ↑ ↑ ↓ ↓ ← → ← →', 'font-size: 12px; color: #fbbf24; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;');
    console.log('%cWelcome to Kiarash Adl\'s portfolio console.', 'font-size: 12px; color: #94a3b8;');
    console.log('%c⚡ Built with Preact • TypeScript • Tailwind • Vite • ♥', 'color: white;');
    console.log('%cLet\'s connect: kiarasha@alum.mit.edu', 'font-size: 12px; color: #94a3b8;');
    waveIndex++;
    if (waveIndex >= wave.length) {
      clearInterval(waveInterval);
      // Final static message
      console.log('%c✨ Let\'s create some magic together!', 'font-size: 16px; font-weight: bold; color: #fbbf24;');
      console.log('%c✨ Type "matrix" in the terminal section for a surprise!', 'font-size: 12px; color: #22c55e; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;');
    }
  }, 400);
} else {
  // Static message when Preserve log is enabled
  console.log('%c👋 Hey there!', 'font-size: 16px; font-weight: bold; color: #22c55e;');
  console.log('%c💡 Konami: Try arrow keys → ↑ ↑ ↓ ↓ ← → ← →', 'font-size: 12px; color: #fbbf24; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;');
  console.log('%cWelcome to Kiarash Adl\'s portfolio console.', 'font-size: 12px; color: #94a3b8;');
  console.log('%c⚡ Built with Preact • TypeScript • Tailwind • Vite • ♥', 'color: white;');
  console.log('%cLet\'s connect: kiarasha@alum.mit.edu', 'font-size: 12px; color: #94a3b8;');
  console.log('%c✨ Let\'s create some magic together!', 'font-size: 16px; font-weight: bold; color: #fbbf24;');
  console.log('%c✨ Type "matrix" in the terminal section for a surprise!', 'font-size: 12px; color: #22c55e; font-family: monospace; background: #fbbf2415; padding: 2px 6px; border-radius: 4px;');
}

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
