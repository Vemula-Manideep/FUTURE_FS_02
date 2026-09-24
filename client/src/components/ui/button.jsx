import { cn } from "../../lib/utils";

export function Button({ className, variant = "primary", size = "md", ...props }) {
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
    secondary: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-700",
    ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
