import { useEffect, useRef, useState } from "react"

// Trail point type for cursor trail effect
interface TrailPoint {
  x: number
  y: number
  age: number
}

export function CustomCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Check for touch device after mount
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches
    // Also respect reduced motion - the constant cursor following can be distracting
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (isTouchDevice || prefersReducedMotion) return
    
    setShouldRender(true)
  }, [])

  useEffect(() => {
    if (!shouldRender) return
    
    const container = containerRef.current
    if (!container) return

    const cursor = container.querySelector<HTMLDivElement>('[data-cursor]')
    const ring = container.querySelector<HTMLDivElement>('[data-ring]')
    const glow = container.querySelector<HTMLDivElement>('[data-glow]')
    const trailContainer = container.querySelector<HTMLDivElement>('[data-trail]')
    if (!cursor || !ring || !glow || !trailContainer) return

    // Position state (no React re-renders)
    let cx = 0, cy = 0  // cursor position
    let rx = 0, ry = 0  // ring position (lerped)
    let gx = 0, gy = 0  // glow position (slower lerp)
    let rafId: number | null = null
    let isHoveringClickable = false
    const velocity = { x: 0, y: 0 }
    const lastPos = { x: 0, y: 0 }
    
    // Trail points for ribbon effect
    const trail: TrailPoint[] = []
    const TRAIL_LENGTH = 8
    const TRAIL_DECAY = 0.92

    // Use CSS classes for states (no re-renders)
    const addClass = (el: HTMLElement, cls: string) => el.classList.add(cls)
    const removeClass = (el: HTMLElement, cls: string) => el.classList.remove(cls)

    const animate = () => {
      // Calculate velocity for dynamic effects
      velocity.x = cx - lastPos.x
      velocity.y = cy - lastPos.y
      lastPos.x = cx
      lastPos.y = cy
      
      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
      const stretchX = Math.min(speed * 0.15, 0.5)
      const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI)
      
      // Direct style manipulation - fastest approach
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) rotate(${angle}deg) scaleX(${1 + stretchX})`
      
      // Lerp for smooth ring follow with velocity-based scaling
      rx += (cx - rx) * 0.12
      ry += (cy - ry) * 0.12
      const ringScale = isHoveringClickable ? 1.5 : 1 + Math.min(speed * 0.02, 0.3)
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${ringScale})`
      
      // Even slower lerp for ambient glow
      gx += (cx - gx) * 0.06
      gy += (cy - gy) * 0.06
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`
      glow.style.opacity = isHoveringClickable ? '0.4' : '0.2'
      
      // Update trail
      if (speed > 2) {
        trail.unshift({ x: cx, y: cy, age: 1 })
        if (trail.length > TRAIL_LENGTH) trail.pop()
      }
      
      // Decay and render trail
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age *= TRAIL_DECAY
        if (trail[i].age < 0.01) {
          trail.splice(i, 1)
        }
      }
      
      // Render trail points
      const trailDots = trailContainer.children
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const dot = trailDots[i] as HTMLElement
        if (trail[i]) {
          dot.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0) scale(${trail[i].age})`
          dot.style.opacity = String(trail[i].age * 0.5)
        } else {
          dot.style.opacity = '0'
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    // Start animation loop
    rafId = requestAnimationFrame(animate)

    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      container.classList.remove('opacity-0')

      // Check clickable - use tagName first (fastest), then closest
      const t = e.target as HTMLElement
      const tag = t.tagName
      const clickable = tag === 'A' || tag === 'BUTTON' || 
        t.closest('a,button,[role="button"],[data-clickable]') !== null

      isHoveringClickable = clickable
      
      if (clickable) {
        addClass(cursor, 'cursor-pointer-state')
        addClass(ring, 'ring-pointer-state')
        addClass(glow, 'glow-pointer-state')
      } else {
        removeClass(cursor, 'cursor-pointer-state')
        removeClass(ring, 'ring-pointer-state')
        removeClass(glow, 'glow-pointer-state')
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
  }, [shouldRender])

  // Don't render anything until we've confirmed it's not a touch device
  if (!shouldRender) return null

  return (
    <div ref={containerRef} className="opacity-0 transition-opacity duration-150">
      {/* Trail dots - GPU accelerated */}
      <div data-trail className="fixed top-0 left-0 pointer-events-none z-[9996]" style={{ contain: 'layout style' }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/60 will-change-transform"
            style={{ opacity: 0 }}
          />
        ))}
      </div>
      
      {/* Ambient glow - slowest follow */}
      <div
        data-glow
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9997] will-change-transform"
        style={{ contain: 'layout style' }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl cursor-glow" />
      </div>
      
      {/* Cursor dot - GPU accelerated */}
      <div
        data-cursor
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{ contain: 'layout style' }}
      >
        <div className="w-3 h-3 rounded-full bg-white cursor-dot" />
      </div>
      
      {/* Ring - GPU accelerated */}
      <div
        data-ring
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9998] will-change-transform"
        style={{ contain: 'layout style' }}
      >
        <div className="w-10 h-10 rounded-full border border-primary/50 cursor-ring backdrop-blur-[1px]" />
      </div>

      {/* CSS-based state transitions */}
      <style>{`
        .cursor-dot {
          transition: transform 50ms ease-out, background-color 150ms ease;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        .cursor-ring {
          transition: transform 100ms ease-out, opacity 150ms ease-out, border-color 200ms ease;
        }
        .cursor-glow {
          transition: transform 200ms ease-out, opacity 300ms ease;
        }
        .cursor-pointer-state .cursor-dot {
          transform: scale(0.5);
          background: var(--primary);
          box-shadow: 0 0 20px var(--primary);
        }
        .cursor-click-state .cursor-dot {
          transform: scale(0.3);
        }
        .ring-pointer-state .cursor-ring {
          border-color: var(--primary);
          border-width: 2px;
          box-shadow: 0 0 20px var(--primary), inset 0 0 20px var(--primary);
        }
        .ring-click-state .cursor-ring {
          transform: scale(0.8);
          opacity: 0.8;
        }
        .glow-pointer-state .cursor-glow {
          transform: scale(1.5);
        }
      `}</style>
    </div>
  )
}
