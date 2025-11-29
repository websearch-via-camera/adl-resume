import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

// Only import spark in production (GitHub Spark environment)
try {
  // @ts-ignore - spark module may not exist in all environments
  import("@github/spark/spark").catch(() => {
    // Silently fail if spark is not available (local development)
  });
} catch {
  // Spark not available
}

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider"

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
      <Toaster />
    </ThemeProvider>
   </ErrorBoundary>
)
