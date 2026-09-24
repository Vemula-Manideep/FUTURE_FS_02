import { create } from "zustand";

export const useWorkspaceStore = create((set) => ({
  commandOpen: false,
  sidebarCollapsed: false,
  activeFilters: {
    status: "",
    priority: "",
    source: "",
  },
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setFilter: (key, value) =>
    set((state) => ({
      activeFilters: { ...state.activeFilters, [key]: value },
    })),
  resetFilters: () => set({ activeFilters: { status: "", priority: "", source: "" } }),
}));
