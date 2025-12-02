import { useEffect, useState, useCallback, memo } from "react"
import { cn } from "@/lib/utils"

// Konami Code (simplified): ↑↑↓↓←→←→
const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"
]

// Matrix rain characters
const MATRIX_CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789"

interface MatrixDrop {
  id: number
  x: number
  chars: string[]
  speed: number
  opacity: number
}

/**
 * Easter Egg Component - Konami Code triggers Matrix rain mode
 * A hidden delight for curious visitors
 */
export const EasterEgg = memo(function EasterEgg() {
  const [isActive, setIsActive] = useState(false)
  const [inputSequence, setInputSequence] = useState<string[]>([])
  const [drops, setDrops] = useState<MatrixDrop[]>([])
  const [showHint, setShowHint] = useState(false)
  const [progress, setProgress] = useState(0) // Track how far into the code
  
  // Generate random matrix character
  const randomChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
  
  // Generate a matrix drop column
  const createDrop = useCallback((id: number): MatrixDrop => {
    const charCount = Math.floor(Math.random() * 15) + 8
    return {
      id,
      x: Math.random() * 100,
      chars: Array.from({ length: charCount }, randomChar),
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.5,
    }
  }, [])
  
  // Activation sound - dramatic chord with arpeggio (defined before useEffect that uses it)
  const playActivationSound = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create dramatic Am9 chord arpeggio
      const frequencies = [220, 261.63, 329.63, 392, 493.88, 587.33]
      
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = i < 3 ? "sine" : "triangle"
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05 + i * 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(ctx.currentTime + i * 0.04)
        osc.stop(ctx.currentTime + 2.5)
      })
      
      // Add subtle white noise sweep
      const noise = ctx.createBufferSource()
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3
      }
      noise.buffer = noiseBuffer
      
      const noiseGain = ctx.createGain()
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = "highpass"
      noiseFilter.frequency.setValueAtTime(2000, ctx.currentTime)
      noiseFilter.frequency.exponentialRampToValueAtTime(8000, ctx.currentTime + 0.3)
      
      noiseGain.gain.setValueAtTime(0.08, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start()
    } catch {
      // Audio not supported
    }
  }, [])
  
  // Listen for Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      const key = e.code
      const newSequence = [...inputSequence, key].slice(-KONAMI_CODE.length)
      setInputSequence(newSequence)
      
      // Update progress indicator
      let matchCount = 0
      for (let i = 0; i < newSequence.length; i++) {
        if (newSequence[i] === KONAMI_CODE[i]) {
          matchCount++
        } else {
          break
        }
      }
      setProgress(matchCount)
      
      // Check if sequence matches
      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        setIsActive(true)
        setInputSequence([])
        setProgress(0)
        
        // Play activation sound
        playActivationSound()
        
        // Initialize drops
        const initialDrops = Array.from({ length: 60 }, (_, i) => createDrop(i))
        setDrops(initialDrops)
        
        // Auto-deactivate after 12 seconds
        setTimeout(() => setIsActive(false), 12000)
      }
      
      // Show hint after pressing arrow up twice at start
      if (newSequence.length >= 2 && 
          newSequence.slice(-2).join(",") === "ArrowUp,ArrowUp" &&
          matchCount >= 2) {
        setShowHint(true)
        setTimeout(() => setShowHint(false), 4000)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [inputSequence, createDrop])
  
  // Animate matrix drops
  useEffect(() => {
    if (!isActive) return
    
    const interval = setInterval(() => {
      setDrops(prev => prev.map(drop => {
        // Occasionally change a character
        if (Math.random() < 0.1) {
          const newChars = [...drop.chars]
          const changeIdx = Math.floor(Math.random() * newChars.length)
          newChars[changeIdx] = randomChar()
          return { ...drop, chars: newChars }
        }
        return drop
      }))
    }, 80)
    
    return () => clearInterval(interval)
  }, [isActive])
  
  // Exit handler
  const handleExit = () => {
    setIsActive(false)
  }
  
  if (!isActive && !showHint && progress === 0) return null
  
  // Progress indicator (shows when user is entering code)
  if (!isActive && !showHint && progress > 0) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in duration-200">
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-lg">
          {KONAMI_CODE.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                i < progress ? "bg-green-500 scale-110" : "bg-muted-foreground/30"
              )}
            />
          ))}
          {progress >= KONAMI_CODE.length - 2 && (
            <span className="text-xs text-green-400 ml-2 animate-pulse">Almost there!</span>
          )}
        </div>
      </div>
    )
  }
  
  // Hint overlay
  if (showHint && !isActive) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="px-5 py-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/10">
          <p className="text-sm text-foreground flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="text-primary font-mono font-bold">↑↑↓↓←→←→</span>
            <span className="text-muted-foreground">for a surprise...</span>
          </p>
        </div>
      </div>
    )
  }
  
  // Matrix rain effect
  return (
    <div 
      className="fixed inset-0 z-[200] bg-black cursor-pointer overflow-hidden"
      onClick={handleExit}
    >
      {/* Matrix rain */}
      <div className="absolute inset-0 overflow-hidden font-mono text-sm">
        {drops.map(drop => (
          <div
            key={drop.id}
            className="absolute top-0 flex flex-col"
            style={{
              left: `${drop.x}%`,
              animation: `matrix-fall ${18 / drop.speed}s linear infinite`,
              opacity: drop.opacity,
            }}
          >
            {drop.chars.map((char, i) => (
              <span
                key={i}
                className={cn(
                  "leading-tight",
                  i === 0 && "text-white font-bold text-base",
                  i === 1 && "text-green-300",
                  i > 1 && i < 4 && "text-green-400",
                  i >= 4 && "text-green-500",
                  i > drop.chars.length - 3 && "text-green-800"
                )}
                style={{
                  textShadow: i === 0 ? "0 0 10px #fff, 0 0 20px #0f0, 0 0 30px #0f0" : 
                             i < 3 ? "0 0 8px #0f0" : undefined,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
      
      {/* Center message with glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="text-center animate-in zoom-in-75 fade-in duration-700 max-w-lg">
          {/* Glowing backdrop */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-500/20 via-transparent to-green-500/20 blur-3xl" />
          
          <h2 className="text-4xl md:text-6xl font-bold text-green-400 mb-4 glitch-text tracking-wider" data-text="WELCOME NEO">
            WELCOME NEO
          </h2>
          <p className="text-green-400/90 text-lg md:text-xl mb-6 font-light">
            You've proven you're not an ordinary visitor...
          </p>
          
          <div className="inline-flex items-center gap-4 mb-8 px-6 py-3 rounded-xl bg-black/50 backdrop-blur-sm border border-green-500/30">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">🐰</span>
              <span className="text-green-500 text-xs">Follow</span>
            </div>
            <div className="w-px h-12 bg-green-500/30" />
            <div className="text-left">
              <p className="text-green-400 text-sm">The rabbit hole goes deeper...</p>
              <p className="text-green-600 text-xs mt-1">Check the terminal section</p>
            </div>
          </div>
          
          <p className="text-green-600/80 text-sm animate-pulse">
            Click anywhere to return to the simulation
          </p>
        </div>
      </div>
      
      {/* Scanlines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)",
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      
      {/* CSS for animations */}
      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .glitch-text {
          position: relative;
          animation: text-flicker 4s linear infinite;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          animation: glitch-1 0.3s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          color: #0ff;
          text-shadow: -2px 0 #0ff;
        }
        
        .glitch-text::after {
          animation: glitch-2 0.3s infinite linear alternate-reverse;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          color: #f0f;
          text-shadow: 2px 0 #f0f;
        }
        
        @keyframes glitch-1 {
          0% { transform: translateX(-2px); }
          100% { transform: translateX(2px); }
        }
        
        @keyframes glitch-2 {
          0% { transform: translateX(2px); }
          100% { transform: translateX(-2px); }
        }
        
        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; }
          94% { opacity: 1; }
          95% { opacity: 0.9; }
          96% { opacity: 1; }
        }
      `}</style>
    </div>
  )
})

// Easter egg console log is now consolidated in main.tsx
// This export is kept for backwards compatibility but does nothing
export function initDevToolsEasterEgg() {
  // Console message moved to main.tsx for single consolidated message
}
