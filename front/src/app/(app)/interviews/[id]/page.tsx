"use client";

import { Mic, Square, Send } from "lucide-react";
import { ActionLink, Button, GlassPanel, PageHeader, ProgressBar, Textarea } from "@/components/ui";
import { useInterview } from "@/hooks/useApi";
import { useParams } from "next/navigation";

export default function InterviewRoomPage() {
  const params = useParams() as { id: string };
  const { data: interview, isLoading } = useInterview(params.id);

  if (isLoading) {
    return (
      <>
        <div className="p-8 text-center text-muted-foreground">加载面试数据中...</div>
      </>
    );
  }

  if (!interview) {
    return (
      <>
        <div className="p-8 text-center text-muted-foreground">面试不存在</div>
      </>
    );
  }

  const activeTurn = interview.turns?.find((t) => !t.score) ?? interview.turns?.[interview.turns.length - 1];

  return (
    <>
      <PageHeader eyebrow="Room" title={`面试: ${interview.subject}`} action={<ActionLink href={`/interviews/${params.id}/report`}>查看报告</ActionLink>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="p-6 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">Question</p>
          <h2 className="text-xl font-semibold leading-relaxed">
            {activeTurn?.question || "本场面试已结束或无可回答问题。"}
          </h2>
          {interview.status !== "finished" && activeTurn && !activeTurn.score && (
            <>
              <ProgressBar value={0} />
              <Textarea placeholder="请在此输入文字回答，或使用录音..." className="min-h-[150px] resize-none" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full"><Mic size={16} className="mr-2" />录音</Button>
                <Button variant="outline" className="w-full"><Square size={16} className="mr-2" />停止</Button>
                <Button className="w-full"><Send size={16} className="mr-2" />提交</Button>
              </div>
            </>
          )}
        </GlassPanel>
        <GlassPanel className="p-6 space-y-6">
          <div className="font-semibold leading-none text-lg">评分反馈</div>
          {!activeTurn?.score ? (
            <p className="text-sm text-muted-foreground">尚未提交回答，请先回答左侧问题。</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">
                得分 <strong className="text-primary text-lg">{activeTurn.score}</strong> / 10
              </p>
              <p className="text-sm text-muted-foreground">{activeTurn.feedback}</p>
              {activeTurn.follow_up_question && (
                <div className="mt-4 p-4 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <span className="font-semibold">追问：</span>
                  {activeTurn.follow_up_question}
                </div>
              )}
            </div>
          )}
        </GlassPanel>
      </div>
    </>
  );
}
