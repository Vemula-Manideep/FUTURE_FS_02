import { cn } from "../../lib/utils";

const tones = {
  New: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Contacted: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
  Qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  "Proposal Sent": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
  Negotiation: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  Converted: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200",
  Lost: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200",
  Urgent: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
};

export function Badge({ children, className }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[children] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200", className)}>
      {children}
    </span>
  );
}
