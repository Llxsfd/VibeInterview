import Link from "next/link";
import { UserPlus } from "lucide-react";
import { GlassPanel, PageHeader } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="content">
      <PageHeader eyebrow="Auth" title="注册" />
      <GlassPanel className="panel-pad">
        <form className="form-grid">
          <input className="field" placeholder="用户名" />
          <input className="field" placeholder="邮箱" />
          <input className="field" type="password" placeholder="密码" />
          <button className="primary-btn" type="button"><UserPlus size={16} />注册</button>
          <Link className="muted" href="/auth/login">已有账户</Link>
        </form>
      </GlassPanel>
    </main>
  );
}
