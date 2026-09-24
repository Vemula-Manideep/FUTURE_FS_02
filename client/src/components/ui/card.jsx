import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Card = forwardRef(function Card({ className, ...props }, ref) {
  return <div ref={ref} className={cn("rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm", className)} {...props} />;
});

export function CardHeader({ className, ...props }) {
  return <div className={cn("border-b border-[var(--border)] p-5", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}
