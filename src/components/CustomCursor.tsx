import { useEffect, useState, useRef } from "react"

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(true)
  const [isClicking, setIsClicking] = useState(false)
  
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const ringPositionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    const updatePosition = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      setIsHidden(false)
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement
      const isClickable = !!(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        window.getComputedStyle(target).cursor === "pointer"
      )
      
      setIsPointer(isClickable)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)

    // Smooth animation loop using RAF
    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`
      }
      
      // Smooth follow for ring (lerp)
      ringPositionRef.current.x += (positionRef.current.x - ringPositionRef.current.x) * 0.15
      ringPositionRef.current.y += (positionRef.current.y - ringPositionRef.current.y) * 0.15
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPositionRef.current.x}px, ${ringPositionRef.current.y}px) translate(-50%, -50%)`
      }
      
      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener("mousemove", updatePosition, { passive: true })
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  if (isHidden) return null

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      >
        <div
          className={`rounded-full bg-white transition-all duration-75 ease-out ${
            isClicking ? "scale-75" : isPointer ? "scale-150" : "scale-100"
          }`}
          style={{
            width: "8px",
            height: "8px",
          }}
        />
      </div>
      
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference will-change-transform"
      >
        <div
          className={`rounded-full border-2 border-white transition-all duration-150 ${
            isClicking ? "scale-50 opacity-30" : isPointer ? "scale-125 opacity-100" : "opacity-40"
          }`}
          style={{
            width: "36px",
            height: "36px",
          }}
        />
      </div>
    </>
  )
}
