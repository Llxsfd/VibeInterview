import { Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActionLink, GlassPanel, PageHeader, StatusPill } from "@/components/ui";
import { documents } from "@/lib/mock-data";

export default function DocumentsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Documents" title="我的资料" action={<button className="primary-btn"><Upload size={16} />选择 PDF</button>} />
      <GlassPanel>
        {documents.map((doc) => (
          <div className="data-row" key={doc.id}>
            <div><div className="row-title">{doc.name}</div><div className="muted">{doc.subject} · {doc.updated}</div></div>
            <StatusPill value={doc.status} />
            <span>{doc.chunks}</span>
            <ActionLink href={`/documents/${doc.id}`}>详情</ActionLink>
          </div>
        ))}
      </GlassPanel>
    </AppShell>
  );
}
