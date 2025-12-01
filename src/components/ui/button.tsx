import { ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.97] cursor-pointer select-none [&_svg]:transition-transform [&_svg]:duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 hover:from-primary hover:to-accent/80 active:shadow-sm active:translate-y-0 [&:hover_svg]:scale-110",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/30 hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 [&:hover_svg]:rotate-12",
        outline:
          "border-2 bg-background shadow-sm hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:text-accent-foreground hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 dark:hover:border-ring/50 [&:hover_svg]:scale-110",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 active:translate-y-0 [&:hover_svg]:scale-110",
        ghost:
          "hover:bg-gradient-to-r hover:from-accent/80 hover:to-accent/60 hover:text-accent-foreground hover:shadow-sm dark:hover:from-accent/50 dark:hover:to-accent/30 active:bg-accent [&:hover_svg]:scale-110",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 decoration-2 decoration-primary/50 hover:decoration-primary [&:hover_svg]:translate-x-0.5",
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
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
