"use client";

import { Plus } from "lucide-react";
import { ActionLink, GlassPanel, PageHeader, StatusPill } from "@/components/ui";
import { useInterviews } from "@/hooks/useApi";

export default function InterviewsPage() {
  const { data: interviews = [], isLoading } = useInterviews();

  return (
    <>
      <PageHeader eyebrow="Interview" title="模拟面试" action={<ActionLink href="/interviews/new"><Plus size={16} />新建</ActionLink>} />
      <GlassPanel>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : interviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">暂无面试记录，去创建一场吧</div>
        ) : (
          <div className="divide-y divide-border/50">
            {interviews.map((item) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors" key={item.id}>
                <div>
                  <div className="font-semibold leading-none">{item.mode} · {item.subject}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.turns?.length ?? 0} 轮</div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusPill value={item.status} />
                  <span className="text-sm text-muted-foreground font-medium">{item.total_score} 分</span>
                  <ActionLink href={`/interviews/${item.id}`}>进入</ActionLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </>
  );
}
