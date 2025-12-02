import { ComponentProps, isValidElement, cloneElement, type ReactElement, useRef, useCallback } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/useSoundEffects"

// Native Slot implementation - removes @radix-ui/react-slot dependency
// Merges props onto the child element when asChild is true
function Slot({ children, ...props }: ComponentProps<"span"> & { children?: React.ReactNode }) {
  if (isValidElement(children)) {
    const childElement = children as ReactElement<{ className?: string } & Record<string, unknown>>
    return cloneElement(childElement, {
      ...props,
      ...childElement.props,
      className: cn((props as { className?: string }).className, childElement.props.className),
    })
  }
  return <span {...props}>{children}</span>
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.97] cursor-pointer select-none [&_svg]:transition-transform [&_svg]:duration-200 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 hover:from-primary hover:to-accent/80 active:shadow-sm active:translate-y-0 [&:hover_svg]:scale-110 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30 hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 [&:hover_svg]:rotate-12",
        outline:
          "border-2 bg-background/80 backdrop-blur-sm shadow-sm hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:hover:border-ring/50 [&:hover_svg]:scale-110",
        secondary:
          "bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-sm hover:bg-secondary/90 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 active:translate-y-0 [&:hover_svg]:scale-110",
        ghost:
          "hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent/60 hover:text-accent-foreground hover:shadow-sm dark:hover:from-accent/50 dark:hover:to-accent/30 active:bg-accent [&:hover_svg]:scale-110 hover:backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 decoration-2 decoration-primary/50 hover:decoration-primary [&:hover_svg]:translate-x-0.5",
        glass: "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-foreground shadow-lg shadow-black/5 hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-xl hover:-translate-y-0.5 hover:border-primary/30 [&:hover_svg]:scale-110",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  onMouseDown,
  children,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  const { playClick } = useSound()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Ripple effect on click
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    
    const rect = button.getBoundingClientRect()
    const ripple = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: button-ripple 600ms ease-out forwards;
      pointer-events: none;
      z-index: 1;
    `
    
    button.appendChild(ripple)
    
    setTimeout(() => ripple.remove(), 600)
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)
    onMouseDown?.(e)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick()
    onClick?.(e)
  }

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={onClick}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </Comp>
    )
  }

  return (
    <button
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button, buttonVariants }
