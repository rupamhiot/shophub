"use client";

import { toast as sonnerToast } from "sonner";

// A small wrapper hook for the project's toast system.
export function useToast() {
  return { toast: sonnerToast };
}

export default useToast;
