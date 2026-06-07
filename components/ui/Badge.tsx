import React from "react";
import type { RiskLevel } from "@/types";


interface RiskBadgeConfig {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
}


const RISK_BADGE: Record<RiskLevel, RiskBadgeConfig> = {
  aman: {
    bg: "bg-teal-500/10",
    text: "text-teal-300",
    border: "border-teal-500/20",
    dot: "bg-teal-400",
    label: "AMAN",
  },
  waspada: {
    bg: "bg-amber-500/10",
    text: "text-amber-300",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    label: "WASPADA",
  },
  siaga: {
    bg: "bg-orange-500/10",
    text: "text-orange-300",
    border: "border-orange-500/20",
    dot: "bg-orange-400",
    label: "SIAGA",
  },
  awas: {
    bg: "bg-red-500/10",
    text: "text-red-300",
    border: "border-red-500/20",
    dot: "bg-red-400",
    label: "AWAS",
  },
};

interface RiskBadgeProps {
  level: RiskLevel;
  showDot?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({
  level,
  showDot = true,
  size = "md",
  className = "",
}: RiskBadgeProps) {
  const config = RISK_BADGE[level] ?? RISK_BADGE.waspada;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
    lg: "px-3 py-1.5 text-sm gap-2",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wide rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full flex-shrink-0 ${config.dot}`}
        />
      )}
      {config.label}
    </span>
  );
}


interface StatusBadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "muted";
  className?: string;
}

export function StatusBadge({
  label,
  variant = "default",
  className = "",
}: StatusBadgeProps) {
  const variantClasses = {
    default: "bg-[var(--bg-subtle)] text-[var(--fg-muted)] border-[var(--border-muted)]",
    success: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    muted: "bg-[var(--bg-subtle)] text-[var(--fg-subtle)] border-[var(--border-muted)]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${variantClasses} ${className}`}
    >
      {label}
    </span>
  );
}
