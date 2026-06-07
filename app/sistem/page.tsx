"use client";

import React, { useState, useEffect } from "react";
import {
  Activity, Cpu, Database, CheckCircle2, WifiOff, AlertTriangle,
  Clock, Server, Zap,
} from "lucide-react";
import { useAPIHealth } from "@/hooks/useAPIHealth";
import { useModelInfo } from "@/hooks/useModelInfo";
export default function SistemPage() {
  const health = useAPIHealth();
  const modelInfo = useModelInfo();

  const [lastUpdated, setLastUpdated] = useState<string>("");
  useEffect(() => {
    setTimeout(() => setLastUpdated(
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    ), 0);
  }, []);




  const isOnline = health.isOnline;

  const healthIcon =
    health.status === "healthy" || health.status === "loaded"
      ? <CheckCircle2 className="w-5 h-5 text-teal-400" />
      : health.status === "degraded"
        ? <AlertTriangle className="w-5 h-5 text-amber-400" />
        : health.status === "offline"
          ? <WifiOff className="w-5 h-5 text-red-400" />
          : <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-teal-400 animate-spin" />;

  const healthTitle =
    health.status === "healthy" || health.status === "loaded"
      ? "Sistem Berjalan Normal"
      : health.status === "degraded"
        ? "Performa Terdegradasi"
        : health.status === "offline"
          ? "Backend Offline"
          : "Memeriksa status...";

  const healthColor =
    health.status === "healthy" || health.status === "loaded"
      ? "text-teal-600 dark:text-teal-400"
      : health.status === "degraded"
        ? "text-amber-600 dark:text-amber-400"
        : health.status === "offline"
          ? "text-red-600 dark:text-red-400"
          : "text-[var(--fg-muted)]";


  const backendStatusLabel = isOnline ? "Online" : health.status === "offline" ? "Offline" : "Memeriksa...";
  const backendStatusColor = isOnline
    ? "text-teal-600 dark:text-teal-400"
    : health.status === "offline"
      ? "text-red-600 dark:text-red-400"
      : "text-amber-600 dark:text-amber-400";
  const backendDotColor = isOnline ? "bg-teal-500" : health.status === "offline" ? "bg-red-500" : "bg-amber-500";


  const mlStatusLabel = modelInfo.connectionMode === "live" ? "Online" : "Fallback (Offline)";
  const mlStatusColor = modelInfo.connectionMode === "live"
    ? "text-teal-600 dark:text-teal-400"
    : "text-amber-600 dark:text-amber-400";
  const mlDotColor = modelInfo.connectionMode === "live" ? "bg-teal-500" : "bg-amber-500";


  const endpoints = [
    { label: "Prediksi ML", desc: "POST /api/ml/predict", ok: isOnline },
    { label: "Prediksi Auto", desc: "POST /api/ml/predict-auto", ok: isOnline },
    { label: "Health Check", desc: "GET /api/ml/health", ok: isOnline },
    { label: "Info Model", desc: "GET /api/ml/model-info", ok: isOnline },
    { label: "SOS Darurat", desc: "POST /api/escalate", ok: isOnline },
    { label: "Asisten AI", desc: "POST /api/chat/send", ok: isOnline },
  ];

  return (
    <div className="px-4 py-6 lg:px-8 max-w-[1600px] mx-auto space-y-6 animate-fade-in">

      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--fg)] mb-1">Status Sistem & Analitik</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Status backend dan informasi model
        </p>
      </div>

      <div className="card p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between mb-4 border-b border-[var(--border-muted)] pb-3">
          <h2 className="text-sm font-semibold text-[var(--fg-muted)]">Ringkasan Status Sistem</h2>
          <span className="text-[10px] text-[var(--fg-subtle)] font-mono">
            Last Updated: {lastUpdated || "--:--"} WIB
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-muted)]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--fg-subtle)]">Backend API</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${backendDotColor}`} />
              <span className={`text-xs font-semibold ${backendStatusColor}`}>
                {backendStatusLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-muted)]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--fg-subtle)]">ML Service</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${mlDotColor}`} />
              <span className={`text-xs font-semibold ${mlStatusColor}`}>
                {mlStatusLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-muted)]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--fg-subtle)]">Weather Data</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-teal-500" : "bg-amber-500"}`} />
              <span className={`text-xs font-semibold ${isOnline ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400"}`}>
                {isOnline ? "Live" : "Fallback (Offline)"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-muted)]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--fg-subtle)]">Dashboard Data</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-teal-500" : "bg-amber-500"}`} />
              <span className={`text-xs font-semibold ${isOnline ? "text-teal-600 dark:text-teal-400" : "text-amber-600 dark:text-amber-400"}`}>
                {isOnline ? "Live" : "Fallback (Offline)"}
              </span>
            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="card p-5 space-y-4" id="health">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-500" />
            <h2 className="text-sm font-semibold text-[var(--fg-muted)]">Status Backend</h2>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-subtle)]"
            style={{ border: "1px solid var(--border-muted)" }}>
            {healthIcon}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${healthColor}`}>{healthTitle}</p>
              {health.latency && (
                <p className="text-xs text-[var(--fg-subtle)]">Latensi: {health.latency}ms</p>
              )}
            </div>
            {health.lastChecked && (
              <span className="text-[10px] font-mono text-[var(--fg-subtle)]">
                {health.lastChecked.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {endpoints.map(({ label, desc, ok }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ok ? "bg-teal-500" : "bg-amber-500"}`} />
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-xs text-[var(--fg-muted)]">{label}</span>
                  <span className="text-[10px] text-[var(--fg-subtle)] truncate">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-muted)]">
            <div className="flex items-center gap-1.5">
              <Server className="w-3 h-3 text-[var(--fg-subtle)]" />
              <span className="text-[10px] font-mono text-[var(--fg-subtle)]">
                {health.isChecking ? "Memeriksa koneksi..." : `Backend: ${health.status}`}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4" id="model">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-500" />
              <h2 className="text-sm font-semibold text-[var(--fg-muted)]">Informasi Model</h2>
            </div>
            {modelInfo.connectionMode !== "live" && (
              <span className="text-[10px] text-[var(--fg-subtle)] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)]">
                {modelInfo.connectionMode === "mock" ? "Simulasi" : "Fallback"}
              </span>
            )}
          </div>

          {modelInfo.isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-8 rounded-lg" />
              ))}
            </div>
          ) : modelInfo.data ? (
            <>
              <div className="space-y-3">
                {[
                  { label: "Tipe Model", icon: Cpu, value: modelInfo.data.model_type },
                  { label: "Versi", icon: Database, value: modelInfo.data.model_version },
                  { label: "Tanggal Pelatihan", icon: Clock, value: new Date(modelInfo.data.trained_at).toLocaleString('id-ID') },
                  { label: "Akurasi Model", icon: Zap, value: `${(modelInfo.data.accuracy * 100).toFixed(1)}%` },
                  { label: "Total Fitur", icon: Database, value: `${modelInfo.data.n_features} atribut` },
                ].map(({ label, icon: Icon, value }) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-[var(--border-muted)] last:border-0">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3 text-[var(--fg-subtle)]" />
                      <span className="text-xs text-[var(--fg-muted)]">{label}</span>
                    </div>
                    <span className="text-xs font-mono text-[var(--fg)]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-1">
                <p className="text-[10px] text-[var(--fg-subtle)] mb-1.5">Top 5 Fitur Penting:</p>
                <div className="flex flex-wrap gap-1.5">
                  {modelInfo.data.top5_features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--fg-muted)]"
                    >
                      {feature.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--fg-subtle)]">Gagal memuat informasi model.</p>
          )}
        </div>
      </div>

    </div>
  );
}
