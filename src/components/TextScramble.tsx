import { useState, useEffect, useRef, useCallback, memo } from "react"
import { cn } from "@/lib/utils"

interface TextScrambleProps {
  /** The final text to display */
  text: string
  /** Trigger scramble on mount */
  scrambleOnMount?: boolean
  /** Trigger scramble on hover */
  scrambleOnHover?: boolean
  /** Trigger scramble when in view */
  scrambleOnView?: boolean
  /** Characters to use for scramble effect */
  characters?: string
  /** Speed of decode in ms per character */
  speed?: number
  /** Delay before starting decode */
  delay?: number
  /** Additional className */
  className?: string
  /** HTML tag to render */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  /** Disable the scramble effect entirely */
  disabled?: boolean
}

// Characters for the scramble effect - mix of symbols and letters for cyber aesthetic
const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ"

/**
 * Award-winning text scramble/decode effect
 * Creates a cyber/hacker aesthetic as text decodes character by character
 * Performance optimized with RAF and memo
 */
export const TextScramble = memo(function TextScramble({
  text,
  scrambleOnMount = true,
  scrambleOnHover = false,
  scrambleOnView = false,
  characters = DEFAULT_CHARS,
  speed = 50,
  delay = 0,
  className,
  as: Tag = "span",
  disabled = false,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(scrambleOnMount && !disabled ? "" : text)
  const [isDecoding, setIsDecoding] = useState(false)
  const [isComplete, setIsComplete] = useState(!scrambleOnMount || disabled)
  const frameRef = useRef<number>(0)
  const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number; char?: string }>>([])
  const frameCountRef = useRef(0)
  const elementRef = useRef<HTMLElement>(null)
  const hasAnimatedRef = useRef(disabled)

  // Scramble decode algorithm
  const decode = useCallback(() => {
    if (disabled) return
    if (hasAnimatedRef.current && !scrambleOnHover) return
    
    setIsDecoding(true)
    setIsComplete(false)
    hasAnimatedRef.current = true
    
    const oldText = displayText || ""
    const newText = text
    const length = Math.max(oldText.length, newText.length)
    
    // Build queue of character transitions
    const queue: typeof queueRef.current = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      queue.push({ from, to, start, end })
    }
    queueRef.current = queue
    frameCountRef.current = 0
    
    const update = () => {
      let output = ""
      let complete = 0
      
      for (let i = 0; i < queueRef.current.length; i++) {
        const { from, to, start, end } = queueRef.current[i]
        let { char } = queueRef.current[i]
        
        if (frameCountRef.current >= end) {
          complete++
          output += to
        } else if (frameCountRef.current >= start) {
          // Show random character during transition
          if (!char || Math.random() < 0.28) {
            char = characters[Math.floor(Math.random() * characters.length)]
            queueRef.current[i].char = char
          }
          output += `<span class="text-primary/70">${char}</span>`
        } else {
          output += from
        }
      }
      
      setDisplayText(output)
      
      if (complete < queueRef.current.length) {
        frameCountRef.current++
        frameRef.current = requestAnimationFrame(update)
      } else {
        // Animation complete - set final text and mark as complete
        setDisplayText(text)
        setIsDecoding(false)
        setIsComplete(true)
      }
    }
    
    // Start with delay
    setTimeout(() => {
      frameRef.current = requestAnimationFrame(update)
    }, delay)
  }, [text, displayText, characters, delay, scrambleOnHover, disabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  // Scramble on mount
  useEffect(() => {
    if (scrambleOnMount && !hasAnimatedRef.current && !disabled) {
      decode()
    }
  }, [scrambleOnMount, decode, disabled])

  // Scramble on view (IntersectionObserver)
  useEffect(() => {
    if (!scrambleOnView || hasAnimatedRef.current || disabled) return
    
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          decode()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [scrambleOnView, decode, disabled])

  // Handle hover
  const handleMouseEnter = useCallback(() => {
    if (scrambleOnHover && !isDecoding && !disabled) {
      hasAnimatedRef.current = false
      setDisplayText("")
      setTimeout(() => decode(), 50)
    }
  }, [scrambleOnHover, isDecoding, decode, disabled])

  // When complete or disabled, render as plain text to ensure visibility
  // When decoding, use dangerouslySetInnerHTML for the animated characters
  if (isComplete || disabled) {
    return (
      <Tag
        ref={elementRef as React.RefObject<HTMLHeadingElement>}
        className={cn("relative inline-block", className)}
        onMouseEnter={handleMouseEnter}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {text}
      </Tag>
    )
  }

  return (
    <Tag
      ref={elementRef as React.RefObject<HTMLHeadingElement>}
      className={cn(
        "relative inline-block",
        isDecoding && "select-none",
        className
      )}
      onMouseEnter={handleMouseEnter}
      dangerouslySetInnerHTML={{ __html: displayText }}
      style={{
        fontVariantNumeric: "tabular-nums", // Prevent layout shift
      }}
    />
  )
})

/**
 * Hook version for custom implementations
 */
export function useTextScramble(
  text: string,
  options: {
    characters?: string
    speed?: number
    delay?: number
  } = {}
) {
  const { characters = DEFAULT_CHARS, delay = 0 } = options
  const [displayText, setDisplayText] = useState("")
  const [isDecoding, setIsDecoding] = useState(false)
  const frameRef = useRef<number>(0)

  const scramble = useCallback(() => {
    setIsDecoding(true)
    
    const length = text.length
    const queue: Array<{ to: string; start: number; end: number; char?: string }> = []
    
    for (let i = 0; i < length; i++) {
      const to = text[i]
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      queue.push({ to, start, end })
    }
    
    let frame = 0
    
    const update = () => {
      let output = ""
      let complete = 0
      
      for (let i = 0; i < queue.length; i++) {
        const { to, start, end } = queue[i]
        let { char } = queue[i]
        
        if (frame >= end) {
          complete++
          output += to
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = characters[Math.floor(Math.random() * characters.length)]
            queue[i].char = char
          }
          output += char
        } else {
          output += ""
        }
      }
      
      setDisplayText(output)
      
      if (complete < queue.length) {
        frame++
        frameRef.current = requestAnimationFrame(update)
      } else {
        setDisplayText(text)
        setIsDecoding(false)
      }
    }
    
    setTimeout(() => {
      frameRef.current = requestAnimationFrame(update)
    }, delay)
  }, [text, characters, delay])

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return { displayText, isDecoding, scramble }
}
