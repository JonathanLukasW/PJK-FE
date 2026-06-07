"use client";

import React, { useEffect, useState } from "react";
import type { RiskLevel } from "@/types";
import { getRiskTheme } from "@/lib/risk-theme";

interface RiskChartProps {
  probability: number;
  riskLevel: RiskLevel;
  label?: string;
}

export default function RiskChart({
  probability,
  riskLevel,
  label = "Probabilitas Banjir",
}: RiskChartProps) {
  const theme = getRiskTheme(riskLevel);

  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(probability), 80);
    return () => clearTimeout(timer);
  }, [probability]);

  const percentage = Math.round(displayValue * 100);
  const arcDegrees = displayValue * 270;

  const gaugeGradient = `conic-gradient(
    from 135deg,
    ${theme.gaugeColor} 0deg,
    ${theme.gaugeColorEnd} ${arcDegrees}deg,
    rgba(255,255,255,0.04) ${arcDegrees}deg,
    rgba(255,255,255,0.04) 270deg,
    transparent 270deg
  )`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-52 h-52">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 135deg,
              rgba(255,255,255,0.04) 0deg,
              rgba(255,255,255,0.04) 270deg,
              transparent 270deg
            )`,
          }}
        />

        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={{ background: gaugeGradient }}
        />

        <div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            inset: "18px",
            background: "var(--bg-card)",
          }}
        >
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <span
              className="text-4xl font-bold tabular-nums leading-none transition-colors duration-500"
              style={{ color: theme.gaugeColor }}
            >
              {percentage}
              <span className="text-base font-medium opacity-50">%</span>
            </span>
            <span
              className={`text-xs font-semibold tracking-wide px-2.5 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}
            >
              {riskLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-0.5">
        <p className="text-xs font-medium text-white/50">{label}</p>
        <p className="text-[11px] text-white/30">{theme.description}</p>
      </div>
    </div>
  );
}
