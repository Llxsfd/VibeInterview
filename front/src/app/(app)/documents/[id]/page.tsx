"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { Button, GlassPanel, PageHeader, StatusPill } from "@/components/ui";
import { useDocument, useDocumentChunks } from "@/hooks/useApi";
import { useParams } from "next/navigation";

export default function DocumentDetailPage() {
  const params = useParams() as { id: string };
  const { data: doc, isLoading: isDocLoading } = useDocument(params.id);
  const { data: chunks = [], isLoading: isChunksLoading } = useDocumentChunks(params.id);

  if (isDocLoading) {
    return (
      <>
        <div className="p-8 text-center text-muted-foreground">加载中...</div>
      </>
    );
  }

  if (!doc) {
    return (
      <>
        <div className="p-8 text-center text-muted-foreground">未找到资料</div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Document" title={doc.name} action={<div className="flex gap-2"><Button variant="outline"><RefreshCw size={16} />重新解析</Button><Button variant="destructive"><Trash2 size={16} />删除</Button></div>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassPanel className="p-6"><div className="text-sm text-muted-foreground mb-2">状态</div><StatusPill value={doc.status} /></GlassPanel>
        <GlassPanel className="p-6"><div className="text-sm text-muted-foreground mb-2">页数</div><strong className="text-2xl">{doc.pages ?? 0}</strong></GlassPanel>
        <GlassPanel className="p-6"><div className="text-sm text-muted-foreground mb-2">Chunk</div><strong className="text-2xl">{doc.chunks_count ?? 0}</strong></GlassPanel>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold tracking-tight mb-4">内容片段</h3>
        <GlassPanel>
          {isChunksLoading ? (
            <div className="p-8 text-center text-muted-foreground">加载片段中...</div>
          ) : chunks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">暂无解析片段</div>
          ) : (
            <div className="divide-y divide-border/50">
              {chunks.map((chunk) => (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors" key={chunk.id}>
                  <div className="space-y-1">
                    <div className="font-semibold leading-none">{chunk.section || chunk.chapter || `片段 ${chunk.chunk_index}`}</div>
                    <div className="text-sm text-muted-foreground">页 {chunk.page_number ?? "?"}</div>
                  </div>
                  <span className="text-sm text-muted-foreground max-w-sm truncate">{chunk.content}</span>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </>
  );
}
