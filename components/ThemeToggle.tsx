"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  className?: string;
  variant?: "dropdown" | "toggle";
}

export function ThemeToggle({ className, variant = "toggle" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`w-9 h-9 rounded-full opacity-70 ${className || ""}`}
        aria-label="Toggle theme"
      >
        <span className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  // Quick 1-click toggle mode
  if (variant === "toggle") {
    const isDark = resolvedTheme === "dark";
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`relative w-9 h-9 rounded-full border border-border/60 bg-card/60 backdrop-blur-md hover:bg-muted text-foreground transition-all duration-300 hover:scale-105 active:scale-95 ${className || ""}`}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-sky-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  // Dropdown menu mode (Light, Dark, System)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`relative w-9 h-9 rounded-full border-border/80 bg-card/60 backdrop-blur-md hover:bg-muted text-foreground transition-all duration-300 ${className || ""}`}
          aria-label="Select theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer text-xs font-medium">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer text-xs font-medium">
          <Moon className="w-4 h-4 text-sky-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer text-xs font-medium">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
