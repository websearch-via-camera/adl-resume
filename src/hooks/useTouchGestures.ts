import { useRef, useEffect, useCallback, RefObject } from "react"

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onLongPress?: () => void
  threshold?: number // minimum distance for swipe
  velocityThreshold?: number // minimum velocity (px/ms) for swipe
  directionRatio?: number // how much more horizontal than vertical (1.0 = equal, 1.5 = 50% more)
  maxSwipeTime?: number // max time in ms for a swipe
  longPressDelay?: number
  enabled?: boolean // allow disabling gestures
}

interface TouchPoint {
  x: number
  y: number
  time: number
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  isActive: boolean
  // Track last few points for velocity calculation
  points: TouchPoint[]
}

/**
 * Hook for touch gesture detection
 * Supports swipe (4 directions), tap, and long press
 * Performance optimized with passive listeners
 * 
 * Improved swipe detection:
 * - Velocity-based detection (fast swipes need less distance)
 * - Tracks multiple touch points for accurate velocity
 * - More forgiving direction detection
 */
export function useTouchGestures<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T | null>,
  config: SwipeConfig
) {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isActive: false,
    points: [],
  })
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    threshold = 30, // Lower default - velocity helps
    velocityThreshold = 0.3, // px/ms - quite sensitive
    directionRatio = 1.3, // 30% more in primary direction
    maxSwipeTime = 400, // Faster max time
    longPressDelay = 500,
    enabled = true,
  } = config

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return
      
      const touch = e.touches[0]
      const now = Date.now()
      
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: now,
        isActive: true,
        points: [{ x: touch.clientX, y: touch.clientY, time: now }],
      }

      // Set up long press detection
      if (onLongPress) {
        clearLongPress()
        longPressTimer.current = setTimeout(() => {
          if (touchState.current.isActive) {
            onLongPress()
            if (navigator.vibrate) {
              navigator.vibrate(50)
            }
            touchState.current.isActive = false
          }
        }, longPressDelay)
      }
    },
    [enabled, onLongPress, longPressDelay, clearLongPress]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchState.current.isActive) return

      const touch = e.touches[0]
      const now = Date.now()
      
      // Track points for velocity (keep last 5)
      touchState.current.points.push({ x: touch.clientX, y: touch.clientY, time: now })
      if (touchState.current.points.length > 5) {
        touchState.current.points.shift()
      }

      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Cancel long press if user moves
      if (distance > 10) {
        clearLongPress()
      }
    },
    [enabled, clearLongPress]
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      clearLongPress()

      if (!enabled || !touchState.current.isActive) return
      touchState.current.isActive = false

      const touch = e.changedTouches[0]
      const now = Date.now()
      
      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY
      const deltaTime = now - touchState.current.startTime
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Tap detection (quick touch with minimal movement)
      if (distance < 10 && deltaTime < 300 && onTap) {
        onTap()
        return
      }

      // Calculate velocity from recent points for more accurate detection
      let velocityX = 0
      let velocityY = 0
      const points = touchState.current.points
      
      if (points.length >= 2) {
        // Use last 2-3 points for velocity (more recent = more accurate)
        const recentPoints = points.slice(-3)
        const first = recentPoints[0]
        const last = recentPoints[recentPoints.length - 1]
        const dt = last.time - first.time
        
        if (dt > 0) {
          velocityX = (last.x - first.x) / dt
          velocityY = (last.y - first.y) / dt
        }
      }
      
      // Fallback to overall velocity
      if (velocityX === 0 && velocityY === 0 && deltaTime > 0) {
        velocityX = deltaX / deltaTime
        velocityY = deltaY / deltaTime
      }

      const absVelocityX = Math.abs(velocityX)
      const absVelocityY = Math.abs(velocityY)
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Swipe detection criteria:
      // 1. Time must be under max
      // 2. Either distance OR velocity must exceed threshold
      // 3. Movement must be primarily in one direction
      const isWithinTime = deltaTime <= maxSwipeTime
      const hasEnoughDistance = distance >= threshold
      const hasEnoughVelocity = Math.max(absVelocityX, absVelocityY) >= velocityThreshold
      const isValidSwipe = isWithinTime && (hasEnoughDistance || hasEnoughVelocity)

      if (isValidSwipe) {
        // Determine if horizontal or vertical
        // Use both distance ratio AND velocity ratio
        const distanceRatio = absX / (absY || 0.001)
        const velocityRatio = absVelocityX / (absVelocityY || 0.001)
        
        // Average the ratios for better detection
        const avgRatio = (distanceRatio + velocityRatio) / 2
        const isHorizontal = avgRatio >= (1 / directionRatio)
        const isVertical = avgRatio <= directionRatio

        if (isHorizontal && absX >= absY / directionRatio) {
          // Horizontal swipe - check both delta direction and velocity direction
          // Prefer velocity direction for fast flicks
          const effectiveDirection = absVelocityX > 0.5 ? velocityX : deltaX
          
          if (effectiveDirection < 0 && onSwipeLeft) {
            onSwipeLeft()
            if (navigator.vibrate) navigator.vibrate(20)
          } else if (effectiveDirection > 0 && onSwipeRight) {
            onSwipeRight()
            if (navigator.vibrate) navigator.vibrate(20)
          }
        } else if (isVertical && absY >= absX / directionRatio) {
          // Vertical swipe
          const effectiveDirection = absVelocityY > 0.5 ? velocityY : deltaY
          
          if (effectiveDirection < 0 && onSwipeUp) {
            onSwipeUp()
            if (navigator.vibrate) navigator.vibrate(20)
          } else if (effectiveDirection > 0 && onSwipeDown) {
            onSwipeDown()
            if (navigator.vibrate) navigator.vibrate(20)
          }
        }
      }
    },
    [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, threshold, velocityThreshold, directionRatio, maxSwipeTime, clearLongPress]
  )

  const handleTouchCancel = useCallback(() => {
    clearLongPress()
    touchState.current.isActive = false
    touchState.current.points = []
  }, [clearLongPress])

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    // Use passive listeners for better scroll performance
    element.addEventListener("touchstart", handleTouchStart, { passive: true })
    element.addEventListener("touchmove", handleTouchMove, { passive: true })
    element.addEventListener("touchend", handleTouchEnd, { passive: true })
    element.addEventListener("touchcancel", handleTouchCancel, { passive: true })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
      element.removeEventListener("touchcancel", handleTouchCancel)
      clearLongPress()
    }
  }, [ref, enabled, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel, clearLongPress])
}

/**
 * Hook for pull-to-refresh gesture
 */
export function usePullToRefresh(onRefresh: () => void, threshold = 80) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const pulling = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY
        pulling.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return
      
      const currentY = e.touches[0].clientY
      const diff = currentY - startY.current

      if (diff > 0 && window.scrollY === 0) {
        // User is pulling down at top of page
        const progress = Math.min(diff / threshold, 1)
        container.style.transform = `translateY(${Math.min(diff * 0.4, 60)}px)`
        container.style.opacity = String(1 - progress * 0.2)
      }
    }

    const handleTouchEnd = () => {
      if (!pulling.current) return
      pulling.current = false

      const diff = parseFloat(containerRef.current?.style.transform.match(/translateY\((.+)px\)/)?.[1] || "0")
      
      if (diff > threshold * 0.4) {
        onRefresh()
        if (navigator.vibrate) navigator.vibrate([30, 50, 30])
      }

      // Reset with transition
      container.style.transition = "transform 0.3s ease, opacity 0.3s ease"
      container.style.transform = ""
      container.style.opacity = ""
      
      setTimeout(() => {
        container.style.transition = ""
      }, 300)
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [onRefresh, threshold])

  return containerRef
}

/**
 * Utility: Trigger haptic feedback
 */
export function hapticFeedback(type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light") {
  if (!navigator.vibrate) return

  const patterns: Record<typeof type, number | number[]> = {
    light: 10,
    medium: 30,
    heavy: 50,
    success: [30, 50, 30],
    warning: [50, 30, 50],
    error: [100, 50, 100],
  }

  navigator.vibrate(patterns[type])
}
