"use client";

import React, { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LifeBuoy, MapPin, Phone, CheckCircle2, Loader2, X, User } from "lucide-react";
import { submitSOS } from "@/services/api/sos";
import { createChatSession } from "@/services/api/chat";
import { useToast } from "@/components/ui/Toast";
import { useAppStore } from "@/stores/app-store";
import { useChatStore } from "@/stores/chat-store";
import { RiskBadge } from "@/components/ui/Badge";
import type { LocationInput } from "@/types";

const EMERGENCY_CONTACTS = [
  { name: "Darurat Nasional", number: "112", desc: "Polisi, Ambulans, Pemadam", critical: true },
  { name: "BNPB", number: "119", desc: "Badan Penanggulangan Bencana Nasional", critical: true },
  { name: "SAR Nasional", number: "115", desc: "Pencarian & Penyelamatan", critical: false },
  { name: "PMI", number: "021-7992325", desc: "Palang Merah Indonesia", critical: false },
];

export function FloatingSOS() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const [status, setStatus] = useState<"idle" | "locating" | "sending" | "sent">("idle");
  const [escalationId, setEscalationId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const detectedCity = useAppStore((s) => s.selectedCity);
  const prediction = useAppStore((s) => s.prediction);
  const activeChatSessionId = useChatStore((s) => s.activeSessionId);
  const setActiveChatSessionId = useChatStore((s) => s.setActiveSession);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSOS = useCallback(async () => {
    if (status !== "idle") return;

    setStatus("locating");

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolokasi tidak tersedia di perangkat ini."));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      });

      setStatus("sending");

      const location: LocationInput = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        city: detectedCity ?? "Unknown",
        province: detectedCity ?? "Unknown",
        display_name: detectedCity ?? "Unknown",
      };

      let sessionId = activeChatSessionId;
      if (!sessionId) {
        const session = await createChatSession(location);
        sessionId = session.session_id;
        setActiveChatSessionId(session.session_id);
      }

      const riskLabel = prediction?.risk_level?.toUpperCase() ?? "TIDAK DIKETAHUI";
      const response = await submitSOS({
        session_id: sessionId,
        situation: `Darurat banjir di ${detectedCity}. Tingkat risiko: ${riskLabel}.`,
        contact_name: contactName || "Pengguna SiagaAI",
        contact_phone: contactPhone || "Tidak tersedia",
        location,
      });

      setEscalationId(response.escalation_id);
      setStatus("sent");
      toast.success("SOS berhasil dikirim", response.message);
    } catch (err) {
      const message =
        err instanceof GeolocationPositionError
          ? "Izin lokasi ditolak. Aktifkan GPS dan coba lagi."
          : err instanceof Error
            ? err.message
            : "Gagal mengirim SOS.";
      toast.error("Gagal mengirim SOS", message);
      setStatus("idle");
    }
  }, [status, toast, detectedCity, prediction, activeChatSessionId, setActiveChatSessionId, contactName, contactPhone]);

  const reset = () => {
    setStatus("idle");
    setEscalationId(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(reset, 300);
  };

  if (pathname === "/chat") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 px-5 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform hover:scale-105 active:scale-95 group"
        aria-label="Buka Menu Darurat SOS"
      >
        <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-[sos-ring-expand_1.6s_ease-out_infinite]" />
        <LifeBuoy className="w-5 h-5" />
        <span className="font-black tracking-widest text-sm">SOS</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div
            className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-muted)] bg-[var(--bg-subtle)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <LifeBuoy className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="font-bold text-[var(--fg)]">Pusat Bantuan Darurat</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--border-muted)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {detectedCity && (
                <div className="flex items-center justify-center gap-2 mb-4 text-sm text-[var(--fg-muted)]">
                  <MapPin className="w-4 h-4" />
                  <span>{detectedCity}</span>
                  {prediction && <RiskBadge level={prediction.risk_level} size="sm" />}
                </div>
              )}

              {status === "idle" && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-subtle)]">
                    <User className="w-3.5 h-3.5 text-[var(--fg-subtle)] flex-shrink-0" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nama Anda (opsional)"
                      className="flex-1 bg-transparent text-xs text-[var(--fg)] placeholder-[var(--fg-subtle)] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-subtle)]">
                    <Phone className="w-3.5 h-3.5 text-[var(--fg-subtle)] flex-shrink-0" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="No. Telepon (opsional)"
                      className="flex-1 bg-transparent text-xs text-[var(--fg)] placeholder-[var(--fg-subtle)] outline-none"
                    />
                  </div>
                </div>
              )}

              {status !== "sent" ? (
                <div className="text-center mb-6">
                  <button
                    onClick={handleSOS}
                    disabled={status !== "idle"}
                    className={`
                      relative mx-auto w-32 h-32 rounded-full text-white font-bold text-lg
                      flex flex-col items-center justify-center gap-2 mb-4
                      transition-all duration-300
                      ${status === "idle"
                        ? "bg-red-600 hover:bg-red-500 active:scale-95"
                        : "bg-red-600/50 cursor-not-allowed"
                      }
                    `}
                  >
                    {status === "idle" && (
                      <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-[sos-ring-expand_1.6s_ease-out_infinite]" />
                    )}

                    {status === "locating" && <MapPin className="w-6 h-6 animate-pulse" />}
                    {status === "sending" && <Loader2 className="w-6 h-6 animate-spin" />}
                    {status === "idle" && <LifeBuoy className="w-6 h-6" />}

                    <span className="text-sm font-black tracking-widest">
                      {status === "idle" ? "SOS" :
                        status === "locating" ? "Lokasi..." :
                          "Mengirim..."}
                    </span>
                  </button>
                  <p className="text-xs text-[var(--fg-muted)]">
                    {status === "locating" ? "Mendapatkan lokasi GPS..." :
                      status === "sending" ? "Mengirim sinyal darurat..." :
                        "Tekan tombol untuk mengirim sinyal darurat"}
                  </p>
                </div>
              ) : (
                <div className="text-center mb-6 animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
                    <CheckCircle2 className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="font-bold text-[var(--fg)] mb-2">SOS Terkirim</h3>
                  <p className="text-sm text-[var(--fg-muted)] mb-4">
                    Tim darurat telah menerima sinyal Anda. Tetap tenang.
                  </p>
                  {escalationId && (
                    <p className="text-xs font-mono text-[var(--fg-muted)] bg-[var(--bg-subtle)] p-2 rounded-lg mb-4">
                      ID: {escalationId}
                    </p>
                  )}
                  <button
                    onClick={reset}
                    className="text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)] underline"
                  >
                    Kirim SOS Lagi
                  </button>
                </div>
              )}

              <div className="h-px w-full bg-[var(--border)] my-6" />

              <div>
                <h3 className="text-sm font-semibold text-[var(--fg-muted)] mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Hubungi Langsung
                </h3>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((c) => (
                    <a
                      key={c.number}
                      href={`tel:${c.number.replace(/[^0-9]/g, "")}`}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-subtle)] transition-colors border
                        ${c.critical ? "border-red-500/20 bg-red-500/5" : "border-[var(--border-muted)]"}
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.critical ? "bg-red-500/10 text-red-500" : "bg-[var(--bg-subtle)] text-[var(--fg-muted)]"}`}>
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--fg)]">{c.name}</p>
                        <p className="text-[10px] text-[var(--fg-muted)]">{c.desc}</p>
                      </div>
                      <span className={`text-sm font-bold font-mono ${c.critical ? "text-red-500" : "text-[var(--fg-muted)]"}`}>
                        {c.number}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
