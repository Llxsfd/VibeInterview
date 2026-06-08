"use client";

import { FileUp, MessageSquareText, Mic, Sparkles, TrendingUp, BookOpen, Target } from "lucide-react";
import { ActionLink, ProgressBar, StatusPill } from "@/components/ui";
import { useMetrics, useDocuments, useKnowledgePoints, useInterviews } from "@/hooks/useApi";

export default function DashboardPage() {
  const { data: metrics = [] } = useMetrics();
  const { data: documents = [], isLoading: docsLoading } = useDocuments();
  const { data: knowledgePoints = [], isLoading: kpLoading } = useKnowledgePoints();
  const { data: interviews = [], isLoading: intLoading } = useInterviews();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">准备好今天的学习和模拟面试了吗？</p>
        </div>
        <ActionLink href="/documents" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 backdrop-blur-md">
          <FileUp size={16} /> 上传新资料
        </ActionLink>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Metric Cards - 1x1 */}
        {metrics.map((item: any, i: number) => (
          <div 
            key={item.label} 
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/20"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="text-sm font-medium text-muted-foreground mb-4">{item.label}</div>
            <div className="text-3xl font-bold tracking-tighter">{item.value}</div>
            <div className="mt-2 text-xs font-medium text-emerald-500 flex items-center gap-1">
              <TrendingUp size={12} /> {item.trend}
            </div>
          </div>
        ))}

        {/* AI Chat Card - 2x1 with neon accent */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-black/40 backdrop-blur-2xl p-8 group transition-all hover:border-blue-400/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)] flex flex-col justify-between min-h-[220px]">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div>
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/20 text-blue-400 mb-4 ring-1 ring-blue-500/30">
              <MessageSquareText size={24} />
            </div>
            <h2 className="text-2xl font-bold text-blue-50 tracking-tight">知识问答 RAG Chat</h2>
            <p className="text-blue-200/60 mt-2 text-sm max-w-sm">基于您的专属资料库，进行深度的上下文检索与逻辑问答训练。</p>
          </div>
          <div className="mt-6">
            <ActionLink href="/chat" className="bg-blue-600 hover:bg-blue-500 text-white border-none rounded-full px-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              开启对话 <Sparkles size={14} className="ml-1" />
            </ActionLink>
          </div>
        </div>

        {/* Mock Interview Card - 2x1 with violet accent */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-900/40 to-black/40 backdrop-blur-2xl p-8 group transition-all hover:border-violet-400/50 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.4)] flex flex-col justify-between min-h-[220px]">
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-violet-500/20 text-violet-400 mb-4 ring-1 ring-violet-500/30">
              <Mic size={24} />
            </div>
            <h2 className="text-2xl font-bold text-violet-50 tracking-tight">全真模拟面试</h2>
            <p className="text-violet-200/60 mt-2 text-sm max-w-sm">AI 考官实时语音追问，全方位评估知识盲区与表达逻辑。</p>
            
            {!intLoading && interviews.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-violet-300 bg-violet-950/50 w-fit px-3 py-1.5 rounded-full ring-1 ring-violet-500/30">
                <Target size={12} /> 最近得分: {interviews[0].total_score} 分
              </div>
            )}
          </div>
          <div className="mt-6 relative z-10">
            <ActionLink href="/interviews" className="bg-violet-600 hover:bg-violet-500 text-white border-none rounded-full px-6 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              进入房间
            </ActionLink>
          </div>
        </div>

        {/* Recent Documents - 2x2 roughly */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <BookOpen className="text-muted-foreground" size={20} />
            <h3 className="text-lg font-semibold tracking-tight">近期资料</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {docsLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">加载中...</div>
            ) : documents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                <div className="p-4 rounded-full bg-white/5"><FileUp size={24} /></div>
                <p>空空如也，快去上传资料吧</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.slice(0, 5).map((doc: any) => (
                  <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all" key={doc.id}>
                    <div className="space-y-1.5">
                      <div className="font-semibold leading-none text-foreground/90 group-hover:text-foreground transition-colors">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">{doc.subject} · {doc.pages ?? 0} 页 · {doc.chunks_count ?? 0} chunks</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusPill value={doc.status} />
                      <ActionLink href={`/documents/${doc.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 border-transparent hover:bg-white/20">查看</ActionLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Mastery - 2x2 roughly */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Target className="text-muted-foreground" size={20} />
            <h3 className="text-lg font-semibold tracking-tight">知识掌握度模型</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {kpLoading ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">加载中...</div>
            ) : knowledgePoints.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">暂无知识点数据</div>
            ) : (
              knowledgePoints.slice(0, 5).map((item: any) => {
                const mastery = Math.round(item.mastery_score * 100);
                return (
                  <div key={item.id} className="space-y-3 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground/90">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.subject}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{mastery}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000 ease-out relative"
                        style={{ width: `${mastery}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
