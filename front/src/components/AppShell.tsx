"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Target
} from "lucide-react";
import { AuthMenu } from "@/components/AuthMenu";
import { cn } from "@/lib/utils";

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
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-transparent">
      {/* Sleek Floating Sidebar */}
      <aside className="z-50 flex h-auto w-full flex-col md:sticky md:top-4 md:h-[calc(100vh-32px)] md:w-[280px] md:ml-4 glass rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 my-0 md:my-4">
        
        <div className="flex h-20 items-center px-6 border-b border-white/5 relative overflow-hidden">
          {/* Subtle pulse animation for logo background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 animate-pulse" />
          <Link href="/dashboard" className="relative flex items-center gap-3 font-bold text-lg tracking-tight transition-transform hover:scale-[1.02]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <Sparkles size={18} className="animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              智能面试平台
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="grid gap-2">
            {nav.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link 
                  href={item.href} 
                  key={item.href} 
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1"
                  )}
                >
                  <item.icon size={18} className={cn(
                    "shrink-0 transition-colors", 
                    isActive ? "text-blue-400" : "group-hover:text-foreground"
                  )} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-4 bg-black/20 backdrop-blur-md border-t border-white/5">
          <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-xs font-medium text-blue-400/90 shadow-inner">
            <ShieldCheck size={16} className="shrink-0 text-blue-400" />
            <span className="leading-tight">AI 训练数据已隔离保护</span>
          </div>
          <AuthMenu />
        </div>
      </aside>
      
      <main className="flex-1 w-full min-w-0 md:px-4">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full py-6 md:py-10 space-y-8 max-w-[1400px] mx-auto px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
