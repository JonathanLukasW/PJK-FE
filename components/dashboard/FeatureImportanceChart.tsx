"use client";

import React from "react";
import type { FeatureImportance } from "@/types";


const FEATURE_LABELS: Record<string, string> = {
  rainfall_24h: "Curah Hujan 24 Jam",
  rainfall_3h: "Curah Hujan 3 Jam",
  rainfall_1h: "Curah Hujan 1 Jam",
  humidity: "Kelembapan Udara",
  temperature: "Suhu Udara",
  wind_speed: "Kecepatan Angin",
  city_risk: "Risiko Kota",
  soil_type_encoded: "Jenis Tanah",
  month: "Bulan",
};

const DIRECTION_CONFIG = {
  increase_risk: { color: "bg-red-500/70", label: "Meningkatkan risiko" },
  decrease_risk: { color: "bg-teal-500/70", label: "Menurunkan risiko" },
  context: { color: "bg-slate-500/50", label: "Konteks" },
} as const;

interface FeatureImportanceChartProps {

  features: FeatureImportance[];
}

export function FeatureImportanceChart({ features }: FeatureImportanceChartProps) {
  if (!features || !features.length) return null;

  const maxImportance = Math.max(...features.map((f) => f.importance));

  return (
    <div className="card p-5 space-y-4 animate-slide-up stagger-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--fg-muted)]">
          Faktor Penyumbang Risiko
        </h3>
        <div className="flex items-center gap-3 text-[10px] text-[var(--fg-subtle)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500/70" />
            Meningkatkan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500/70" />
            Menurunkan
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((feature) => {
          const label = FEATURE_LABELS[feature.feature] ?? feature.feature;
          const config = DIRECTION_CONFIG[feature.direction];
          const barWidth = (feature.importance / maxImportance) * 100;
          const importancePct = (feature.importance * 100).toFixed(1);

          return (
            <div key={feature.feature} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[var(--fg-muted)] font-medium">
                  {label}
                </span>
                <span className="text-[11px] font-mono text-[var(--fg-subtle)]">
                  {importancePct}%
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-[var(--border-muted)] overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${config.color}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <p className="text-[10px] text-[var(--fg-subtle)] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Nilai saat ini: {feature.value} — {config.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
