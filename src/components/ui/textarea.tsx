import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "transition-all duration-200 ease-out",
        "hover:border-muted-foreground/50 hover:shadow-sm",
        "focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px] focus-visible:shadow-md focus-visible:bg-background",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:animate-shake",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
