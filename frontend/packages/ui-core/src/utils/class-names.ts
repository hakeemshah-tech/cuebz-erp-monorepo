import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose conditional class names and resolve conflicting Tailwind utilities,
 * so a caller-supplied `className` always wins over a component default.
 */
export default function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export { cn };
