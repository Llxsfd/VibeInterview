import { Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader } from "@/components/ui";
import { chunks } from "@/lib/mock-data";

export default function ChatPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="RAG Chat" title="知识库问答" />
      <div className="grid-2">
        <GlassPanel className="panel-pad stack">
          <div className="glass-panel panel-pad">TCP 三次握手为什么不能是两次？</div>
          <div className="glass-panel panel-pad">基于资料，三次握手用于确认双方收发能力并同步初始序列号，减少历史连接报文造成的错误连接。</div>
          <textarea className="field" placeholder="输入问题" />
          <button className="primary-btn"><Send size={16} />发送</button>
        </GlassPanel>
        <GlassPanel>
          {chunks.map((chunk) => (
            <div className="data-row" key={chunk.section}>
              <div><div className="row-title">{chunk.section}</div><div className="muted">{chunk.chapter} · {chunk.page}</div></div>
              <span>{chunk.score}</span>
              <span className="muted">引用</span>
              <span />
            </div>
          ))}
        </GlassPanel>
      </div>
    </AppShell>
  );
}
