import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function GlassPanel({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <section className={`glass-panel ${className}`} style={style}>{children}</section>;
}

export function PageHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <GlassPanel className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{trend}</em>
    </GlassPanel>
  );
}

export function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="action-link" href={href}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

export function StatusPill({ value }: { value: string }) {
  return <span className={`status-pill status-${value}`}>{value}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-track">
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
