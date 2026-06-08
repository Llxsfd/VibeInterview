"use client";

import { Upload } from "lucide-react";
import { ActionLink, Button, GlassPanel, PageHeader, StatusPill } from "@/components/ui";
import { useDocuments } from "@/hooks/useApi";

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useDocuments();

  return (
    <>
      <PageHeader eyebrow="Documents" title="我的资料" action={<Button><Upload size={16} />选择 PDF</Button>} />
      <GlassPanel>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">暂无资料，请点击右上角上传</div>
        ) : (
          <div className="divide-y divide-border/50">
            {documents.map((doc) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors" key={doc.id}>
                <div>
                  <div className="font-semibold leading-none">{doc.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{doc.subject}</div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusPill value={doc.status} />
                  <span className="text-sm text-muted-foreground">{doc.chunks_count ?? 0} chunks</span>
                  <ActionLink href={`/documents/${doc.id}`}>详情</ActionLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </>
  );
}
