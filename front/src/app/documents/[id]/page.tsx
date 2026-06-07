import { RefreshCw, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader, StatusPill } from "@/components/ui";
import { chunks, documents } from "@/lib/mock-data";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const doc = documents.find((item) => item.id === params.id) ?? documents[0];
  return (
    <AppShell>
      <PageHeader eyebrow="Document" title={doc.name} action={<div className="stack" style={{ gridAutoFlow: "column" }}><button className="ghost-btn"><RefreshCw size={16} />重新解析</button><button className="ghost-btn"><Trash2 size={16} />删除</button></div>} />
      <div className="grid-3">
        <GlassPanel className="panel-pad"><div className="muted">状态</div><StatusPill value={doc.status} /></GlassPanel>
        <GlassPanel className="panel-pad"><div className="muted">页数</div><strong>{doc.pages}</strong></GlassPanel>
        <GlassPanel className="panel-pad"><div className="muted">Chunk</div><strong>{doc.chunks}</strong></GlassPanel>
      </div>
      <GlassPanel style={{ marginTop: 14 }}>
        {chunks.map((chunk) => (
          <div className="data-row" key={chunk.section}>
            <div><div className="row-title">{chunk.section}</div><div className="muted">{chunk.chapter} · 页 {chunk.page}</div></div>
            <span>{chunk.score}</span>
            <span>{chunk.score}</span>
            <span className="muted">{chunk.content.slice(0, 22)}...</span>
          </div>
        ))}
      </GlassPanel>
    </AppShell>
  );
}
