import { CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader, ProgressBar } from "@/components/ui";
import { questions } from "@/lib/mock-data";

export default function QuestionsPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Practice" title="刷题练习" action={<button className="primary-btn"><CheckCircle2 size={16} />生成题目</button>} />
      <GlassPanel>
        {questions.map((q) => (
          <div className="data-row" key={q.stem}>
            <div><div className="row-title">{q.stem}</div><div className="muted">{q.subject} · {q.type}</div></div>
            <ProgressBar value={Math.round(q.score * 100)} />
            <span>{Math.round(q.score * 100)}%</span>
            <button className="ghost-btn">作答</button>
          </div>
        ))}
      </GlassPanel>
    </AppShell>
  );
}
