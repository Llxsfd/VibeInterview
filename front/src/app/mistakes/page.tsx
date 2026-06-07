import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader } from "@/components/ui";
import { mistakes } from "@/lib/mock-data";

export default function MistakesPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Mistakes" title="错题本" />
      <GlassPanel>
        {mistakes.map((item) => (
          <div className="data-row" key={item.id}>
            <div><div className="row-title">{item.title}</div><div className="muted">{item.subject} · {item.reason}</div></div>
            <span>{item.reviews} 次</span>
            <button className="ghost-btn">复习</button>
            <button className="ghost-btn">移出</button>
          </div>
        ))}
      </GlassPanel>
    </AppShell>
  );
}
