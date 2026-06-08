"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LogIn, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { AuthResponse, setAuthToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ account, password }),
      });
      setAuthToken(result.access_token);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("登录失败，请检查账号和密码。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-background">
      {/* Left section: Hero/Brand */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-zinc-950 z-0"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen"></div>
        
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">VibeInterview</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
            开启您的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">卓越面试之旅</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            全方位的面试题库、智能评估、弱点分析。打造属于您个人的专属面试冲刺计划。
          </p>
        </div>
        
        <div className="relative z-10 text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} VibeInterview. All rights reserved.
        </div>
      </div>

      {/* Right section: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[420px] space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">欢迎回来</h2>
            <p className="text-muted-foreground">请输入您的凭证以登录您的账户</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2 relative">
                <Input
                  className="peer h-16 bg-muted/50 border-0 border-b-2 border-transparent rounded-none px-4 pt-7 pb-2 focus-visible:ring-0 focus-visible:border-primary focus-visible:bg-transparent transition-all text-base"
                  placeholder=" "
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                  autoComplete="username"
                  id="account"
                  required
                />
                <label 
                  htmlFor="account" 
                  className="absolute left-4 top-5 text-muted-foreground text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
                >
                  邮箱或用户名
                </label>
              </div>
              <div className="space-y-2 relative">
                <Input
                  className="peer h-16 bg-muted/50 border-0 border-b-2 border-transparent rounded-none px-4 pt-7 pb-2 focus-visible:ring-0 focus-visible:border-primary focus-visible:bg-transparent transition-all text-base"
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  id="password"
                  required
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-4 top-5 text-muted-foreground text-sm transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs pointer-events-none"
                >
                  密码
                </label>
              </div>
            </div>

            {error ? (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-md animate-in fade-in">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={isSubmitting} className="h-14 w-full text-base font-semibold group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-xl">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? "正在验证..." : "登录账户"}
                {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">还没有账户？</span>{" "}
            <Link href="/auth/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
              免费注册
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
