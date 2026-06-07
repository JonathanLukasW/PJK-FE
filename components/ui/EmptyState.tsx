import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 px-6 text-center animate-fade-in ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-muted)] flex items-center justify-center">
        <Icon className="w-7 h-7 text-white/25" />
      </div>

      <div className="space-y-1.5 max-w-xs">
        <h3 className="text-sm font-semibold text-white/60">{title}</h3>
        {description && (
          <p className="text-xs text-white/35 leading-relaxed">{description}</p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
