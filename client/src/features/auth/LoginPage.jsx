import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { user, login, setDemoUser } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: "admin@minicrm.test", password: "Password123!" });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={location.state?.from?.pathname || "/"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await login(form);
      toast.success("Welcome back");
    } catch {
      toast.info("API is unavailable, entering demo mode");
      setDemoUser();
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-md bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">CRM</div>
            <h1 className="text-2xl font-semibold">Sign in to ClientFlow</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">Secure admin workspace for lead capture, pipeline tracking, and follow-ups.</p>
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <label className="block space-y-2 text-sm font-medium">
              Email
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input className="pl-9" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              </div>
            </label>
            <label className="block space-y-2 text-sm font-medium">
              Password
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input className="pl-9" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              </div>
            </label>
            <Button className="w-full" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={setDemoUser}>
              Demo workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
