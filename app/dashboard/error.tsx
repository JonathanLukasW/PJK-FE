"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>

      <h2 className="text-lg font-semibold text-white/70 mb-2">
        Dashboard gagal dimuat
      </h2>
      <p className="text-sm text-white/35 max-w-sm leading-relaxed mb-6">
        Terjadi kesalahan saat memuat dashboard. Silakan coba lagi, atau hubungi
        administrator jika masalah berlanjut.
      </p>

      {error.digest && (
        <p className="text-[10px] font-mono text-white/20 mb-6">
          Error ID: {error.digest}
        </p>
      )}

      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-sm font-medium text-teal-300 hover:bg-teal-500/20 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </button>
    </div>
  );
}
