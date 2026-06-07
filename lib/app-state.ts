import type { PredictResponse } from "@/types";

const KEYS = {
  LAST_CITY: "siagaai:last_city",
  LAST_PREDICTION: "siagaai:last_prediction",
  LAST_PREDICTION_TS: "siagaai:last_prediction_ts",
  GEO_PERMISSION: "siagaai:geo_permission",
} as const;


export function getLastCity(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.LAST_CITY);
}

export function setLastCity(city: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.LAST_CITY, city);
}


export interface StoredPrediction {
  cityName: string;
  data: PredictResponse;
  timestamp: string;
}

export function getLastPrediction(): StoredPrediction | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.LAST_PREDICTION);
    if (!raw) return null;
    return JSON.parse(raw) as StoredPrediction;
  } catch {
    return null;
  }
}

export function setLastPrediction(cityName: string, data: PredictResponse): void {
  if (typeof window === "undefined") return;
  const stored: StoredPrediction = {
    cityName,
    data,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(KEYS.LAST_PREDICTION, JSON.stringify(stored));
}

export type GeoPermissionState = "granted" | "denied" | "dismissed" | null;

export function getGeoPermission(): GeoPermissionState {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(KEYS.GEO_PERMISSION) as GeoPermissionState) ?? null;
}

export function setGeoPermission(state: "granted" | "denied" | "dismissed"): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.GEO_PERMISSION, state);
}
