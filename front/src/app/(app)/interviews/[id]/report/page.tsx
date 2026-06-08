"use client";

import { GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { useInterviewReport } from "@/hooks/useApi";
import { useParams } from "next/navigation";

export default function ReportPage() {
  const params = useParams() as { id: string };
  const { data: report, isLoading } = useInterviewReport(params.id);

  if (isLoading) {
    return (
      <>
        <div className="p-8 text-center text-muted-foreground">生成报告中...</div>
      </>
    );
  }

  if (!report) {
    return (
      <>
        <div className="p-8 text-center text-muted-foreground">报告未找到</div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Report" title="面试报告" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassPanel className="p-6">
          <div className="text-sm text-muted-foreground mb-2">总分</div>
          <strong className="text-3xl text-primary">{report.total_score}</strong>
        </GlassPanel>
        <GlassPanel className="p-6">
          <div className="text-sm text-muted-foreground mb-2">回答轮次</div>
          <strong className="text-3xl">{report.turns?.length ?? 0}</strong>
        </GlassPanel>
        <GlassPanel className="p-6">
          <div className="text-sm text-muted-foreground mb-2">薄弱点</div>
          <strong className="text-3xl text-destructive">{report.weak_points?.length ?? 0}</strong>
        </GlassPanel>
      </div>
      
      {report.weak_points && report.weak_points.length > 0 && (
        <GlassPanel className="mt-8 p-6 space-y-4 border-destructive/20 bg-destructive/5">
          <h3 className="text-lg font-semibold text-destructive">发现的问题与薄弱点</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {report.weak_points.map((wp: string, idx: number) => (
              <li key={idx}>{wp}</li>
            ))}
          </ul>
        </GlassPanel>
      )}

      {report.recommendations && report.recommendations.length > 0 && (
        <GlassPanel className="mt-6 p-6 space-y-4 border-blue-500/20 bg-blue-500/5">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">改进建议</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {report.recommendations.map((rec: string, idx: number) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </GlassPanel>
      )}
    </>
  );
}
