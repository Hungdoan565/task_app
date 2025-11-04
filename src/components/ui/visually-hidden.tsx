/**
 * Visually Hidden Component
 * Hides content visually but keeps it accessible to screen readers
 */

import type { ReactNode } from "react";

interface VisuallyHiddenProps {
  children: ReactNode;
}

export default function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className="sr-only">{children}</span>;
}

