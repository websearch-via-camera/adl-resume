"use client"

import { type ComponentProps } from "react"

import { cn } from "@/lib/utils"

// Native HTML label - lighter alternative to @radix-ui/react-label
// Radix Label is just a styled <label> with no additional functionality needed
function Label({
  className,
  ...props
}: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
