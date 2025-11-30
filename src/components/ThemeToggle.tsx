import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // Use resolvedTheme to handle the case when theme is "system"
    // This way, first click switches from system preference to the opposite
    const currentTheme = resolvedTheme || "light"
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  const getIcon = () => {
    if (!mounted) return <Sun className="h-[18px] w-[18px]" />
    
    // Use resolvedTheme to show the actual theme (handles "system" case)
    const currentTheme = resolvedTheme || "light"
    return currentTheme === "dark" 
      ? <Moon className="h-[18px] w-[18px]" />
      : <Sun className="h-[18px] w-[18px]" />
  }

  const getLabel = () => {
    if (!mounted) return "Toggle theme"
    const currentTheme = resolvedTheme || "light"
    return `Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9"
      onClick={toggleTheme}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  )
}
