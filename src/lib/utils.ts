
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom styles for sidebar components that need to be reused
export const sidebarStyles = {
  rail: "after:bg-sidebar-primary hover:after:bg-sidebar-primary/80 after:w-1", // Using sidebar-primary to match the theme
  railTab: "before:absolute before:h-16 before:w-2 before:bg-sidebar-primary before:rounded-r before:top-1/3 before:left-full before:hover:bg-sidebar-primary/80" // Tab indicator
}
