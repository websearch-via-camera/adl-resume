"use client"

import { type ComponentProps } from "react"

import { cn } from "@/lib/utils"

interface SeparatorProps extends ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}

// Native div-based separator - lighter alternative to @radix-ui/react-separator
// Radix Separator is just a styled <div> with accessibility attributes
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      data-slot="separator-root"
      data-orientation={orientation}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
