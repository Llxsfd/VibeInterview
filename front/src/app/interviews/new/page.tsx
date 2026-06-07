import { Play } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader } from "@/components/ui";

export default function NewInterviewPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="New" title="创建面试" />
      <GlassPanel className="panel-pad">
        <form className="form-grid">
          <select className="field"><option>知识点专项</option><option>科目综合</option><option>岗位模拟</option></select>
          <select className="field"><option>操作系统</option><option>计算机网络</option><option>数据库</option></select>
          <select className="field"><option>中等</option><option>基础</option><option>高级</option></select>
          <button className="primary-btn" type="button"><Play size={16} />开始</button>
        </form>
      </GlassPanel>
    </AppShell>
  );
}
