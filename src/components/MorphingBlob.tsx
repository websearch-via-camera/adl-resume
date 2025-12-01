import { useEffect, useRef, memo } from "react"
import { cn } from "@/lib/utils"

interface MorphingBlobProps {
  /** Size of the blob */
  size?: number | string
  /** Primary color (CSS color or oklch) */
  color?: string
  /** Secondary color for gradient */
  secondaryColor?: string
  /** Animation speed multiplier (1 = normal) */
  speed?: number
  /** Blur amount in px */
  blur?: number
  /** Opacity (0-1) */
  opacity?: number
  /** Additional className */
  className?: string
  /** Position style */
  style?: React.CSSProperties
}

/**
 * Award-winning morphing blob background element
 * Uses CSS custom properties and GPU-accelerated transforms
 * Pure CSS animation - no JS animation loop for maximum performance
 */
export const MorphingBlob = memo(function MorphingBlob({
  size = 400,
  color = "oklch(0.52 0.17 38)",
  secondaryColor = "oklch(0.42 0.14 12)",
  speed = 1,
  blur = 60,
  opacity = 0.15,
  className,
  style,
}: MorphingBlobProps) {
  const blobRef = useRef<HTMLDivElement>(null)

  // Set CSS custom properties for dynamic values
  useEffect(() => {
    if (blobRef.current) {
      const duration = 20 / speed
      blobRef.current.style.setProperty("--blob-duration", `${duration}s`)
      blobRef.current.style.setProperty("--blob-color-1", color)
      blobRef.current.style.setProperty("--blob-color-2", secondaryColor)
    }
  }, [speed, color, secondaryColor])

  return (
    <div
      ref={blobRef}
      className={cn(
        "absolute pointer-events-none select-none",
        "animate-blob-morph",
        className
      )}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        background: `linear-gradient(135deg, var(--blob-color-1, ${color}), var(--blob-color-2, ${secondaryColor}))`,
        filter: `blur(${blur}px)`,
        opacity,
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        willChange: "border-radius, transform",
        contain: "layout style paint",
        ...style,
      }}
      aria-hidden="true"
    />
  )
})

/**
 * Pre-configured blob background with multiple blobs
 * Creates a dynamic, award-winning ambient background
 */
export const BlobBackground = memo(function BlobBackground({
  className,
  variant = "default",
}: {
  className?: string
  variant?: "default" | "subtle" | "vibrant" | "minimal"
}) {
  const configs = {
    default: [
      { size: 500, color: "oklch(0.52 0.17 38)", secondaryColor: "oklch(0.62 0.15 50)", blur: 80, opacity: 0.12, style: { top: "-10%", left: "-10%" } },
      { size: 400, color: "oklch(0.42 0.14 12)", secondaryColor: "oklch(0.52 0.12 25)", blur: 70, opacity: 0.10, style: { bottom: "-5%", right: "-5%" }, speed: 0.8 },
      { size: 300, color: "oklch(0.58 0.12 65)", secondaryColor: "oklch(0.48 0.14 45)", blur: 60, opacity: 0.08, style: { top: "40%", right: "20%" }, speed: 1.2 },
    ],
    subtle: [
      { size: 600, color: "oklch(0.52 0.08 38)", secondaryColor: "oklch(0.58 0.06 50)", blur: 100, opacity: 0.06, style: { top: "-15%", left: "-15%" } },
      { size: 500, color: "oklch(0.48 0.06 12)", secondaryColor: "oklch(0.54 0.04 25)", blur: 90, opacity: 0.05, style: { bottom: "-10%", right: "-10%" }, speed: 0.7 },
    ],
    vibrant: [
      { size: 450, color: "oklch(0.65 0.25 38)", secondaryColor: "oklch(0.55 0.22 12)", blur: 70, opacity: 0.18, style: { top: "-5%", left: "-5%" }, speed: 1.1 },
      { size: 380, color: "oklch(0.58 0.20 280)", secondaryColor: "oklch(0.52 0.18 320)", blur: 65, opacity: 0.15, style: { bottom: "10%", right: "-5%" }, speed: 0.9 },
      { size: 320, color: "oklch(0.62 0.18 160)", secondaryColor: "oklch(0.56 0.15 200)", blur: 55, opacity: 0.12, style: { top: "50%", left: "30%" }, speed: 1.3 },
    ],
    minimal: [
      { size: 700, color: "oklch(0.52 0.05 38)", secondaryColor: "oklch(0.52 0.05 38)", blur: 120, opacity: 0.04, style: { top: "-20%", left: "-20%" }, speed: 0.5 },
    ],
  }

  const blobs = configs[variant]

  return (
    <div 
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none -z-10",
        className
      )}
      aria-hidden="true"
    >
      {blobs.map((blob, index) => (
        <MorphingBlob key={index} {...blob} />
      ))}
    </div>
  )
})

/**
 * Interactive blob that responds to mouse position
 * Uses CSS custom properties for smooth GPU-accelerated movement
 */
export const InteractiveBlob = memo(function InteractiveBlob({
  size = 300,
  color = "oklch(0.52 0.17 38)",
  secondaryColor = "oklch(0.42 0.14 12)",
  blur = 50,
  opacity = 0.2,
  strength = 0.1,
  className,
}: MorphingBlobProps & { strength?: number }) {
  const blobRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate target position based on mouse
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      targetRef.current = {
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      }
    }

    // Smooth animation loop with lerp
    const animate = () => {
      const blob = blobRef.current
      if (!blob) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      // Lerp towards target
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.05
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.05

      blob.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [strength])

  return (
    <div
      ref={blobRef}
      className={cn(
        "absolute pointer-events-none select-none animate-blob-morph",
        className
      )}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
        filter: `blur(${blur}px)`,
        opacity,
        borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
        willChange: "transform, border-radius",
        contain: "layout style paint",
      }}
      aria-hidden="true"
    />
  )
})
