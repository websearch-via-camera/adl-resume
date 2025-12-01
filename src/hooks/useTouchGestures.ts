import { useRef, useEffect, useCallback, RefObject } from "react"

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onLongPress?: () => void
  threshold?: number // minimum distance for swipe
  longPressDelay?: number
  enabled?: boolean // allow disabling gestures
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  isActive: boolean
}

/**
 * Hook for touch gesture detection
 * Supports swipe (4 directions), tap, and long press
 * Performance optimized with passive listeners
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
  })
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onLongPress,
    threshold = 50,
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
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        isActive: true,
      }

      // Set up long press detection
      if (onLongPress) {
        clearLongPress()
        longPressTimer.current = setTimeout(() => {
          if (touchState.current.isActive) {
            onLongPress()
            // Provide haptic feedback if available
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
      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY
      const deltaTime = Date.now() - touchState.current.startTime
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Tap detection (quick touch with minimal movement)
      if (distance < 10 && deltaTime < 300 && onTap) {
        onTap()
        return
      }

      // Swipe detection
      if (distance >= threshold && deltaTime < 500) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)

        // Determine swipe direction
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
            if (navigator.vibrate) navigator.vibrate(30)
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
            if (navigator.vibrate) navigator.vibrate(30)
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
            if (navigator.vibrate) navigator.vibrate(30)
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
            if (navigator.vibrate) navigator.vibrate(30)
          }
        }
      }
    },
    [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, threshold, clearLongPress]
  )

  const handleTouchCancel = useCallback(() => {
    clearLongPress()
    touchState.current.isActive = false
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
