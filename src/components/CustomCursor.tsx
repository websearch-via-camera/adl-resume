import { useEffect, useRef, useState } from "react"

// Check for touch device once at module level
const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches

export function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Skip on touch devices
    if (isTouchDevice) return
    
    setMounted(true)
    const container = containerRef.current
    if (!container) return

    const cursor = container.querySelector<HTMLDivElement>('[data-cursor]')
    const ring = container.querySelector<HTMLDivElement>('[data-ring]')
    if (!cursor || !ring) return

    // Position state (no React re-renders)
    let cx = 0, cy = 0  // cursor position
    let rx = 0, ry = 0  // ring position (lerped)
    let isRunning = false
    let rafId: number | null = null

    // Use CSS classes for states (no re-renders)
    const addClass = (el: HTMLElement, cls: string) => el.classList.add(cls)
    const removeClass = (el: HTMLElement, cls: string) => el.classList.remove(cls)

    const animate = () => {
      // Direct style manipulation - fastest approach
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      
      // Lerp for smooth ring follow
      rx += (cx - rx) * 0.12
      ry += (cy - ry) * 0.12
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`

      rafId = requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(animate)
      }
    }

    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      container.classList.remove('opacity-0')
      startAnimation()

      // Check clickable - use tagName first (fastest), then closest
      const t = e.target as HTMLElement
      const tag = t.tagName
      const clickable = tag === 'A' || tag === 'BUTTON' || 
        t.closest('a,button,[role="button"],[data-clickable]') !== null

      if (clickable) {
        addClass(cursor, 'cursor-pointer-state')
        addClass(ring, 'ring-pointer-state')
      } else {
        removeClass(cursor, 'cursor-pointer-state')
        removeClass(ring, 'ring-pointer-state')
      }
    }

    const onDown = () => {
      addClass(cursor, 'cursor-click-state')
      addClass(ring, 'ring-click-state')
    }

    const onUp = () => {
      removeClass(cursor, 'cursor-click-state')
      removeClass(ring, 'ring-click-state')
    }

    const onLeave = () => {
      container.classList.add('opacity-0')
    }

    const onEnter = () => {
      container.classList.remove('opacity-0')
    }

    // Passive listeners for scroll performance
    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown, { passive: true })
    document.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave, { passive: true })
    document.addEventListener('mouseenter', onEnter, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Don't render anything on touch devices
  if (isTouchDevice || !mounted) return null

  return (
    <div ref={containerRef} className="opacity-0 transition-opacity duration-150">
      {/* Cursor dot - GPU accelerated */}
      <div
        data-cursor
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{ contain: 'layout style' }}
      >
        <div className="w-2 h-2 rounded-full bg-white cursor-dot" />
      </div>
      
      {/* Ring - GPU accelerated */}
      <div
        data-ring
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9998] mix-blend-difference will-change-transform"
        style={{ contain: 'layout style' }}
      >
        <div className="w-9 h-9 rounded-full border-2 border-white opacity-40 cursor-ring" />
      </div>

      {/* CSS-based state transitions */}
      <style>{`
        .cursor-dot {
          transition: transform 75ms ease-out;
        }
        .cursor-ring {
          transition: transform 150ms ease-out, opacity 150ms ease-out;
        }
        .cursor-pointer-state .cursor-dot {
          transform: scale(1.5);
        }
        .cursor-click-state .cursor-dot {
          transform: scale(0.75);
        }
        .ring-pointer-state .cursor-ring {
          transform: scale(1.25);
          opacity: 1;
        }
        .ring-click-state .cursor-ring {
          transform: scale(0.5);
          opacity: 0.3;
        }
      `}</style>
    </div>
  )
}
