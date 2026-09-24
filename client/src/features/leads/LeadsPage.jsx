import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Filter, Plus, Search } from "lucide-react";
import { api } from "../../lib/api";
import { currency } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { mockLeads } from "../../data/mockData";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { Skeleton } from "../../components/ui/skeleton";

const fetchLeads = async () => {
  try {
    const res = await api.get("/leads?limit=50");
    return res.data.data;
  } catch {
    return mockLeads;
  }
};

export function LeadsPage() {
  const [q, setQ] = useState("");
  const debouncedQuery = useDebouncedValue(q, 250);
  const { data = mockLeads, isLoading } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });
  const leads = useMemo(() => data.filter((lead) => `${lead.client.name} ${lead.client.company}`.toLowerCase().includes(debouncedQuery.toLowerCase())), [data, debouncedQuery]);

  const exportCsv = () => {
    const rows = ["Name,Company,Status,Source,Priority,Value", ...leads.map((lead) => [lead.client.name, lead.client.company, lead.status, lead.source, lead.priority, lead.estimatedValue].join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lead management</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Create, qualify, assign, filter, and export client opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCsv}>
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4" /> Lead
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input className="pl-9" placeholder="Search leads..." value={q} onChange={(event) => setQ(event.target.value)} />
          </div>
          <Button variant="secondary">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-xs uppercase text-[var(--muted-foreground)]">
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/60">
                  <td className="px-5 py-4">
                    <p className="font-medium">{lead.client.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{lead.client.company}</p>
                  </td>
                  <td className="px-5 py-4"><Badge>{lead.status}</Badge></td>
                  <td className="px-5 py-4">{lead.source}</td>
                  <td className="px-5 py-4">{lead.assignedTo?.name || "Unassigned"}</td>
                  <td className="px-5 py-4"><Badge>{lead.priority}</Badge></td>
                  <td className="px-5 py-4">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--muted)]">
                      <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${lead.score || 68}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-medium">{currency(lead.estimatedValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
