import { motion, useInView, useAnimation, Variants } from "framer-motion"
import { useRef, useEffect, ReactNode, useState } from "react"
import { useA11y } from "./A11yProvider"

// Animation variants for different reveal effects
export const revealVariants = {
  // Fade up - classic reveal
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Fade down
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Fade left
  fadeLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Fade right
  fadeRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Scale up - zoom in effect
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Blur in - glassmorphism reveal
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  
  // Slide in with rotation
  slideRotate: {
    hidden: { opacity: 0, x: -30, rotate: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Flip in
  flipIn: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: { 
      opacity: 1, 
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Stagger children container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },
  
  // Stagger item
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  },
  
  // Card hover lift effect
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -4,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  
  // Instant (no animation - for reduced motion)
  instant: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  }
} as const

export type RevealType = keyof typeof revealVariants

interface ScrollRevealProps {
  children: ReactNode
  variant?: RevealType
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number | "some" | "all"
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "main" | "nav"
}

/**
 * ScrollReveal - Animated reveal component triggered on scroll
 * Respects user's reduced motion preference
 */
export function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration,
  className = "",
  once = true,
  amount = 0.3,
  as = "div"
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { once, amount })
  const { prefersReducedMotion } = useA11y()
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])
  
  // Use instant variant if reduced motion is preferred
  const selectedVariant = prefersReducedMotion ? revealVariants.instant : revealVariants[variant]
  
  // Custom transition with delay and duration overrides
  const customTransition = {
    delay: prefersReducedMotion ? 0 : delay,
    duration: prefersReducedMotion ? 0 : (duration || undefined)
  }
  
  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div
  
  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedVariant as Variants}
      transition={customTransition}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
  amount?: number | "some" | "all"
}

/**
 * StaggerContainer - Container that staggers children animations
 */
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = true,
  amount = 0.2
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(ref, { once, amount })
  const { prefersReducedMotion } = useA11y()
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])
  
  const containerVariants = prefersReducedMotion 
    ? revealVariants.instant
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  variant?: RevealType
}

/**
 * StaggerItem - Child component for StaggerContainer
 */
export function StaggerItem({ 
  children, 
  className = "",
  variant = "staggerItem"
}: StaggerItemProps) {
  const { prefersReducedMotion } = useA11y()
  
  const itemVariants = prefersReducedMotion 
    ? revealVariants.instant 
    : revealVariants[variant]
  
  return (
    <motion.div variants={itemVariants as Variants} className={className}>
      {children}
    </motion.div>
  )
}

interface ParallaxProps {
  children: ReactNode
  offset?: number
  className?: string
}

/**
 * Parallax - Parallax scroll effect
 */
export function Parallax({ children, offset = 50, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: offset }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

interface TextRevealProps {
  text: string
  className?: string
  charDelay?: number
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
}

/**
 * TextReveal - Reveals text character by character
 */
export function TextReveal({ 
  text, 
  className = "", 
  charDelay = 0.03,
  as = "span"
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    if (as === "span") return <span className={className}>{text}</span>
    if (as === "p") return <p className={className}>{text}</p>
    if (as === "h1") return <h1 className={className}>{text}</h1>
    if (as === "h2") return <h2 className={className}>{text}</h2>
    if (as === "h3") return <h3 className={className}>{text}</h3>
    if (as === "h4") return <h4 className={className}>{text}</h4>
    return <span className={className}>{text}</span>
  }
  
  const words = text.split(" ")
  
  return (
    <span ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split("").map((char, charIndex) => {
            const totalIndex = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length + 1, 0) + charIndex
            
            return (
              <motion.span
                key={charIndex}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.3,
                  delay: totalIndex * charDelay,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * CountUp - Animated number counter
 */
export function CountUp({ 
  end, 
  duration = 2, 
  prefix = "", 
  suffix = "",
  className = "" 
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    return <span className={className}>{prefix}{end}{suffix}</span>
  }
  
  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      >
        {isInView && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <AnimatedCounter end={end} duration={duration} isInView={isInView} />
          </motion.span>
        )}
      </motion.span>
      {suffix}
    </span>
  )
}

function AnimatedCounter({ end, duration, isInView }: { end: number; duration: number; isInView: boolean }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isInView) return
    
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isInView])
  
  return <>{count}</>
}

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * PageTransition - Wrapper for page-level transitions
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * SectionTransition - Wrapper for section-level transitions with intersection observer
 */
export function SectionTransition({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * HoverCard - Card with hover animation
 */
export function HoverCard({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string
}) {
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <motion.div
      className={className}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={revealVariants.cardHover}
    >
      {children}
    </motion.div>
  )
}

/**
 * AnimatedBadge - Badge with entrance animation
 */
export function AnimatedBadge({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { prefersReducedMotion } = useA11y()
  
  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
