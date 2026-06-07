"use client";

import React from "react";
import type { FeatureImportance } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface FeatureImportanceTableProps {
  features: FeatureImportance[];
}

const FEATURE_LABELS: Record<string, string> = {
  rainfall_24h: "Curah Hujan 24 Jam",
  soil_type_encoded: "Jenis Tanah",
  city_risk: "Risiko Kota",
  humidity: "Kelembapan",
  rainfall_3h: "Curah Hujan 3 Jam",
  temperature: "Suhu",
  wind_speed: "Kecepatan Angin",
  rainfall_1h: "Curah Hujan 1 Jam",
  month: "Bulan",
};

const DIRECTION_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  increase_risk: { icon: TrendingUp, color: "text-red-400", label: "Meningkatkan" },
  decrease_risk: { icon: TrendingDown, color: "text-emerald-400", label: "Menurunkan" },
  context: { icon: Minus, color: "text-white/30", label: "Konteks" },
};

export default function FeatureImportanceTable({ features }: FeatureImportanceTableProps) {
  const maxImportance = Math.max(...features.map((f) => f.importance), 0.001);

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5">
        <h3 className="text-sm font-bold text-white tracking-wide">
          🔍 Feature Importance (XAI)
        </h3>
        <p className="text-xs text-white/30 mt-1">
          Kontribusi setiap parameter terhadap prediksi risiko banjir
        </p>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {features.map((feature, index) => {
          const barWidth = (feature.importance / maxImportance) * 100;
          const dirConfig = DIRECTION_CONFIG[feature.direction] ?? DIRECTION_CONFIG.context;
          const DirIcon = dirConfig.icon;

          return (
            <div
              key={feature.feature}
              className="px-5 py-3 flex items-center gap-4 hover:bg-[var(--bg-subtle)] transition-colors group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="w-6 text-xs font-mono text-white/20 text-right flex-shrink-0">
                {index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-white/70 truncate">
                    {FEATURE_LABELS[feature.feature] ?? feature.feature}
                  </span>
                  <span className="text-xs font-mono text-white/40 ml-2 flex-shrink-0">
                    {(feature.importance * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      background:
                        feature.direction === "increase_risk"
                          ? "linear-gradient(90deg, #f87171, #ef4444)"
                          : feature.direction === "decrease_risk"
                            ? "linear-gradient(90deg, #34d399, #10b981)"
                            : "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                    }}
                  />
                </div>
              </div>

              <span className="text-xs font-mono text-white/30 w-16 text-right flex-shrink-0">
                {typeof feature.value === "number"
                  ? feature.value % 1 === 0
                    ? feature.value.toString()
                    : feature.value.toFixed(2)
                  : feature.value}
              </span>

              <div
                className={`flex items-center gap-1 flex-shrink-0 ${dirConfig.color}`}
                title={dirConfig.label}
              >
                <DirIcon className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
