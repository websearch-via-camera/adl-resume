import { ComponentProps, useRef, useState, useEffect } from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: ComponentProps<"div">) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      data-slot="card"
      className={cn(
        // Base styles
        "bg-card/95 text-card-foreground flex flex-col gap-6 rounded-2xl border py-6",
        // Glassmorphism
        "backdrop-blur-sm shadow-sm",
        "dark:bg-card/80",
        // Sophisticated hover with gradient border
        "relative transition-all duration-300 ease-out overflow-hidden",
        "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
        "hover:border-primary/20",
        "dark:hover:shadow-primary/10",
        // Gradient border on hover
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-br before:from-primary/40 before:via-accent/20 before:to-primary/40",
        "before:-z-10 before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-100",
        // Inner glow
        "after:absolute after:inset-0 after:rounded-2xl after:-z-20",
        "after:bg-gradient-to-br after:from-primary/5 after:to-accent/5",
        "after:opacity-0 after:transition-opacity after:duration-300",
        "hover:after:opacity-100",
        className
      )}
      {...props}
    >
      {/* Mouse-following spotlight effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, oklch(from var(--primary) l c h / 0.06), transparent 40%)`,
          }}
        />
      )}
      {props.children}
    </div>
  )
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 relative z-10",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 relative z-10", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6 relative z-10", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
