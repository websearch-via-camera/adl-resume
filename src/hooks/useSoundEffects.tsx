import { useCallback, useEffect, useRef, useState } from "react"

// Sound effect types
type SoundType = "click" | "hover" | "success" | "whoosh" | "pop"

// Audio context singleton for better performance
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioContext
}

// Generate sounds programmatically (no external files needed)
function createSound(type: SoundType): () => void {
  return () => {
    try {
      const ctx = getAudioContext()
      
      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        ctx.resume()
      }
      
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      const now = ctx.currentTime
      
      switch (type) {
        case "click":
          // Short, satisfying click - more audible
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(1200, now)
          oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.06)
          gainNode.gain.setValueAtTime(0.2, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
          oscillator.start(now)
          oscillator.stop(now + 0.06)
          break
          
        case "hover":
          // Soft, gentle hover tick
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(800, now)
          oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.04)
          gainNode.gain.setValueAtTime(0.08, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
          oscillator.start(now)
          oscillator.stop(now + 0.04)
          break
          
        case "success":
          // Pleasant confirmation chime
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(523.25, now) // C5
          oscillator.frequency.setValueAtTime(659.25, now + 0.1) // E5
          oscillator.frequency.setValueAtTime(783.99, now + 0.2) // G5
          gainNode.gain.setValueAtTime(0.2, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
          oscillator.start(now)
          oscillator.stop(now + 0.35)
          break
          
        case "whoosh":
          // Transition whoosh - fuller sound
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(200, now)
          oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.18)
          gainNode.gain.setValueAtTime(0.15, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
          oscillator.start(now)
          oscillator.stop(now + 0.18)
          break
          
        case "pop":
          // Bubble pop for toggles - more satisfying
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(600, now)
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1)
          gainNode.gain.setValueAtTime(0.25, now)
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
          oscillator.start(now)
          oscillator.stop(now + 0.1)
          break
      }
    } catch (e) {
      // Silently fail if audio isn't supported
      console.debug("Audio not supported:", e)
    }
  }
}

// Storage key for sound preference
const SOUND_ENABLED_KEY = "kiarash-sound-enabled"

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    try {
      const stored = localStorage.getItem(SOUND_ENABLED_KEY)
      // Default to false (opt-in for sound)
      return stored === "true"
    } catch {
      return false
    }
  })
  
  // Sound functions
  const sounds = useRef({
    click: createSound("click"),
    hover: createSound("hover"),
    success: createSound("success"),
    whoosh: createSound("whoosh"),
    pop: createSound("pop"),
  })
  
  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const newValue = !prev
      try {
        localStorage.setItem(SOUND_ENABLED_KEY, String(newValue))
      } catch {
        // localStorage not available
      }
      // Play a confirmation sound when enabling (after a tiny delay to ensure context is ready)
      if (newValue) {
        setTimeout(() => {
          sounds.current.pop()
        }, 50)
      }
      return newValue
    })
  }, [])
  
  // Play sound if enabled
  const playSound = useCallback((type: SoundType) => {
    if (soundEnabled) {
      sounds.current[type]()
    }
  }, [soundEnabled])
  
  // Convenience methods
  const playClick = useCallback(() => playSound("click"), [playSound])
  const playHover = useCallback(() => playSound("hover"), [playSound])
  const playSuccess = useCallback(() => playSound("success"), [playSound])
  const playWhoosh = useCallback(() => playSound("whoosh"), [playSound])
  const playPop = useCallback(() => playSound("pop"), [playSound])
  
  return {
    soundEnabled,
    toggleSound,
    playSound,
    playClick,
    playHover,
    playSuccess,
    playWhoosh,
    playPop,
  }
}

// Create a context for global sound access
import { createContext, useContext, ReactNode } from "react"

interface SoundContextType {
  soundEnabled: boolean
  toggleSound: () => void
  playClick: () => void
  playHover: () => void
  playSuccess: () => void
  playWhoosh: () => void
  playPop: () => void
}

const SoundContext = createContext<SoundContextType | null>(null)

export function SoundProvider({ children }: { children: ReactNode }) {
  const soundEffects = useSoundEffects()
  
  return (
    <SoundContext.Provider value={soundEffects}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    // Return no-op functions if not in provider
    return {
      soundEnabled: false,
      toggleSound: () => {},
      playClick: () => {},
      playHover: () => {},
      playSuccess: () => {},
      playWhoosh: () => {},
      playPop: () => {},
    }
  }
  return context
}
