import Link from "next/link";
import { LogIn } from "lucide-react";
import { GlassPanel, PageHeader } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="content">
      <PageHeader eyebrow="Auth" title="登录" />
      <GlassPanel className="panel-pad">
        <form className="form-grid">
          <input className="field" placeholder="邮箱或用户名" />
          <input className="field" type="password" placeholder="密码" />
          <button className="primary-btn" type="button"><LogIn size={16} />登录</button>
          <Link className="muted" href="/auth/register">创建新账户</Link>
        </form>
      </GlassPanel>
    </main>
  );
}
