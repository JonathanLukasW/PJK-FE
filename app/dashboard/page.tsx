"use client";

import React, { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import {
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Calendar,
  MapPin,
  RefreshCw,
  Navigation,
} from "lucide-react";
import type { PredictRequest } from "@/types";
import { AVAILABLE_CITIES } from "@/lib/constants";
import { getGeoPermission, setGeoPermission } from "@/lib/app-state";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/stores/app-store";
import { useToast } from "@/components/ui/Toast";
import { LocationPermissionModal } from "@/components/ui/LocationPermissionModal";
import { RiskHeroCard } from "@/components/dashboard/RiskHeroCard";
import { WeatherMetricCard } from "@/components/dashboard/WeatherMetricCard";
import { MitigationChecklist } from "@/components/dashboard/MitigationChecklist";
import { DebugOverlay } from "@/components/dashboard/DebugOverlay";

const FeatureImportanceChart = dynamic(
  () => import("@/components/dashboard/FeatureImportanceChart").then((mod) => mod.FeatureImportanceChart),
  { ssr: false, loading: () => <div className="card p-5 h-48 skeleton animate-pulse" /> }
);

const INPUT_FIELDS = [
  { key: "humidity" as const, label: "Kelembapan", icon: Droplets, unit: "%", min: 0, max: 100, step: 1 },
  { key: "temperature" as const, label: "Suhu", icon: Thermometer, unit: "°C", min: -10, max: 50, step: 0.5 },
  { key: "rainfall_1h" as const, label: "Curah Hujan 1 Jam", icon: CloudRain, unit: "mm", min: 0, max: 200, step: 0.5 },
  { key: "rainfall_3h" as const, label: "Curah Hujan 3 Jam", icon: CloudRain, unit: "mm", min: 0, max: 500, step: 1 },
  { key: "rainfall_24h" as const, label: "Curah Hujan 24 Jam", icon: CloudRain, unit: "mm", min: 0, max: 1000, step: 1 },
  { key: "wind_speed" as const, label: "Kecepatan Angin", icon: Wind, unit: "km/h", min: 0, max: 200, step: 0.1 },
  { key: "month" as const, label: "Bulan", icon: Calendar, unit: "", min: 1, max: 12, step: 1 },
];

export default function DashboardPage() {
  const toast = useToast();
  const geo = useGeolocation();

  const selectedCity = useAppStore((s) => s.selectedCity);
  const setCity = useAppStore((s) => s.setCity);
  const locationMode = useAppStore((s) => s.locationMode);

  const weatherData = useAppStore((s) => s.weatherData);
  const setWeatherData = useAppStore((s) => s.setWeatherData);
  const dashboardStatus = useAppStore((s) => s.dashboardStatus);
  const weatherSource = useAppStore((s) => s.weatherSource);

  const prediction = useAppStore((s) => s.prediction);
  const predictionSource = useAppStore((s) => s.predictionSource);
  const lastUpdated = useAppStore((s) => s.lastUpdated);

  const refreshData = useAppStore((s) => s.refreshData);

  const [showFormParams, setShowFormParams] = useState(false);
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isRefreshing = dashboardStatus === "loading_weather" || dashboardStatus === "predicting";

  const handleAutoLocate = async (silent = false) => {
    setGeoLoading(true);
    const { cityName: detectedCity, location } = await geo.requestLocation();

    if (detectedCity) {
      setCity(detectedCity);
      try {
        await refreshData(location || undefined);
        toast.success("Lokasi terdeteksi", `Memuat data risiko untuk ${detectedCity}`);
      } catch {
        if (!silent) toast.error("Gagal memuat prediksi otomatis");
      }
    } else if (!silent) {
      toast.error("Gagal mendeteksi lokasi", geo.error ?? "Silakan pilih kota manual.");
    }
    setGeoLoading(false);
  };

  const handleGeoAllow = async () => {
    setGeoPermission("granted");
    setShowGeoModal(false);
    await handleAutoLocate(false);
  };

  const handleGeoDeny = () => {
    setGeoPermission("dismissed");
    setShowGeoModal(false);
  };

  const handleFieldChange = (key: keyof PredictRequest, value: string) => {
    setWeatherData({ [key]: typeof weatherData[key] === "number" ? Number(value) : value });
  };

  const handleCityChange = (city: string) => {
    setCity(city);
    refreshData();
  };

  const handleManualPredict = () => {
    startTransition(() => {
      refreshData();
    });
  };

  useEffect(() => {
    if (locationMode === "manual") {
      if (!prediction) {
        refreshData();
      }
      return;
    }

    const geoPermission = getGeoPermission();
    if (geoPermission === null) {
      const t = setTimeout(() => setShowGeoModal(true), 800);
      return () => clearTimeout(t);
    } else if (geoPermission === "granted") {
      setTimeout(() => handleAutoLocate(true), 0);
    }
  }, []);

  return (
    <>
      {process.env.NODE_ENV === "development" && <DebugOverlay />}
      {showGeoModal && (
        <LocationPermissionModal
          onAllow={handleGeoAllow}
          onDeny={handleGeoDeny}
          isLoading={geoLoading}
        />
      )}

      <div className="px-4 py-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex flex-col">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-[var(--fg)]">Dashboard Monitoring</h1>
                {isRefreshing && (
                  <span className="text-sm text-teal-500 font-medium animate-pulse ml-2">
                    {dashboardStatus === "loading_weather" ? "Mengambil data cuaca..." : "Menghitung prediksi..."}
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--fg-muted)] mt-1">
                Pantau prediksi risiko banjir dan kondisi cuaca di <span className="font-semibold text-[var(--fg)]">{selectedCity}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAutoLocate(false)}
              disabled={isPending || geoLoading || isRefreshing}
              title="Deteksi lokasi otomatis"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] disabled:opacity-40 transition-colors border border-[var(--border-muted)]"
            >
              <Navigation className={`w-3.5 h-3.5 ${geoLoading ? "animate-pulse" : ""}`} />
              <span className="hidden sm:inline">Deteksi Lokasi</span>
            </button>

            <button
              type="button"
              onClick={handleManualPredict}
              disabled={isPending || isRefreshing}
              className="w-full sm:w-auto flex justify-center py-1.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {(isPending || isRefreshing) ? "Memproses..." : "Analisis Risiko"}
            </button>
          </div>
        </div>

        {prediction ? (
          <RiskHeroCard
            prediction={prediction}
            cityName={weatherData.city_name}
            lastUpdated={lastUpdated ?? undefined}
            weatherData={weatherData}
            weatherSource={weatherSource}
            predictionSource={predictionSource}
          />
        ) : dashboardStatus === "error" ? (
          <div className="card p-6 border-red-500/20 bg-red-500/5 text-red-500 rounded-xl text-center">
            Prediksi tidak tersedia
          </div>
        ) : null}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WeatherMetricCard
                icon={CloudRain}
                label="Curah Hujan 24 Jam"
                value={weatherData.rainfall_24h}
                unit="mm"
                sublabel="Akumulasi harian — prediktor utama"
                accentClass={weatherData.rainfall_24h > 100 ? "text-red-500" : "text-[var(--fg)]"}
                size="lg"
              />
              <WeatherMetricCard
                icon={Droplets}
                label="Kelembapan"
                value={weatherData.humidity}
                unit="%"
                sublabel="Saturasi udara"
                accentClass={weatherData.humidity > 85 ? "text-amber-500" : "text-[var(--fg)]"}
                size="lg"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <WeatherMetricCard
                icon={CloudRain}
                label="Curah Hujan 1h"
                value={weatherData.rainfall_1h}
                unit="mm"
                accentClass={weatherData.rainfall_1h > 20 ? "text-amber-500" : "text-[var(--fg)]"}
              />
              <WeatherMetricCard
                icon={CloudRain}
                label="Curah Hujan 3h"
                value={weatherData.rainfall_3h}
                unit="mm"
                accentClass={weatherData.rainfall_3h > 50 ? "text-orange-500" : "text-[var(--fg)]"}
              />
              <WeatherMetricCard
                icon={Thermometer}
                label="Suhu"
                value={weatherData.temperature}
                unit="°C"
                accentClass="text-[var(--fg)]"
              />
              <WeatherMetricCard
                icon={Wind}
                label="Kec. Angin"
                value={weatherData.wind_speed}
                unit="km/h"
                accentClass="text-[var(--fg)]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card overflow-hidden">
            <FeatureImportanceChart features={prediction?.top_features ?? []} />
          </div>

          <div className="card overflow-hidden h-fit">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border-muted)]">
              <h2 className="text-sm font-bold text-[var(--fg)]">Skenario Prediksi (Manual)</h2>
              <button
                onClick={() => setShowFormParams(!showFormParams)}
                disabled={isRefreshing}
                className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline disabled:opacity-50"
              >
                {showFormParams ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>

            {showFormParams && (
              <div className="px-5 pb-5 space-y-5">
                <div className="pt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="input-city"
                      className="flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)] mb-2"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Kota
                    </label>
                    <select
                      id="input-city"
                      value={weatherData.city_name}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="select w-full px-4 py-2.5 text-sm"
                    >
                      {AVAILABLE_CITIES.map((city) => (
                        <option key={city} value={city} className="bg-[var(--bg-card)]">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {INPUT_FIELDS.map((field) => {
                      const Icon = field.icon;
                      return (
                        <div key={field.key}>
                          <label
                            htmlFor={`input-${field.key}`}
                            className="flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)] mb-2"
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            {field.label}
                            {field.unit && (
                              <span className="text-[var(--fg-subtle)]">({field.unit})</span>
                            )}
                          </label>
                          <input
                            id={`input-${field.key}`}
                            type="number"
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            value={weatherData[field.key]}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className="input w-full px-3 py-2 text-sm font-mono tabular-nums"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleManualPredict}
                  disabled={isPending || isRefreshing}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm font-medium text-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${(isPending || isRefreshing) ? "animate-spin" : ""}`} />
                  Perbarui Data
                </button>
              </div>
            )}
          </div>
        </div>

        {prediction && (
          <div className="card overflow-hidden">
            <MitigationChecklist
              actions={prediction.actions}
              riskLevel={prediction.risk_level}
            />
          </div>
        )}

      </div>
    </>
  );
}
