import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { knowledgePoints } from "@/lib/mock-data";

export default function KnowledgePointsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Knowledge" title="知识点" />
      <div className="grid-3">
        {knowledgePoints.map((item) => (
          <GlassPanel className="panel-pad stack" key={item.name}>
            <div className="row-title">{item.name}</div>
            <div className="muted">{item.subject} · {item.difficulty}</div>
            <ProgressBar value={item.mastery} />
            <div>{item.keywords.join(" / ")}</div>
          </GlassPanel>
        ))}
      </div>
    </AppShell>
  );
}
