"use client";

import { Button, GlassPanel, PageHeader } from "@/components/ui";
import { useMistakes } from "@/hooks/useApi";

export default function MistakesPage() {
  const { data: mistakes = [], isLoading } = useMistakes();

  return (
    <>
      <PageHeader eyebrow="Mistakes" title="错题本" />
      <GlassPanel>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : mistakes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">干得漂亮，暂无错题！</div>
        ) : (
          <div className="divide-y divide-border/50">
            {mistakes.map((item) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors" key={item.id}>
                <div>
                  <div className="font-semibold leading-none">{item.title ?? "错题记录"}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.subject} · {item.mistake_reason}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{item.review_count} 次</span>
                  <Button variant="outline">复习</Button>
                  <Button variant="ghost" className="text-destructive">移出</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </>
  );
}
