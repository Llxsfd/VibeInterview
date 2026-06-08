import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智能面试平台",
  description: "基于个人资料的 AI 模拟面试与学习辅助平台",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
