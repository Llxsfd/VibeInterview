import { Save } from "lucide-react";
import { Button, GlassPanel, Input, PageHeader } from "@/components/ui";

export default function ProfilePage() {
  return (
    <>
      <PageHeader eyebrow="Profile" title="个人设置" />
      <GlassPanel className="p-6">
        <form className="flex flex-col gap-5 max-w-xl">
          <select className="field"><option>Java 后端</option><option>C++ 后端</option><option>前端</option></select>
          <select className="field"><option>中等</option><option>基础</option><option>高级</option></select>
          <Input value="14 天" readOnly />
          <Button type="button"><Save size={16} />保存</Button>
        </form>
      </GlassPanel>
    </>
  );
}
