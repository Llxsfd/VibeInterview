import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  Brain,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessageSquareText,
  Mic,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "总览", icon: LayoutDashboard },
  { href: "/documents", label: "资料", icon: FileText },
  { href: "/chat", label: "问答", icon: MessageSquareText },
  { href: "/knowledge-points", label: "知识点", icon: Brain },
  { href: "/questions", label: "刷题", icon: BookOpen },
  { href: "/interviews", label: "面试", icon: Mic },
  { href: "/mistakes", label: "错题", icon: Target },
  { href: "/study-plan", label: "计划", icon: CalendarCheck },
  { href: "/profile", label: "设置", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="brand">
          <span><Sparkles size={18} /></span>
          智能面试平台
        </Link>
        <nav>
          {nav.map((item) => (
            <Link href={item.href} key={item.href} className="nav-item">
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="guard-note">
          <ShieldCheck size={16} />
          Key 由后端安全托管
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
