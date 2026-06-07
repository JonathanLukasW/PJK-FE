import React from "react";
import { AlertTriangle, CheckCircle2, Clock, Cpu, Shield } from "lucide-react";
import type { PredictResponse } from "@/types";
import { getRiskTheme, getRiskBorderClass } from "@/lib/risk-theme";
import { RiskBadge } from "@/components/ui/Badge";

interface RiskHeroCardProps {
  prediction: PredictResponse;
  cityName: string;
  lastUpdated?: Date;
  weatherData?: any;
  weatherSource?: string;
  predictionSource?: string;
}

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

export const RiskHeroCard = React.memo(function RiskHeroCard({
  prediction,
  cityName,
  lastUpdated,
  weatherSource = "Cached",
  predictionSource = "Cache",
}: RiskHeroCardProps) {
  const theme = getRiskTheme(prediction.risk_level);
  const borderClass = getRiskBorderClass(prediction.risk_level);

  const probability = Math.round(prediction.risk_score * 100);
  const confidenceLabel = CONFIDENCE_LABEL[prediction.confidence] ?? prediction.confidence;

  const isHighRisk =
    prediction.risk_level === "siaga" || prediction.risk_level === "awas";

  return (
    <div className={`card-alert border overflow-hidden ${borderClass}`} style={{ borderColor: "var(--border)" }}>
      <div className={`bg-gradient-to-br ${theme.bgOverlay} p-6`}>
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-base font-semibold text-[var(--fg-muted)]">{cityName}</span>
                  <RiskBadge level={prediction.risk_level} />
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.badgeBg}`}>
                  {isHighRisk ? (
                    <AlertTriangle className={`w-5 h-5 ${theme.accent}`} />
                  ) : (
                    <CheckCircle2 className={`w-5 h-5 ${theme.accent}`} />
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className={`text-5xl font-black tabular-nums tracking-tighter ${theme.accent}`}>
                  {probability}%
                </span>
                <div>
                  <p className="text-sm text-[var(--fg-muted)] font-semibold leading-tight">probabilitas banjir</p>
                  {prediction.confidence && (
                    <p className="text-[11px] text-[var(--fg-subtle)] mt-0.5">
                      Kepercayaan: {confidenceLabel}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ background: "var(--border-muted)" }}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${theme.fillColor}`}
                  style={{ width: `${probability}%` }}
                />
              </div>

              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
                {prediction.message.replace(/^[^\w\s]*\s*/, "")}
              </p>
            </div>
          </div>

          {prediction.actions && prediction.actions.length > 0 && (
            <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col justify-center">
              <p className="text-[11px] font-semibold text-[var(--fg-subtle)] uppercase tracking-wide mb-2">
                <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />
                Tindakan Rekomendasi
              </p>
              <div className="space-y-1.5">
                {prediction.actions.slice(0, 3).map((action, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2 rounded-lg ${i === 0 ? theme.badgeBg : "bg-[var(--bg-subtle)]"
                      }`}
                    style={i === 0 ? { border: `1px solid ${theme.gaugeColor}22` } : undefined}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? theme.fillColor : "bg-[var(--fg-subtle)]"
                      }`} />
                    <p className={`text-[12px] leading-snug ${i === 0 ? "font-medium text-[var(--fg)]" : "text-[var(--fg-muted)]"
                      }`}>
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-3 mt-4 border-t text-[11px] font-mono text-[var(--fg-subtle)]"
          style={{ borderColor: "var(--border-muted)" }}>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3" />
            {prediction.model_version}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {prediction.inference_ms}ms
          </span>

          <span className="flex items-center gap-1.5 ml-auto md:ml-4">
            Weather:
            <span className={`inline-flex items-center gap-1 font-semibold ${weatherSource.includes("Live") ? "text-teal-500" :
              weatherSource.includes("Fallback") ? "text-amber-500" : "text-blue-500"
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${weatherSource.includes("Live") ? "bg-teal-500" :
                weatherSource.includes("Fallback") ? "bg-amber-500" : "bg-blue-500"
                }`} />
              {weatherSource}
            </span>
          </span>

          <span className="flex items-center gap-1.5 ml-auto md:ml-4">
            Predict:
            <span className={`inline-flex items-center gap-1 font-semibold ${predictionSource === "Backend API" ? "text-teal-500" : "text-amber-500"
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${predictionSource === "Backend API" ? "bg-teal-500" : "bg-amber-500"
                }`} />
              {predictionSource}
            </span>
          </span>

          {lastUpdated && (
            <span className="flex items-center gap-1.5 ml-auto">
              {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
