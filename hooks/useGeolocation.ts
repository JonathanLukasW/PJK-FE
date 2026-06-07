"use client";

import { useState, useCallback } from "react";
import { AVAILABLE_CITIES } from "@/lib/constants";
import { setLastCity } from "@/lib/app-state";
import type { LocationInput } from "@/types";

export type GeoStatus =
  | "idle"
  | "requesting"
  | "geocoding"
  | "resolved"
  | "error";

export interface GeolocationState {
  status: GeoStatus;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  rawCityName: string | null;
  province: string | null;
  displayName: string | null;
  error: string | null;
}

export type ResolvedLocationInput = LocationInput | null;

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

function snapToAvailableCity(address: Record<string, string>): string | null {
  const candidates = [
    address.city,
    address.town,
    address.county,
    address.state_district,
    address.municipality,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (!candidate) continue;
    const exact = AVAILABLE_CITIES.find(
      (c) => c.toLowerCase() === candidate.toLowerCase()
    );
    if (exact) return exact;

    const partial = AVAILABLE_CITIES.find(
      (c) =>
        candidate.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(candidate.toLowerCase().split(" ").pop() ?? "")
    );
    if (partial) return partial;
  }

  return null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    latitude: null,
    longitude: null,
    cityName: null,
    rawCityName: null,
    province: null,
    displayName: null,
    error: null,
  });

  const requestLocation = useCallback(async (): Promise<{
    cityName: string | null;
    location: ResolvedLocationInput;
  }> => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Geolokasi tidak tersedia di perangkat ini.",
      }));
      return { cityName: null, location: null };
    }

    setState((prev) => ({ ...prev, status: "requesting", error: null }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10_000,
          enableHighAccuracy: false,
          maximumAge: 5 * 60 * 1000,
        })
      );

      const { latitude, longitude } = position.coords;
      setState((prev) => ({ ...prev, status: "geocoding", latitude, longitude }));

      const params = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        format: "json",
        zoom: "10",
        addressdetails: "1",
      });

      const res = await fetch(`${NOMINATIM_URL}?${params}`, {
        headers: { "User-Agent": "SiagaAI-FloodEarlyWarning/1.0" },
        signal: AbortSignal.timeout(8_000),
      });

      if (!res.ok) throw new Error("Gagal mendapatkan nama kota dari lokasi Anda.");

      const geo = await res.json();
      const address: Record<string, string> = geo.address ?? {};

      const rawCityName =
        address.city ??
        address.town ??
        address.county ??
        geo.display_name?.split(",")[0] ??
        null;

      const province = address.state ?? address.province ?? null;
      const displayName: string = geo.display_name ?? rawCityName ?? "Unknown";

      const snapped = snapToAvailableCity(address);

      if (snapped) {
        setLastCity(snapped);
      }

      setState({
        status: "resolved",
        latitude,
        longitude,
        cityName: snapped,
        rawCityName,
        province,
        displayName,
        error: null,
      });

      const location: LocationInput | null = snapped
        ? {
          lat: latitude,
          lng: longitude,
          city: snapped,
          province: province ?? snapped,
          display_name: displayName,
        }
        : null;

      return { cityName: snapped, location };
    } catch (err) {
      let message = "Gagal mendeteksi lokasi Anda.";
      if (err instanceof GeolocationPositionError) {
        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          message = "Izin lokasi ditolak. Silakan pilih kota secara manual.";
        } else if (err.code === GeolocationPositionError.TIMEOUT) {
          message = "Waktu deteksi lokasi habis. Silakan coba lagi.";
        }
      }
      setState((prev) => ({ ...prev, status: "error", error: message }));
      return { cityName: null, location: null };
    }
  }, []);

  return { ...state, requestLocation };
}
