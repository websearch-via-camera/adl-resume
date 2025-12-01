import { useSound } from "@/hooks/useSoundEffects"
import { Volume2, VolumeX } from "lucide-react"

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound()
  
  const handleToggle = () => {
    toggleSound()
  }
  
  return (
    <button
      onClick={handleToggle}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-muted/80 group relative"
      aria-label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
      title={soundEnabled ? "Sound on" : "Sound off"}
    >
      {/* Animated icon swap */}
      <div className="relative w-5 h-5">
        <Volume2 
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            soundEnabled 
              ? "opacity-100 scale-100 text-primary" 
              : "opacity-0 scale-75"
          }`}
        />
        <VolumeX 
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            !soundEnabled 
              ? "opacity-100 scale-100 text-muted-foreground" 
              : "opacity-0 scale-75"
          }`}
        />
      </div>
      
      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <span className={`absolute inset-0 bg-primary/10 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl`} />
      </span>
      
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover text-popover-foreground rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border">
        {soundEnabled ? "Sound on" : "Sound off"}
      </span>
    </button>
  )
}
