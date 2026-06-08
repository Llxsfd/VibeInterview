"use client";

import { CheckCircle2 } from "lucide-react";
import { Button, GlassPanel, PageHeader } from "@/components/ui";
import { useQuestions } from "@/hooks/useApi";

export default function QuestionsPage() {
  const { data: questions = [], isLoading } = useQuestions();

  return (
    <>
      <PageHeader eyebrow="Practice" title="刷题练习" action={<Button><CheckCircle2 size={16} className="mr-2" />生成题目</Button>} />
      <GlassPanel>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">加载中...</div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">暂无题目，请点击右上角生成</div>
        ) : (
          <div className="divide-y divide-border/50">
            {questions.map((q) => (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors" key={q.id}>
                <div className="flex-1">
                  <div className="font-semibold leading-none max-w-xl">{q.stem}</div>
                  <div className="text-sm text-muted-foreground mt-1">{q.subject} · {q.type}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline">作答</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </>
  );
}
