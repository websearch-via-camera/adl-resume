"use client"

import { createContext, useContext, useState, type ComponentProps, type ReactNode } from "react"

import { cn } from "@/lib/utils"

// Native Tabs implementation - removes @radix-ui/react-tabs (~5KB savings)
// Provides the same API but with zero external dependencies

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps extends Omit<ComponentProps<"div">, "defaultValue"> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function Tabs({
  className,
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue
  
  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        "bg-muted/60 backdrop-blur-md text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-xl p-1 border border-border/30 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

interface TabsTriggerProps extends ComponentProps<"button"> {
  value: string
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext()
  const isActive = selectedValue === value

  return (
    <button
      data-slot="tabs-trigger"
      role="tab"
      type="button"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => onValueChange(value)}
      className={cn(
        // Base styles
        "inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out",
        // Inactive state
        "text-muted-foreground hover:text-foreground hover:bg-background/50",
        // Active state with glassmorphism
        "data-[state=active]:bg-background/90 data-[state=active]:backdrop-blur-sm data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/5 data-[state=active]:border-border/50",
        // Dark mode adjustments
        "dark:data-[state=active]:bg-input/50 dark:data-[state=active]:border-input",
        // Focus and disabled states
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        // SVG sizing
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends ComponentProps<"div"> {
  value: string
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: TabsContentProps) {
  const { value: selectedValue } = useTabsContext()
  const isActive = selectedValue === value

  if (!isActive) return null

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
