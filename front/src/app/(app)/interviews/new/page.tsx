import { Play } from "lucide-react";
import { Button, GlassPanel, PageHeader } from "@/components/ui";

export default function NewInterviewPage() {
  return (
    <>
      <PageHeader eyebrow="New" title="创建面试" />
      <GlassPanel className="p-6">
        <form className="flex flex-col gap-5 max-w-xl">
          <select className="field"><option>知识点专项</option><option>科目综合</option><option>岗位模拟</option></select>
          <select className="field"><option>操作系统</option><option>计算机网络</option><option>数据库</option></select>
          <select className="field"><option>中等</option><option>基础</option><option>高级</option></select>
          <Button type="button"><Play size={16} />开始</Button>
        </form>
      </GlassPanel>
    </>
  );
}
