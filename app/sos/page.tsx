"use client";

import React, { useState, useCallback } from "react";
import {
  AlertTriangle,
  MapPin,
  Phone,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Package,
  ArrowRight,
  ClipboardList,
  User,
} from "lucide-react";
import { submitSOS } from "@/services/api/sos";
import { createChatSession } from "@/services/api/chat";
import { useToast } from "@/components/ui/Toast";
import { useChatStore } from "@/stores/chat-store";
import { useAppStore } from "@/stores/app-store";
import { RiskBadge } from "@/components/ui/Badge";
import type { LocationInput } from "@/types";


const EMERGENCY_CONTACTS = [
  { name: "Darurat Nasional", number: "112", desc: "Polisi, Ambulans, Pemadam", critical: true },
  { name: "BNPB", number: "119", desc: "Badan Penanggulangan Bencana Nasional", critical: true },
  { name: "SAR Nasional", number: "115", desc: "Pencarian & Penyelamatan", critical: false },
  { name: "PMI", number: "021-7992325", desc: "Palang Merah Indonesia", critical: false },
];

const PREPAREDNESS_SECTIONS = [
  {
    id: "barang",
    icon: Package,
    title: "Barang Penting Saat Banjir",
    subtitle: "Siapkan dalam tas darurat kedap air",
    items: [
      { category: "Dokumen", things: ["KTP & KK (dalam plastik)", "Buku tabungan & ATM", "Sertifikat & akta penting", "BPJS & kartu asuransi"] },
      { category: "Kesehatan", things: ["Obat-obatan rutin", "Kotak P3K", "Masker", "Hand sanitizer"] },
      { category: "Makanan & Air", things: ["Air minum 3L/orang/hari", "Makanan siap saji 3 hari", "Susu formula (jika ada bayi)", "Makanan bayi/lansia"] },
      { category: "Perlengkapan", things: ["Senter + baterai cadangan", "Jas hujan", "Pakaian ganti 2 set", "Selimut/sleeping bag"] },
      { category: "Komunikasi", things: ["Powerbank terisi penuh", "Daftar nomor kontak darurat", "Radio transistor (opsional)"] },
    ],
  },
  {
    id: "evakuasi",
    icon: ArrowRight,
    title: "Langkah Evakuasi",
    subtitle: "Prosedur standar BNPB — ikuti urutan ini",
    steps: [
      { num: 1, text: "Pantau informasi resmi dari BMKG dan BPBD setempat." },
      { num: 2, text: "Ambil tas darurat yang sudah disiapkan sebelumnya." },
      { num: 3, text: "Matikan aliran listrik dari panel MCB dan tutup gas." },
      { num: 4, text: "Ikuti rute evakuasi yang telah ditentukan RT/RW." },
      { num: 5, text: "Pergi ke titik kumpul atau tempat pengungsian terdekat." },
      { num: 6, text: "Hubungi keluarga dan beritahu posisi Anda saat ini." },
      { num: 7, text: "Jangan kembali sebelum dinyatakan aman oleh petugas." },
    ],
  },
  {
    id: "checklist",
    icon: ClipboardList,
    title: "Checklist Kesiapsiagaan",
    subtitle: "Persiapkan sebelum musim hujan tiba",
    checks: [
      "Ketahui rute evakuasi dan titik kumpul terdekat",
      "Siapkan tas darurat dan simpan di tempat mudah dijangkau",
      "Pastikan saluran drainase sekitar rumah bersih",
      "Simpan dokumen penting dalam plastik kedap air",
      "Daftarkan anggota keluarga ke BPBD setempat",
      "Pastikan semua anggota keluarga tahu nomor darurat (112, 119)",
      "Periksa kondisi pompa air dan alarm banjir (jika ada)",
      "Koordinasi dengan RT/RW tentang rencana siaga banjir",
    ],
  },
];


function PrepSection({
  section,
  defaultOpen = false,
}: {
  section: typeof PREPAREDNESS_SECTIONS[0];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = section.icon;

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--bg-subtle)] transition-colors"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center flex-shrink-0 border border-[var(--border-muted)]">
          <Icon className="w-4 h-4 text-teal-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--fg)]">{section.title}</p>
          <p className="text-xs text-[var(--fg-muted)]">{section.subtitle}</p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[var(--fg-muted)] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--fg-muted)] flex-shrink-0" />
        )}
      </button>

      {open && (
        <div
          className="px-5 pb-5 border-t animate-fade-in"
          style={{ borderColor: "var(--border-muted)" }}
        >
          {"items" in section && section.items && (
            <div className="pt-4 grid sm:grid-cols-2 gap-4">
              {section.items.map((cat) => (
                <div key={cat.category}>
                  <p className="text-xs font-semibold text-[var(--fg-muted)] mb-2 uppercase tracking-wide">
                    {cat.category}
                  </p>
                  <ul className="space-y-1.5">
                    {cat.things.map((thing) => (
                      <li key={thing} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-[var(--fg-muted)]">{thing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {"steps" in section && section.steps && (
            <div className="pt-4 space-y-3">
              {section.steps.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">{step.num}</span>
                  </div>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          )}

          {"checks" in section && section.checks && (
            <div className="pt-4 space-y-2.5">
              {section.checks.map((check) => (
                <label
                  key={check}
                  className="flex items-start gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 rounded accent-teal-500 flex-shrink-0"
                  />
                  <span className="text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors leading-snug">
                    {check}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


export default function SOSPage() {
  const toast = useToast();
  const [status, setStatus] = useState<"idle" | "locating" | "sending" | "sent">("idle");
  const [escalationId, setEscalationId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const detectedCity = useAppStore((s) => s.selectedCity);
  const prediction = useAppStore((s) => s.prediction);
  const activeChatSessionId = useChatStore((s) => s.activeSessionId);
  const setActiveChatSessionId = useChatStore((s) => s.setActiveSession);

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
        try {
          const session = await createChatSession(location);
          sessionId = session.session_id;
          setActiveChatSessionId(session.session_id);
        } catch {

          sessionId = `sos-fallback-${Date.now()}`;
        }
      }

      const riskLabel = prediction?.risk_level?.toUpperCase() ?? "TIDAK DIKETAHUI";
      const situation = note.trim()
        ? `${note.trim()} — Tingkat risiko: ${riskLabel}`
        : `Darurat banjir di ${detectedCity}. Tingkat risiko: ${riskLabel}.`;

      const response = await submitSOS({
        session_id: sessionId,
        situation,
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
  }, [status, toast, detectedCity, prediction, activeChatSessionId, setActiveChatSessionId, note, contactName, contactPhone]);

  const reset = () => {
    setStatus("idle");
    setEscalationId(null);
    setNote("");
    setShowNote(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background overlay removed for cleaner Linear-style design */}

      <div className="relative z-10 px-4 py-8 lg:px-8 max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--fg)] mb-1.5">Darurat Banjir</h1>
          {detectedCity && (
            <div className="inline-flex items-center gap-2 text-xs text-[var(--fg-muted)] mb-2 font-medium">
              <MapPin className="w-3 h-3" />
              <span>{detectedCity}</span>
              {prediction && (
                <RiskBadge level={prediction.risk_level} size="sm" />
              )}
            </div>
          )}
          <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-sm mx-auto mt-1">
            Jika Anda dalam situasi darurat banjir, kirimkan sinyal SOS atau
            hubungi nomor darurat di bawah ini segera.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>Lokasi darurat akan menggunakan lokasi GPS perangkat Anda saat ini.</span>
          </div>
        </div>

        {status !== "sent" ? (
          <div className="card p-6 text-center mb-6 border border-red-500/50 dark:border-red-500/20 space-y-4 shadow-sm relative overflow-hidden bg-[var(--bg-elevated)]">

            {/* Contact info fields */}
            <div className="relative z-10 space-y-2 text-left">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-subtle)]">
                <User className="w-3.5 h-3.5 text-[var(--fg-muted)] flex-shrink-0" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nama Anda (opsional)"
                  disabled={status !== "idle"}
                  className="flex-1 bg-transparent text-xs text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none"
                />
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border-muted)] bg-[var(--bg-subtle)]">
                <Phone className="w-3.5 h-3.5 text-[var(--fg-muted)] flex-shrink-0" />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="No. Telepon (opsional)"
                  disabled={status !== "idle"}
                  className="flex-1 bg-transparent text-xs text-[var(--fg)] placeholder-[var(--fg-muted)] outline-none"
                />
              </div>
            </div>

            <button
              id="sos-submit-btn"
              onClick={handleSOS}
              disabled={status !== "idle"}
              className={`
                relative mx-auto w-36 h-36 rounded-full text-white font-bold text-lg
                flex flex-col items-center justify-center gap-2
                transition-all duration-300 shadow-md
                ${status === "idle"
                  ? "bg-red-600 hover:bg-red-500 active:scale-95 shadow-red-500/30"
                  : "bg-red-600/50 cursor-not-allowed"
                }
              `}
              aria-label="Kirim sinyal SOS darurat"
            >
              {status === "idle" && (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-red-500/40 sos-pulse-ring" />
                  <span className="absolute inset-0 rounded-full border-2 border-red-500/25 sos-pulse-ring" style={{ animationDelay: "0.5s" }} />
                </>
              )}

              {status === "locating" && <MapPin className="w-7 h-7 animate-pulse text-white" />}
              {status === "sending" && <Loader2 className="w-7 h-7 animate-spin text-white" />}
              {status === "idle" && <AlertTriangle className="w-7 h-7 text-white" />}

              <span className="text-base font-black tracking-widest text-white">
                {status === "idle" ? "SOS" :
                  status === "locating" ? "Lokasi..." :
                    "Mengirim..."}
              </span>
            </button>

            <p className="text-xs font-medium text-[var(--fg-muted)] relative z-10">
              {status === "locating" ? "Mendapatkan lokasi GPS..." :
                status === "sending" ? "Mengirim sinyal darurat..." :
                  "Tekan tombol untuk mengirim sinyal darurat"}
            </p>

            <div className="relative z-10">
              <button
                onClick={() => setShowNote((v) => !v)}
                className="text-[11px] font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                {showNote ? "▲ Sembunyikan catatan" : "▼ Tambah catatan singkat (opsional)"}
              </button>
              {showNote && (
                <div className="mt-2.5 text-left animate-fade-in">
                  <input
                    id="sos-note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 100))}
                    placeholder="Contoh: 2 orang terjebak di lantai 1..."
                    disabled={status !== "idle"}
                    maxLength={100}
                    className="input w-full px-3 py-2 text-sm"
                  />
                  <p className="text-[10px] text-[var(--fg-muted)] text-right mt-1 font-mono">{note.length}/100</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center mb-6 border border-teal-500/50 dark:border-teal-500/20 animate-scale-in bg-[var(--bg-elevated)]">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
              <CheckCircle2 className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <h2 className="text-lg font-bold text-teal-800 dark:text-teal-300 mb-2">SOS Berhasil Dikirim</h2>
            <p className="text-sm text-teal-700/80 dark:text-teal-400/80 mb-4 leading-relaxed font-medium">
              Tim darurat telah menerima sinyal Anda. Tetap tenang dan tunggu
              instruksi dari petugas.
            </p>
            {escalationId && (
              <p className="text-[11px] font-mono text-teal-600/70 dark:text-teal-400/60 mb-6">
                ID Laporan: {escalationId}
              </p>
            )}
            <button
              onClick={reset}
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Kirim SOS Lagi
            </button>
          </div>
        )}

        <div className="card p-6 mb-6 shadow-sm" id="contacts">
          <h2 className="text-sm font-semibold text-[var(--fg-muted)] mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--fg-muted)]" />
            Nomor Darurat
          </h2>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((c) => (
              <a
                key={c.number}
                href={`tel:${c.number.replace(/[^0-9]/g, "")}`}
                className={`
                  flex items-center gap-3 p-3.5 rounded-xl
                  hover:bg-[var(--bg-subtle)] hover:shadow-sm transition-all group
                  ${c.critical ? "border border-red-500/50 dark:border-red-500/20 bg-[var(--bg-elevated)]" : "border border-[var(--border)] bg-transparent"}
                `}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.critical ? "bg-red-500/10 border border-red-500/20" : "bg-[var(--bg-subtle)] border border-[var(--border)]"}`}>
                  <Phone className={`w-4 h-4 ${c.critical ? "text-red-600 dark:text-red-400" : "text-[var(--fg-muted)]"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold transition-colors ${c.critical ? "text-red-700 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-red-300" : "text-[var(--fg)] group-hover:text-[var(--fg)]"}`}>
                    {c.name}
                  </p>
                  <p className="text-xs text-[var(--fg-muted)] mt-0.5">{c.desc}</p>
                </div>
                <span className={`text-lg font-bold font-mono tracking-tight ${c.critical ? "text-red-600 dark:text-red-400" : "text-[var(--fg-muted)]"}`}>
                  {c.number}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4" id="preparedness">
          <div className="flex items-center gap-2 px-1 mb-2">
            <h2 className="text-sm font-bold text-[var(--fg-muted)]">Panduan Kesiapsiagaan</h2>
            <span className="text-[10px] text-[var(--fg-muted)] font-medium uppercase tracking-wider">— Standar BNPB</span>
          </div>

          {PREPAREDNESS_SECTIONS.map((section, idx) => (
            <PrepSection
              key={section.id}
              section={section}
              defaultOpen={idx === 0}
            />
          ))}
        </div>

        <p className="text-[11px] font-medium text-[var(--fg-muted)] text-center mt-8 leading-relaxed max-w-sm mx-auto">
          Selalu ikuti arahan petugas BPBD dan BNPB setempat.<br />
          Informasi ini berdasarkan panduan resmi BNPB.
        </p>
      </div>
    </div>
  );
}
