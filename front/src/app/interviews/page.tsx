import { Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActionLink, GlassPanel, PageHeader, StatusPill } from "@/components/ui";
import { interviews } from "@/lib/mock-data";

export default function InterviewsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Interview" title="模拟面试" action={<ActionLink href="/interviews/new"><Plus size={16} />新建</ActionLink>} />
      <GlassPanel>
        {interviews.map((item) => (
          <div className="data-row" key={item.id}>
            <div><div className="row-title">{item.mode} · {item.subject}</div><div className="muted">{item.turns} 轮</div></div>
            <StatusPill value={item.status} />
            <span>{item.score} 分</span>
            <ActionLink href={`/interviews/${item.id}`}>进入</ActionLink>
          </div>
        ))}
      </GlassPanel>
    </AppShell>
  );
}
