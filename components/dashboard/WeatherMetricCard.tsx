import React from "react";
import type { LucideIcon } from "lucide-react";

interface WeatherMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  sublabel?: string;
  accentClass?: string;
  size?: "lg" | "sm";
}

export const WeatherMetricCard = React.memo(function WeatherMetricCard({
  icon: Icon,
  label,
  value,
  unit,
  sublabel,
  accentClass = "text-[var(--fg)]",
  size = "sm",
}: WeatherMetricCardProps) {
  const isLg = size === "lg";

  return (
    <div className={`card-metric ${isLg ? "p-5" : "p-4"}`}>
      <div className={`flex items-center gap-2 ${isLg ? "mb-3.5" : "mb-3"}`}>
        <div className={`${isLg ? "w-8 h-8" : "w-7 h-7"} rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center flex-shrink-0`}>
          <Icon className={`${isLg ? "w-4 h-4" : "w-3.5 h-3.5"} text-[var(--fg-muted)]`} />
        </div>
        <span className={`${isLg ? "text-sm" : "text-xs"} text-[var(--fg-muted)] font-medium leading-tight`}>
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`${isLg ? "text-2xl" : "text-xl"} font-bold tabular-nums ${accentClass}`}>
          {typeof value === "number" ? value.toLocaleString("id-ID") : value}
        </span>
        <span className={`${isLg ? "text-sm" : "text-xs"} text-[var(--fg-subtle)] font-medium`}>{unit}</span>
      </div>

      {sublabel && (
        <p className="text-[10px] text-[var(--fg-subtle)] mt-1">{sublabel}</p>
      )}
    </div>
  );
});

