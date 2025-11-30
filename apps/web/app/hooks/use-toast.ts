"use client";

import { toast as sonnerToast } from "sonner";

// For the app path alias `~/*` we expose the hook under `app/hooks` so
// components using `~/hooks/use-toast` can import it.
export function useToast() {
  return { toast: sonnerToast };
}

export default useToast;
