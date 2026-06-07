"use client";

import React from "react";
import { Database, Wifi, WifiOff } from "lucide-react";
import type { ConnectionMode } from "@/stores/app-store";

interface ConnectionStatusProps {
  connectionMode: ConnectionMode;
  lastUpdated: Date | null;
}

const MODE_CONFIG: Record<ConnectionMode, {
  icon: React.ElementType;
  label: string;
  source: string;
  dotClass: string;
}> = {
  live: {
    icon: Wifi,
    label: "Backend Aktif",
    source: "BMKG via OpenWeatherMap",
    dotClass: "bg-teal-400",
  },
  mock: {
    icon: Database,
    label: "Mode Simulasi",
    source: "Data Simulasi (Mock)",
    dotClass: "bg-amber-400",
  },
  fallback: {
    icon: WifiOff,
    label: "Backend Offline",
    source: "Data Lokal — Fallback",
    dotClass: "bg-red-400",
  },
};

export function ConnectionStatus({ connectionMode, lastUpdated }: ConnectionStatusProps) {
  const config = MODE_CONFIG[connectionMode];
  const Icon = config.icon;

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-white/30"
      style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-muted)" }}
    >
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotClass}`} />
        <Icon className="w-3 h-3 text-white/20" />
        <span className="text-white/35 font-medium">{config.label}</span>
      </div>

      <span className="text-white/15">·</span>

      <span>
        Sumber:{" "}
        <span className="text-white/45">{config.source}</span>
      </span>

      {lastUpdated && (
        <span className="ml-auto font-mono text-white/20 flex-shrink-0">
          Diperbarui{" "}
          {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
        </span>
      )}
    </div>
  );
}
