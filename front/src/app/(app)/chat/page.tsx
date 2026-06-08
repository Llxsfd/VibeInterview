"use client";

import { Send } from "lucide-react";
import { Button, Card, CardContent, GlassPanel, PageHeader, Textarea } from "@/components/ui";
import { useChatHistory } from "@/hooks/useApi";

export default function ChatPage() {
  const { data: chunks = [], isLoading } = useChatHistory();

  return (
    <>
      <PageHeader eyebrow="RAG Chat" title="知识库问答" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel className="p-6 space-y-6 flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto space-y-4">
            <Card>
              <CardContent className="p-4">在此输入您的问题，我们将根据您的资料库进行解答。</CardContent>
            </Card>
          </div>
          <div className="space-y-4 pt-4 border-t border-border/50">
            <Textarea placeholder="输入问题" className="min-h-[100px] resize-none" />
            <Button className="w-full"><Send size={16} className="mr-2" />发送</Button>
          </div>
        </GlassPanel>
        <GlassPanel className="h-[600px] overflow-y-auto">
          <div className="sticky top-0 p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <h3 className="font-semibold">实时引用来源</h3>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">加载中...</div>
          ) : chunks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">对话后将在这里显示引用的知识片段</div>
          ) : (
            <div className="divide-y divide-border/50">
              {chunks.map((chunk) => (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors" key={chunk.id}>
                  <div>
                    <div className="font-semibold leading-none">{chunk.section}</div>
                    <div className="text-sm text-muted-foreground mt-1">{chunk.chapter} · {chunk.page}</div>
                  </div>
                  <span className="text-sm text-muted-foreground">引用</span>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </>
  );
}
