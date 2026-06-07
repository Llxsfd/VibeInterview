import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { knowledgePoints } from "@/lib/mock-data";

export default function ReportPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Report" title="面试报告" />
      <div className="grid-3">
        <GlassPanel className="panel-pad"><div className="muted">总分</div><strong>78</strong></GlassPanel>
        <GlassPanel className="panel-pad"><div className="muted">回答时长</div><strong>12m</strong></GlassPanel>
        <GlassPanel className="panel-pad"><div className="muted">语速</div><strong>168字/分</strong></GlassPanel>
      </div>
      <GlassPanel className="panel-pad stack" style={{ marginTop: 14 }}>
        {knowledgePoints.map((item) => <div className="stack" key={item.name}><div>{item.name}</div><ProgressBar value={item.mastery} /></div>)}
      </GlassPanel>
    </AppShell>
  );
}
