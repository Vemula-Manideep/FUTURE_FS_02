import { Bell, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "../../features/auth/AuthContext";
import { useWorkspaceStore } from "../../store/workspaceStore";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const setCommandOpen = useWorkspaceStore((state) => state.setCommandOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur md:px-6">
      <div className="relative hidden w-full max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input className="pl-9" placeholder="Search leads, companies, activities..." onFocus={() => setCommandOpen(true)} />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" title="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm" className="hidden md:inline-flex" onClick={() => setCommandOpen(true)}>
          Command
        </Button>
        <Button variant="ghost" size="icon" title="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium">{user?.name || "Demo Admin"}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{user?.role || "Admin"}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
