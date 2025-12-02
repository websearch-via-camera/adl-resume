import { Button } from "./components/ui/button";
import { AlertTriangleIcon, RefreshCwIcon } from "./components/icons/CriticalIcons";
import { FallbackProps } from "react-error-boundary";
import { useState, useEffect } from "react";

// Animated glitch text effect
function GlitchText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute top-0 left-0 -translate-x-[2px] text-cyan-500/70 animate-[glitch-1_2s_infinite_linear]"
        aria-hidden="true"
      >
        {children}
      </span>
      <span 
        className="absolute top-0 left-0 translate-x-[2px] text-red-500/70 animate-[glitch-2_2s_infinite_linear]"
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-[float_8s_ease-in-out_infinite]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
}

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  // Auto-retry countdown
  useEffect(() => {
    if (countdown <= 0) {
      resetErrorBoundary();
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, resetErrorBoundary]);

  if (import.meta.env.DEV) throw error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(128,128,128,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Main error card with glassmorphism */}
        <div className="relative">
          {/* Animated border gradient */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500 via-rose-500 to-violet-500 rounded-2xl opacity-75 blur-sm animate-[gradient-shift_3s_ease_infinite]" 
               style={{ backgroundSize: '200% 200%' }} />
          
          <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            {/* Error icon with pulse effect */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
                <div className="relative bg-gradient-to-br from-rose-500/20 to-orange-500/20 p-4 rounded-full border border-rose-500/30">
                  <AlertTriangleIcon className="h-8 w-8 text-rose-500" />
                </div>
              </div>
            </div>
            
            {/* Error title with glitch effect */}
            <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">
              <GlitchText>Oops!</GlitchText>
            </h1>
            
            <p className="text-muted-foreground text-center mb-6 text-sm leading-relaxed">
              Something unexpected happened. Don't worry, these things happen 
              to the best of us. Let's get you back on track.
            </p>
            
            {/* Auto-retry progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Auto-retry in</span>
                <span className="font-mono tabular-nums">{countdown}s</span>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-rose-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(countdown / 10) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={resetErrorBoundary} 
                className="flex-1 bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white border-0 shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 border-white/10 hover:bg-white/5 transition-colors"
              >
                {showDetails ? 'Hide' : 'Details'}
              </Button>
            </div>
            
            {/* Collapsible error details */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-out ${
                showDetails ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-black/20 dark:bg-black/40 rounded-lg border border-white/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Error Stack</span>
                </div>
                <pre className="text-xs text-rose-400/90 font-mono overflow-auto max-h-28 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {error.message}
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          If this keeps happening, try refreshing the page or clearing your cache.
        </p>
      </div>
      
      {/* CSS for custom animations */}
      <style>{`
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translate(2px, 0); }
          40% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 0); }
          60% { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); }
          80% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 0); }
        }
        @keyframes glitch-2 {
          0%, 100% { clip-path: inset(95% 0 0 0); transform: translate(2px, 0); }
          20% { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
          40% { clip-path: inset(30% 0 50% 0); transform: translate(2px, 0); }
          60% { clip-path: inset(10% 0 70% 0); transform: translate(-2px, 0); }
          80% { clip-path: inset(80% 0 10% 0); transform: translate(2px, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
