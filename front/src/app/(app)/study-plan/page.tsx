"use client";

import { Button, GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { useStudyPlans } from "@/hooks/useApi";

export default function StudyPlanPage() {
  const { data: studyDays = [], isLoading } = useStudyPlans();

  return (
    <>
      <PageHeader eyebrow="Plan" title="学习计划" />
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">加载中...</div>
      ) : studyDays.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">暂无学习计划，请生成或开始学习</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyDays.map((day) => (
            <GlassPanel className="p-6 space-y-6 flex flex-col justify-between" key={day.id}>
              <div>
                <div className="font-semibold leading-none mb-2">Day {day.id}</div>
                <div className="text-muted-foreground mb-4">{day.title}</div>
                <ProgressBar value={Math.round((day.completed_items / Math.max(day.total_items, 1)) * 100)} />
              </div>
              <Button variant="outline" className="w-full">标记完成</Button>
            </GlassPanel>
          ))}
        </div>
      )}
    </>
  );
}
