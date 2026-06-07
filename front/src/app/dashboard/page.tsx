import { FileUp, MessageSquareText, Mic } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActionLink, GlassPanel, MetricCard, PageHeader, ProgressBar, StatusPill } from "@/components/ui";
import { documents, interviews, knowledgePoints, metrics } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Dashboard" title="学习与面试中枢" action={<ActionLink href="/documents"><FileUp size={16} />上传资料</ActionLink>} />
      <div className="grid-4">
        {metrics.map((item) => <MetricCard key={item.label} {...item} />)}
      </div>
      <div className="grid-2" style={{ marginTop: 14 }}>
        <GlassPanel>
          {documents.map((doc) => (
            <div className="data-row" key={doc.id}>
              <div><div className="row-title">{doc.name}</div><div className="muted">{doc.subject} · {doc.pages} 页</div></div>
              <StatusPill value={doc.status} />
              <span>{doc.chunks} chunks</span>
              <ActionLink href={`/documents/${doc.id}`}>查看</ActionLink>
            </div>
          ))}
        </GlassPanel>
        <GlassPanel className="panel-pad stack">
          {knowledgePoints.map((item) => (
            <div key={item.name} className="stack">
              <div className="page-header" style={{ marginBottom: 0 }}>
                <div><div className="row-title">{item.name}</div><div className="muted">{item.subject} · {item.difficulty}</div></div>
                <strong>{item.mastery}%</strong>
              </div>
              <ProgressBar value={item.mastery} />
            </div>
          ))}
        </GlassPanel>
      </div>
      <div className="grid-2" style={{ marginTop: 14 }}>
        <GlassPanel className="panel-pad">
          <div className="page-header"><div><p className="eyebrow">Chat</p><h1 style={{ fontSize: 28 }}>引用问答</h1></div><MessageSquareText /></div>
          <p className="muted">最近命中：进程与线程、虚拟内存、TCP 握手</p>
          <ActionLink href="/chat">进入问答</ActionLink>
        </GlassPanel>
        <GlassPanel className="panel-pad">
          <div className="page-header"><div><p className="eyebrow">Interview</p><h1 style={{ fontSize: 28 }}>模拟面试</h1></div><Mic /></div>
          <p className="muted">{interviews[0].subject} · {interviews[0].turns} 轮 · {interviews[0].score} 分</p>
          <ActionLink href="/interviews">进入面试</ActionLink>
        </GlassPanel>
      </div>
    </AppShell>
  );
}
