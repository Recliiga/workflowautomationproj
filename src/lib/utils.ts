
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Custom styles for sidebar components that need to be reused
export const sidebarStyles = {
  rail: "after:bg-blue-500 hover:after:bg-blue-600 after:w-1", // Blue rail that's wider
  railTab: "before:absolute before:h-16 before:w-2 before:bg-blue-500 before:rounded-r before:top-1/3 before:left-full before:hover:bg-blue-600" // Tab indicator
}
