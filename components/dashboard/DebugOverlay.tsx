"use client";

import React, { useState } from "react";
import { useAppStore } from "@/stores/app-store";

export function DebugOverlay() {
  const [expanded, setExpanded] = useState(true);

  const selectedCity = useAppStore((s) => s.selectedCity);
  const weatherData = useAppStore((s) => s.weatherData);
  const prediction = useAppStore((s) => s.prediction);
  const weatherSource = useAppStore((s) => s.weatherSource);
  const predictionSource = useAppStore((s) => s.predictionSource);
  const dashboardStatus = useAppStore((s) => s.dashboardStatus);
  const lastUpdated = useAppStore((s) => s.lastUpdated);

  const weatherCity = weatherData.city_name;
  const predictionCity = prediction?.message ? selectedCity : null;

  const cityMismatch =
    weatherCity !== selectedCity ||
    (predictionCity !== null && predictionCity !== selectedCity);

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] font-mono text-[10px] max-w-[280px]"
      style={{
        background: "rgba(0,0,0,0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        color: "#e2e8f0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 font-semibold text-[11px] text-slate-300 hover:text-white"
      >
        <span>🛠 Debug Panel</span>
        <span>{expanded ? "▾" : "▸"}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-1.5">
          {cityMismatch && (
            <div className="bg-red-500/20 text-red-400 border border-red-500/30 rounded px-2 py-1 text-[10px] font-bold">
              ⚠ CITY MISMATCH DETECTED
            </div>
          )}

          <Row label="Selected City" value={selectedCity} />
          <Row label="Weather City" value={weatherCity} highlight={weatherCity !== selectedCity} />
          <Row label="Prediction City" value={predictionCity ?? "—"} highlight={predictionCity !== null && predictionCity !== selectedCity} />

          <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <Row label="Weather Source" value={weatherSource} />
          <Row label="Prediction Source" value={predictionSource} />

          <hr style={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <Row label="Dashboard Status" value={dashboardStatus} />
          <Row
            label="Timestamp"
            value={
              lastUpdated
                ? lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
                : "—"
            }
          />
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span style={{ color: "rgba(255,255,255,0.4)" }}>{label}:</span>
      <span className={`truncate max-w-[130px] ${highlight ? "text-red-400 font-bold" : "text-green-400"}`}>
        {value}
      </span>
    </div>
  );
}
