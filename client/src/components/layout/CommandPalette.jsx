import { BarChart3, KanbanSquare, Search, UsersRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useWorkspaceStore } from "../../store/workspaceStore";

const actions = [
  { label: "Open dashboard", to: "/", icon: BarChart3 },
  { label: "Open leads", to: "/leads", icon: UsersRound },
  { label: "Open pipeline", to: "/pipeline", icon: KanbanSquare },
];

export function CommandPalette() {
  const navigate = useNavigate();
  const open = useWorkspaceStore((state) => state.commandOpen);
  const setOpen = useWorkspaceStore((state) => state.setCommandOpen);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-24 max-w-xl rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
          <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
          <Input className="border-0 bg-transparent px-0 focus:ring-0" placeholder="Search commands, leads, actions..." autoFocus />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.to}
                className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm hover:bg-[var(--muted)]"
                onClick={() => {
                  navigate(action.to);
                  setOpen(false);
                }}
              >
                <Icon className="h-4 w-4 text-[var(--primary)]" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
