"use client";

import React from "react";
import { Cpu, Clock, CheckCircle2, AlertTriangle, WifiOff, Database, Info, Wifi } from "lucide-react";
import type { PredictResponse } from "@/types";
import { useAPIHealth } from "@/hooks/useAPIHealth";
import { useModelInfo } from "@/hooks/useModelInfo";
import { useAppStore } from "@/stores/app-store";

interface SystemInsightsProps {
  prediction: PredictResponse;
}

export function SystemInsights({ prediction }: SystemInsightsProps) {
  const health = useAPIHealth();
  const modelInfo = useModelInfo();
  const connectionMode = useAppStore((s) => s.connectionMode);

  const healthIcon =
    health.status === "healthy" || health.status === "loaded" ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> :
      health.status === "degraded" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
        health.status === "offline" ? <WifiOff className="w-3.5 h-3.5 text-red-400" /> :
          <CheckCircle2 className="w-3.5 h-3.5 text-white/20" />;

  const healthLabel =
    health.status === "healthy" || health.status === "loaded" ? "Backend Aktif" :
      health.status === "degraded" ? "Terdegradasi" :
        health.status === "offline" ? "Offline" :
          "Memeriksa...";

  const healthColor =
    health.status === "healthy" || health.status === "loaded" ? "text-teal-300" :
      health.status === "degraded" ? "text-amber-300" :
        health.status === "offline" ? "text-red-300" :
          "text-white/30";

  const modeLabel =
    connectionMode === "live" ? "Live — Data Real" :
      connectionMode === "mock" ? "Mode Simulasi" :
        "Fallback — Backend Offline";

  const modeColor =
    connectionMode === "live" ? "text-teal-300" :
      connectionMode === "mock" ? "text-amber-300" :
        "text-red-300";

  const ModeIcon = connectionMode === "live" ? Wifi : connectionMode === "mock" ? Database : WifiOff;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-white/25" />
        <span className="text-xs font-semibold text-white/50">
          Informasi Sistem
        </span>
      </div>

      <div className="flex items-center justify-between py-2 border-b"
        style={{ borderColor: "var(--border-muted)" }}>
        <div className="flex items-center gap-2">
          <ModeIcon className="w-3.5 h-3.5 text-white/25" />
          <span className={`text-xs font-medium ${modeColor}`}>{modeLabel}</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-b"
        style={{ borderColor: "var(--border-muted)" }}>
        <div className="flex items-center gap-2">
          {healthIcon}
          <span className={`text-xs font-medium ${healthColor}`}>{healthLabel}</span>
        </div>
        {health.latency && (
          <span className="text-[10px] font-mono text-white/20">{health.latency}ms</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--bg-subtle)] rounded-lg p-2.5 space-y-1">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-white/25" />
            <span className="text-[10px] text-white/30">Tipe Model</span>
          </div>
          <p className="text-xs font-mono text-white/55 leading-tight">
            {modelInfo.data?.model_type ?? prediction.model_version}
          </p>
        </div>

          <div className="bg-[var(--bg-subtle)] rounded-lg p-2.5 space-y-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/25" />
            <span className="text-[10px] text-white/30">Latensi</span>
          </div>
          <p className="text-xs font-mono text-white/55">
            {prediction.inference_ms}ms
          </p>
        </div>

        {modelInfo.data && (
          <>
              <div className="bg-[var(--bg-subtle)] rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-white/25" />
                <span className="text-[10px] text-white/30">Akurasi</span>
              </div>
              <p className="text-xs font-mono text-white/55">
                {(modelInfo.data.accuracy * 100).toFixed(1)}%
              </p>
            </div>

              <div className="bg-[var(--bg-subtle)] rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-white/25" />
                <span className="text-[10px] text-white/30">Fitur Model</span>
              </div>
              <p className="text-xs font-mono text-white/55">
                {modelInfo.data.n_features} atribut
              </p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-1">
        {health.modelVersion && (
          <p className="text-[10px] font-mono text-white/15">
            v{health.modelVersion}
          </p>
        )}
        {health.lastChecked && (
          <p className="text-[10px] text-white/15">
            Dicek:{" "}
            {health.lastChecked.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      <p className="text-[10px] text-white/20 leading-relaxed">
        Prediksi dihasilkan oleh model XGBoost berbasis data historis BMKG.
        Hasil bersifat indikatif.
      </p>
    </div>
  );
}

