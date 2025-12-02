import { ComponentProps, isValidElement, cloneElement, type ReactElement } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Native Slot implementation - removes @radix-ui/react-slot dependency
function Slot({ children, ...props }: ComponentProps<"span"> & { children?: React.ReactNode }) {
  if (isValidElement(children)) {
    return cloneElement(children as ReactElement<Record<string, unknown>>, {
      ...props,
      ...children.props,
      className: cn((props as { className?: string }).className, (children.props as { className?: string }).className),
    })
  }
  return <span {...props}>{children}</span>
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90 [a&]:hover:shadow-md [a&]:hover:-translate-y-px",
        secondary:
          "border-transparent bg-secondary/80 backdrop-blur-sm text-secondary-foreground [a&]:hover:bg-secondary/90 [a&]:hover:shadow-sm [a&]:hover:-translate-y-px",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm [a&]:hover:bg-destructive/90 [a&]:hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground border-border/60 bg-background/50 backdrop-blur-sm [a&]:hover:bg-accent/50 [a&]:hover:text-accent-foreground [a&]:hover:border-primary/30 [a&]:hover:-translate-y-px",
        glass:
          "bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-foreground shadow-sm [a&]:hover:bg-white/20 dark:hover:bg-white/10 [a&]:hover:-translate-y-px",
        glow:
          "border-primary/30 bg-primary/10 text-primary backdrop-blur-sm shadow-[0_0_10px_oklch(from_var(--primary)_l_c_h_/_0.2)] [a&]:hover:shadow-[0_0_15px_oklch(from_var(--primary)_l_c_h_/_0.3)] [a&]:hover:-translate-y-px",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
