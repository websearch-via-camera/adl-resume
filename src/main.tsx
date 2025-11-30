import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider"
import { A11yProvider } from "@/components/A11yProvider"

// Single consolidated CSS import (main.css imports index.css)
import "./main.css"

// Fun console message for fellow developers 👋
console.log(`
%c🚀 Hey there, curious developer! 👀
%c┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   You found the secret console message! 🎉                  │
│                                                             │
│   Since you're already poking around...                     │
│   Why not build something awesome together?                 │
│                                                             │
│   📧 Reach out: kiarasha@alum.mit.edu                       │
│                                                             │
│   Let's create some magic! ✨                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`,
'font-size: 16px; font-weight: bold; color: #22c55e;',
'font-family: monospace; font-size: 12px; color: #64748b;'
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
        <App />
        <Toaster />
      </A11yProvider>
    </ThemeProvider>
   </ErrorBoundary>
)
