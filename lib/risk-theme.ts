import type { RiskLevel } from "@/types";

export interface RiskThemeConfig {
  label: string;
  description: string;
  bgOverlay: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  accent: string;
  gaugeColor: string;
  gaugeColorEnd: string;
  fillColor: string;
}

export const RISK_THEMES: Record<RiskLevel, RiskThemeConfig> = {
  aman: {
    label: "AMAN",
    description: "Tidak ada ancaman banjir terdeteksi",
    bgOverlay: "from-teal-500/8 to-transparent",
    badgeBg: "bg-teal-500/10",
    badgeText: "text-teal-300",
    borderAccent: "border-teal-500/40",
    accent: "text-teal-400",
    gaugeColor: "#14b8a6",
    gaugeColorEnd: "#0d9488",
    fillColor: "bg-teal-500",
  },
  waspada: {
    label: "WASPADA",
    description: "Potensi banjir ringan — pantau kondisi cuaca",
    bgOverlay: "from-amber-500/8 to-transparent",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-300",
    borderAccent: "border-amber-500/40",
    accent: "text-amber-400",
    gaugeColor: "#f59e0b",
    gaugeColorEnd: "#d97706",
    fillColor: "bg-amber-500",
  },
  siaga: {
    label: "SIAGA",
    description: "Risiko banjir cukup tinggi — persiapkan diri",
    bgOverlay: "from-orange-500/8 to-transparent",
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-300",
    borderAccent: "border-orange-500/40",
    accent: "text-orange-400",
    gaugeColor: "#f97316",
    gaugeColorEnd: "#ea580c",
    fillColor: "bg-orange-500",
  },
  awas: {
    label: "AWAS",
    description: "Bahaya! Risiko banjir sangat tinggi — evakuasi segera",
    bgOverlay: "from-red-500/10 to-transparent",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-300",
    borderAccent: "border-red-500/40",
    accent: "text-red-400",
    gaugeColor: "#ef4444",
    gaugeColorEnd: "#dc2626",
    fillColor: "bg-red-500",
  },
};

export function getRiskTheme(level: RiskLevel): RiskThemeConfig {
  return RISK_THEMES[level] ?? RISK_THEMES.waspada;
}

export function getRiskBorderClass(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    aman: "risk-border-aman",
    waspada: "risk-border-waspada",
    siaga: "risk-border-siaga",
    awas: "risk-border-awas",
  };
  return map[level];
}
