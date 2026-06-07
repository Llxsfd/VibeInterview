import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { studyDays } from "@/lib/mock-data";

export default function StudyPlanPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Plan" title="学习计划" />
      <div className="grid-3">
        {studyDays.map((day) => (
          <GlassPanel className="panel-pad stack" key={day.day}>
            <div className="row-title">Day {day.day}</div>
            <div>{day.title}</div>
            <ProgressBar value={Math.round((day.done / day.total) * 100)} />
            <button className="ghost-btn">标记完成</button>
          </GlassPanel>
        ))}
      </div>
    </AppShell>
  );
}
