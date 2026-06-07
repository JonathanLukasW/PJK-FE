"use client";

import React from "react";
import { MapPin, X, Navigation } from "lucide-react";

interface LocationPermissionModalProps {
  onAllow: () => void;
  onDeny: () => void;
  isLoading?: boolean;
}

export function LocationPermissionModal({
  onAllow,
  onDeny,
  isLoading = false,
}: LocationPermissionModalProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onDeny}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="geo-modal-title"
        className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4 animate-scale-in"
      >
        <div
          className="card p-6 shadow-2xl"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <button
            onClick={onDeny}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-subtle)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/15 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-teal-400" />
          </div>

          <h2
            id="geo-modal-title"
            className="text-base font-bold text-[var(--fg)] mb-2"
          >
            Deteksi Lokasi Otomatis
          </h2>
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-5">
            SiagaAI dapat memantau risiko banjir di <strong className="text-[var(--fg)]">kota Anda saat ini</strong> secara otomatis menggunakan data lokasi GPS.
          </p>

          <div className="space-y-2 mb-6">
            {[
              "Prediksi risiko banjir otomatis untuk kota Anda",
              "Tidak perlu memilih kota secara manual",
              "Lokasi tidak disimpan di server",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400/60 flex-shrink-0" />
                <p className="text-xs text-[var(--fg-muted)]">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              id="geo-allow-btn"
              onClick={onAllow}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Mendeteksi lokasi...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Izinkan Deteksi Lokasi
                </>
              )}
            </button>
            <button
              id="geo-deny-btn"
              onClick={onDeny}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl text-sm text-[var(--fg-subtle)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Pilih Kota Manual
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
