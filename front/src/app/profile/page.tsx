import { Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel, PageHeader } from "@/components/ui";

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Profile" title="个人设置" />
      <GlassPanel className="panel-pad">
        <form className="form-grid">
          <select className="field"><option>Java 后端</option><option>C++ 后端</option><option>前端</option></select>
          <select className="field"><option>中等</option><option>基础</option><option>高级</option></select>
          <input className="field" value="14 天" readOnly />
          <button className="primary-btn" type="button"><Save size={16} />保存</button>
        </form>
      </GlassPanel>
    </AppShell>
  );
}
