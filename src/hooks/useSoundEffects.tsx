import { useCallback, useEffect, useRef, useState } from "react"

// Sound effect types - expanded for richer UX
type SoundType = "click" | "hover" | "success" | "whoosh" | "pop" | "chime" | "ambient" | "typing" | "scroll" | "error"

// Audio context singleton for better performance
let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    masterGain = audioContext.createGain()
    masterGain.gain.setValueAtTime(0.7, audioContext.currentTime) // Master volume
    masterGain.connect(audioContext.destination)
  }
  return audioContext
}

function getMasterGain(): GainNode {
  getAudioContext()
  return masterGain!
}

// Musical note frequencies (pentatonic scale for pleasant sounds)
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00,
  C6: 1046.50
}

// Generate sounds programmatically with musical design
function createSound(type: SoundType): () => void {
  return () => {
    try {
      const ctx = getAudioContext()
      const master = getMasterGain()
      
      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        ctx.resume()
      }
      
      const now = ctx.currentTime
      
      switch (type) {
        case "click": {
          // Musical click - quick two-note arpeggio
          const osc1 = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc1.type = "sine"
          osc2.type = "triangle"
          
          osc1.frequency.setValueAtTime(NOTES.E5, now)
          osc2.frequency.setValueAtTime(NOTES.G5, now)
          osc2.frequency.setValueAtTime(NOTES.A5, now + 0.03)
          
          gain.gain.setValueAtTime(0.15, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
          
          osc1.connect(gain)
          osc2.connect(gain)
          gain.connect(master)
          
          osc1.start(now)
          osc2.start(now)
          osc1.stop(now + 0.08)
          osc2.stop(now + 0.08)
          break
        }
          
        case "hover": {
          // Soft harmonic hover - barely audible but felt
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc.type = "sine"
          osc.frequency.setValueAtTime(NOTES.C6, now)
          
          gain.gain.setValueAtTime(0.04, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
          
          osc.connect(gain)
          gain.connect(master)
          
          osc.start(now)
          osc.stop(now + 0.05)
          break
        }
          
        case "success": {
          // Triumphant major chord arpeggio (C-E-G-C)
          const frequencies = [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5]
          
          frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            
            osc.type = i === 3 ? "triangle" : "sine"
            osc.frequency.setValueAtTime(freq, now)
            
            gain.gain.setValueAtTime(0, now + i * 0.08)
            gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
            
            osc.connect(gain)
            gain.connect(master)
            
            osc.start(now + i * 0.08)
            osc.stop(now + 0.5)
          })
          break
        }
          
        case "whoosh": {
          // Sweeping filter whoosh - cinematic feel
          const noise = ctx.createBufferSource()
          const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
          const noiseData = noiseBuffer.getChannelData(0)
          
          for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * 0.5
          }
          
          noise.buffer = noiseBuffer
          
          const filter = ctx.createBiquadFilter()
          filter.type = "bandpass"
          filter.frequency.setValueAtTime(100, now)
          filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15)
          filter.frequency.exponentialRampToValueAtTime(200, now + 0.25)
          filter.Q.setValueAtTime(2, now)
          
          const gain = ctx.createGain()
          gain.gain.setValueAtTime(0.15, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
          
          noise.connect(filter)
          filter.connect(gain)
          gain.connect(master)
          
          noise.start(now)
          break
        }
          
        case "pop": {
          // Bubbly pop with harmonic overtones
          const osc = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc.type = "sine"
          osc2.type = "sine"
          
          osc.frequency.setValueAtTime(800, now)
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.1)
          
          osc2.frequency.setValueAtTime(1200, now)
          osc2.frequency.exponentialRampToValueAtTime(300, now + 0.08)
          
          gain.gain.setValueAtTime(0.2, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
          
          osc.connect(gain)
          osc2.connect(gain)
          gain.connect(master)
          
          osc.start(now)
          osc2.start(now)
          osc.stop(now + 0.12)
          osc2.stop(now + 0.12)
          break
        }
        
        case "chime": {
          // Ethereal bell chime - for special moments
          const frequencies = [NOTES.C5, NOTES.E5, NOTES.G5]
          
          frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            
            osc.type = "sine"
            osc.frequency.setValueAtTime(freq, now)
            
            // Bell-like envelope with long decay
            gain.gain.setValueAtTime(0.15, now)
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
            
            osc.connect(gain)
            gain.connect(master)
            
            osc.start(now + i * 0.02)
            osc.stop(now + 1.5)
          })
          break
        }
        
        case "ambient": {
          // Subtle ambient pad - for background atmosphere
          const osc = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gain = ctx.createGain()
          const filter = ctx.createBiquadFilter()
          
          osc.type = "sine"
          osc2.type = "sine"
          
          osc.frequency.setValueAtTime(NOTES.C4, now)
          osc2.frequency.setValueAtTime(NOTES.G4, now)
          
          // Detune for warmth
          osc2.detune.setValueAtTime(5, now)
          
          filter.type = "lowpass"
          filter.frequency.setValueAtTime(800, now)
          
          gain.gain.setValueAtTime(0, now)
          gain.gain.linearRampToValueAtTime(0.03, now + 0.5)
          gain.gain.linearRampToValueAtTime(0, now + 2)
          
          osc.connect(filter)
          osc2.connect(filter)
          filter.connect(gain)
          gain.connect(master)
          
          osc.start(now)
          osc2.start(now)
          osc.stop(now + 2)
          osc2.stop(now + 2)
          break
        }
        
        case "typing": {
          // Soft typewriter click - randomized pitch
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc.type = "square"
          osc.frequency.setValueAtTime(2000 + Math.random() * 500, now)
          
          gain.gain.setValueAtTime(0.03, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
          
          osc.connect(gain)
          gain.connect(master)
          
          osc.start(now)
          osc.stop(now + 0.02)
          break
        }
        
        case "scroll": {
          // Subtle scroll tick - very quiet
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc.type = "sine"
          osc.frequency.setValueAtTime(600 + Math.random() * 200, now)
          
          gain.gain.setValueAtTime(0.02, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015)
          
          osc.connect(gain)
          gain.connect(master)
          
          osc.start(now)
          osc.stop(now + 0.015)
          break
        }
        
        case "error": {
          // Gentle error indication - not jarring
          const osc = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc.type = "sine"
          osc2.type = "sine"
          
          // Minor second interval - slightly dissonant
          osc.frequency.setValueAtTime(NOTES.E4, now)
          osc2.frequency.setValueAtTime(311.13, now) // E♭4
          
          gain.gain.setValueAtTime(0.1, now)
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
          
          osc.connect(gain)
          osc2.connect(gain)
          gain.connect(master)
          
          osc.start(now)
          osc2.start(now)
          osc.stop(now + 0.3)
          osc2.stop(now + 0.3)
          break
        }
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
    chime: createSound("chime"),
    ambient: createSound("ambient"),
    typing: createSound("typing"),
    scroll: createSound("scroll"),
    error: createSound("error"),
  })
  
  // Throttle hover sounds
  const lastHoverTime = useRef(0)
  const lastScrollTime = useRef(0)
  
  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const newValue = !prev
      try {
        localStorage.setItem(SOUND_ENABLED_KEY, String(newValue))
      } catch {
        // localStorage not available
      }
      // Play a confirmation sound when enabling
      if (newValue) {
        setTimeout(() => {
          sounds.current.chime()
        }, 50)
      }
      return newValue
    })
  }, [])
  
  // Play sound if enabled with optional throttling
  const playSound = useCallback((type: SoundType, throttleMs = 0) => {
    if (!soundEnabled) return
    
    const now = Date.now()
    
    // Apply throttling for certain sounds
    if (type === "hover") {
      if (now - lastHoverTime.current < 50) return
      lastHoverTime.current = now
    }
    
    if (type === "scroll") {
      if (now - lastScrollTime.current < 100) return
      lastScrollTime.current = now
    }
    
    if (throttleMs > 0) {
      // Generic throttle
      return
    }
    
    sounds.current[type]()
  }, [soundEnabled])
  
  // Convenience methods
  const playClick = useCallback(() => playSound("click"), [playSound])
  const playHover = useCallback(() => playSound("hover"), [playSound])
  const playSuccess = useCallback(() => playSound("success"), [playSound])
  const playWhoosh = useCallback(() => playSound("whoosh"), [playSound])
  const playPop = useCallback(() => playSound("pop"), [playSound])
  const playChime = useCallback(() => playSound("chime"), [playSound])
  const playAmbient = useCallback(() => playSound("ambient"), [playSound])
  const playTyping = useCallback(() => playSound("typing"), [playSound])
  const playScroll = useCallback(() => playSound("scroll"), [playSound])
  const playError = useCallback(() => playSound("error"), [playSound])
  
  return {
    soundEnabled,
    toggleSound,
    playSound,
    playClick,
    playHover,
    playSuccess,
    playWhoosh,
    playPop,
    playChime,
    playAmbient,
    playTyping,
    playScroll,
    playError,
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
  playChime: () => void
  playAmbient: () => void
  playTyping: () => void
  playScroll: () => void
  playError: () => void
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
      playChime: () => {},
      playAmbient: () => {},
      playTyping: () => {},
      playScroll: () => {},
      playError: () => {},
    }
  }
  return context
}
