import { Mic, Square, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ActionLink, GlassPanel, PageHeader, ProgressBar } from "@/components/ui";

export default function InterviewRoomPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <PageHeader eyebrow="Room" title={`面试 ${params.id}`} action={<ActionLink href={`/interviews/${params.id}/report`}>报告</ActionLink>} />
      <div className="grid-2">
        <GlassPanel className="panel-pad stack">
          <p className="eyebrow">Question</p>
          <h2>请解释进程与线程的区别，并说明线程切换为什么更轻量。</h2>
          <ProgressBar value={62} />
          <textarea className="field" placeholder="文字回答" />
          <div className="grid-3">
            <button className="ghost-btn"><Mic size={16} />录音</button>
            <button className="ghost-btn"><Square size={16} />停止</button>
            <button className="primary-btn"><Send size={16} />提交</button>
          </div>
        </GlassPanel>
        <GlassPanel className="panel-pad stack">
          <div className="row-title">评分反馈</div>
          <p className="muted">当前得分 7.8，定义准确，场景举例不足。</p>
          <p>追问：线程共享哪些进程资源？</p>
        </GlassPanel>
      </div>
    </AppShell>
  );
}
