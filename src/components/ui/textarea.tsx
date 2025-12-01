import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        "placeholder:text-muted-foreground/60 flex field-sizing-content min-h-16 w-full rounded-xl border px-4 py-3 text-base shadow-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // Glassmorphism base
        "bg-background/60 backdrop-blur-sm border-input/80",
        "dark:bg-input/30 dark:border-input/50",
        // Transition
        "transition-all duration-300 ease-out",
        // Hover state
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:bg-background/80",
        // Focus state - gradient border effect
        "focus-visible:border-primary focus-visible:bg-background",
        "focus-visible:shadow-[0_0_0_3px_oklch(from_var(--primary)_l_c_h_/_0.15),0_4px_12px_-2px_oklch(from_var(--primary)_l_c_h_/_0.1)]",
        // Error state
        "aria-invalid:border-destructive aria-invalid:shadow-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
