"use client";

import { GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { useKnowledgePoints } from "@/hooks/useApi";

export default function KnowledgePointsPage() {
  const { data: knowledgePoints = [], isLoading } = useKnowledgePoints();

  return (
    <>
      <PageHeader eyebrow="Knowledge" title="知识点" />
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">加载中...</div>
      ) : knowledgePoints.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">暂无知识点</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgePoints.map((item) => (
            <GlassPanel className="p-6 space-y-6 flex flex-col justify-between" key={item.id}>
              <div>
                <div className="font-semibold leading-none mb-1">{item.name}</div>
                <div className="text-sm text-muted-foreground mb-4">{item.subject} · {item.difficulty}</div>
                <ProgressBar value={Math.round(item.mastery_score * 100)} />
              </div>
              <div className="text-sm text-muted-foreground mt-4">{item.keywords?.join(" / ")}</div>
            </GlassPanel>
          ))}
        </div>
      )}
    </>
  );
}
