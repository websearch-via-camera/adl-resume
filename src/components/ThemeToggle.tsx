import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

const themes = ["light", "dark", "system"] as const

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme as typeof themes[number])
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    if (!mounted) return <Sun size={18} weight="fill" />
    
    switch (theme) {
      case "dark":
        return <Moon size={18} weight="fill" />
      case "system":
        return <Monitor size={18} weight="fill" />
      default:
        return <Sun size={18} weight="fill" />
    }
  }

  const getLabel = () => {
    if (!mounted) return "Toggle theme"
    return `Theme: ${theme} (click to cycle)`
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-9 w-9"
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  )
}
