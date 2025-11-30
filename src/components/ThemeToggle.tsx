import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "@phosphor-icons/react"
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
    if (!mounted) return <Sun size={18} weight="fill" />
    
    // Use resolvedTheme to show the actual theme (handles "system" case)
    const currentTheme = resolvedTheme || "light"
    return currentTheme === "dark" 
      ? <Moon size={18} weight="fill" />
      : <Sun size={18} weight="fill" />
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
