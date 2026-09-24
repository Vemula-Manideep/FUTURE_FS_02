import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (payload) => {
        const res = await api.post("/auth/login", payload);
        setUser(res.data.data.user);
      },
      logout: async () => {
        await api.post("/auth/logout").catch(() => null);
        setUser(null);
      },
      setDemoUser: () => setUser({ name: "Demo Admin", role: "Admin", email: "admin@minicrm.test" }),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
