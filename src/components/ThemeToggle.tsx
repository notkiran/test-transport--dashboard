import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/ThemeProvider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = React.useState(false)

  // When the component mounts on the client, we can safely check the theme.
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Don't render on the server to avoid a hydration mismatch.
    return null
  }

  // Determine the current theme, resolving 'system' to 'light' or 'dark'.
  const isSystem = theme === "system"
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  const isDarkMode = theme === "dark" || (isSystem && systemTheme === "dark")

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Sun
        className={cn(
          "h-5 w-5 transition-all",
          isDarkMode ? "text-muted-foreground" : "text-yellow-500"
        )}
      />
      <Switch
        id="theme-mode-switch"
        checked={isDarkMode}
        onCheckedChange={handleThemeChange}
        aria-label="Toggle theme"
      />
      <Moon
        className={cn(
          "h-5 w-5 transition-all",
          isDarkMode ? "text-primary" : "text-muted-foreground"
        )}
      />
    </div>
  )
}
