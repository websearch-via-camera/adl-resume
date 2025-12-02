import { useTheme } from "@/components/ThemeProvider"
import { CSSProperties } from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl",
          title: "group-[.toast]:font-semibold group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:font-medium group-[.toast]:shadow-lg group-[.toast]:shadow-primary/25",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          success: "group-[.toaster]:!bg-emerald-500/10 group-[.toaster]:!border-emerald-500/30 group-[.toaster]:!text-emerald-500 [&_[data-icon]]:text-emerald-500",
          error: "group-[.toaster]:!bg-rose-500/10 group-[.toaster]:!border-rose-500/30 group-[.toaster]:!text-rose-500 [&_[data-icon]]:text-rose-500",
          info: "group-[.toaster]:!bg-blue-500/10 group-[.toaster]:!border-blue-500/30 group-[.toaster]:!text-blue-500 [&_[data-icon]]:text-blue-500",
          warning: "group-[.toaster]:!bg-amber-500/10 group-[.toaster]:!border-amber-500/30 group-[.toaster]:!text-amber-500 [&_[data-icon]]:text-amber-500",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(142 76% 36% / 0.1)",
          "--success-border": "hsl(142 76% 36% / 0.3)",
          "--success-text": "hsl(142 76% 36%)",
          "--error-bg": "hsl(346 87% 43% / 0.1)",
          "--error-border": "hsl(346 87% 43% / 0.3)",
          "--error-text": "hsl(346 87% 43%)",
        } as CSSProperties
      }
      position="bottom-right"
      expand={true}
      richColors={true}
      closeButton={true}
      {...props}
    />
  )
}

export { Toaster }
