import { useQuery } from "@tanstack/react-query";
import { DndContext, PointerSensor, useDroppable, useDraggable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { api } from "../../lib/api";
import { currency } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { mockLeads, statuses } from "../../data/mockData";

const fetchLeads = async () => {
  try {
    const res = await api.get("/leads?limit=100");
    return res.data.data;
  } catch {
    return mockLeads;
  }
};

function PipelineColumn({ status, leads }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section ref={setNodeRef} className={`rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 transition ${isOver ? "ring-2 ring-[var(--primary)]" : ""}`}>
      <div className="flex items-center justify-between border-b border-[var(--border)] p-3">
        <h2 className="text-sm font-semibold">{status}</h2>
        <Badge>{String(leads.length)}</Badge>
      </div>
      <div className="space-y-3 p-3">
        {leads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} />
        ))}
        {leads.length === 0 && <div className="rounded-md border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted-foreground)]">No leads</div>}
      </div>
    </section>
  );
}

function LeadCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead._id });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card ref={setNodeRef} style={style} className={`p-4 ${isDragging ? "opacity-70 shadow-lg" : ""}`} {...listeners} {...attributes}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{lead.client.company || lead.client.name}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{lead.client.name}</p>
        </div>
        <GripVertical className="h-4 w-4 text-[var(--muted-foreground)]" />
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
        <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${lead.score || 68}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>{lead.source}</span>
        <span className="font-medium text-[var(--foreground)]">{currency(lead.estimatedValue)}</span>
      </div>
    </Card>
  );
}

export function PipelinePage() {
  const { data = mockLeads } = useQuery({ queryKey: ["leads"], queryFn: fetchLeads });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const onDragEnd = async (event) => {
    const leadId = event.active?.id;
    const status = event.over?.id;
    if (!leadId || !status || !statuses.includes(status)) return;
    await api.patch(`/leads/${leadId}`, { status }).catch(() => null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pipeline board</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Kanban-ready sales stages for tracking conversion momentum.</p>
      </div>
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="scrollbar-thin grid auto-cols-[280px] grid-flow-col gap-4 overflow-x-auto pb-3">
        {statuses.map((status) => {
          const leads = data.filter((lead) => lead.status === status);
          return <PipelineColumn key={status} status={status} leads={leads} />;
        })}
      </div>
      </DndContext>
    </div>
  );
}
