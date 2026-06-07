import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { RiskLevel } from "@/types";
import { getRiskTheme } from "@/lib/risk-theme";

interface MitigationChecklistProps {
  actions: string[];
  riskLevel: RiskLevel;
}

export const MitigationChecklist = React.memo(function MitigationChecklist({ actions, riskLevel }: MitigationChecklistProps) {
  const theme = getRiskTheme(riskLevel);

  return (
    <div className="card p-5 space-y-4 animate-slide-up stagger-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className={`w-4 h-4 ${theme.accent}`} />
        <h3 className="text-sm font-semibold text-[var(--fg-muted)]">
          Langkah Mitigasi yang Disarankan
        </h3>
      </div>

      <div className="space-y-2.5">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border-muted)] transition-colors group"
          >
            <span
              className={`
                w-5 h-5 rounded-full flex items-center justify-center
                flex-shrink-0 mt-0.5 text-[10px] font-bold
                ${theme.badgeBg} ${theme.badgeText}
              `}
            >
              {index + 1}
            </span>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed group-hover:text-[var(--fg)] transition-colors">
              {action}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--fg-subtle)] leading-relaxed pt-1 border-t border-[var(--border-muted)]">
        Rekomendasi berdasarkan analisis model ML dan standar panduan BNPB.
        Selalu ikuti arahan petugas BPBD setempat.
      </p>
    </div>
  );
});
