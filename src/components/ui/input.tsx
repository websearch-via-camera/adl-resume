import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-xl border px-4 py-2 text-base shadow-sm outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Glassmorphism base
        "bg-background/60 backdrop-blur-sm border-input/80",
        "dark:bg-input/30 dark:border-input/50",
        // Transition
        "transition-all duration-300 ease-out",
        // Hover state - subtle lift and glow
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:bg-background/80",
        "hover:-translate-y-px",
        // Focus state - gradient border effect via shadow
        "focus-visible:border-primary focus-visible:bg-background",
        "focus-visible:shadow-[0_0_0_3px_oklch(from_var(--primary)_l_c_h_/_0.15),0_4px_12px_-2px_oklch(from_var(--primary)_l_c_h_/_0.1)]",
        "focus-visible:translate-y-0",
        // Error state
        "aria-invalid:border-destructive aria-invalid:shadow-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
