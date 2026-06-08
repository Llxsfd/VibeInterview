import Link from "next/link";
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Re-export shadcn components so existing imports don't break
export { Button } from "./button";
export { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
export { Badge } from "./badge";
export { Input } from "./input";
export { Progress } from "./progress";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

// Temporarily define Textarea if missing
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-1.5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 bg-primary/10 w-fit px-2 py-0.5 rounded-full">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
          {title}
        </h1>
      </div>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}

export function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{label}</h3>
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-bold tracking-tight">{value}</span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {trend}
        </span>
      </div>
    </div>
  );
}

import { Button } from "./button";

export function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button asChild className="gap-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
      <Link href={href}>
        {children}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}

export function StatusPill({ value }: { value: string }) {
  const isFinished = value.toLowerCase() === "finished" || value.toLowerCase() === "completed" || value.toLowerCase() === "done";
  const isPending = value.toLowerCase() === "parsing" || value.toLowerCase() === "pending";
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        isFinished && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        isPending && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        !isFinished && !isPending && "bg-secondary text-secondary-foreground"
      )}
    >
      {value}
    </span>
  );
}

import { Progress } from "./progress";

export function ProgressBar({ value }: { value: number }) {
  return <Progress value={value} className="h-2" />;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("glass-panel rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md", className)}
      {...props}
    />
  )
);
GlassPanel.displayName = "GlassPanel";
