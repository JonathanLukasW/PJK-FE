"use client";

import { useEffect, useCallback } from "react";
import { getHealth, getModelInfo } from "@/services/api/ml";
import { useAppStore } from "@/stores/app-store";

const POLL_INTERVAL_MS = 120_000;

export function GlobalHealthCheck() {
  const setApiHealth = useAppStore((s) => s.setApiHealth);
  const setModelInfo = useAppStore((s) => s.setModelInfo);
  const setConnectionMode = useAppStore((s) => s.setConnectionMode);

  const checkHealth = useCallback(async () => {
    setApiHealth({ isChecking: true });
    setModelInfo({ isLoading: true });

    try {
      const [healthResult, modelResult] = await Promise.all([
        getHealth().catch(() => null),
        getModelInfo().catch(() => null)
      ]);

      if (healthResult) {
        const mode = healthResult.mode;
        const data = healthResult.data;

        console.log("[API HEALTH]", data);
        setConnectionMode(mode);
        setApiHealth({
          isOnline: data.status === "healthy" || data.status === "degraded" || data.status === "loaded",
          status: data.status,
          latency: data.latency_ms ?? null,
          modelVersion: data.model_version ?? data.version ?? null,
          lastChecked: new Date(),
          isChecking: false,
          connectionMode: mode,
        });
      } else {
        throw new Error("Health check failed");
      }

      if (modelResult) {
        console.log("[MODEL INFO]", modelResult.data);
        setModelInfo({
          data: modelResult.data,
          isLoading: false,
          error: null,
          connectionMode: modelResult.mode,
        });
      } else {
        setModelInfo({
          data: null,
          isLoading: false,
          error: "Gagal memuat model info",
          connectionMode: "fallback",
        });
      }

    } catch {
      setConnectionMode("fallback");
      setApiHealth({
        isOnline: false,
        status: "offline",
        latency: null,
        modelVersion: null,
        lastChecked: new Date(),
        isChecking: false,
        connectionMode: "fallback",
      });
      setModelInfo({
        data: null,
        isLoading: false,
        error: "Gagal terhubung ke backend",
        connectionMode: "fallback",
      });
    }
  }, [setApiHealth, setModelInfo, setConnectionMode]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return null;
}
