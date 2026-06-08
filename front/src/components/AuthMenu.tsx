"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AuthMenu() {
  const router = useRouter();

  const handleLogout = () => {
    clearAuthToken();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <Button className="w-full justify-start gap-2" variant="ghost" type="button" onClick={handleLogout}>
      <LogOut size={18} />
      退出登录
    </Button>
  );
}
