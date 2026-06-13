import { create } from "zustand";
import type { PredictResponse, ModelInfoResponse, PredictRequest, LocationInput } from "@/types";
import { predict, predictAuto } from "@/services/api/ml";
import { getLocationStatus } from "@/services/api/location";

export type LocationMode = "auto" | "manual";

export interface AuthUser {
  name: string | null;
  email: string | null;
  image: string | null;
}

export type ConnectionMode =
  | "live"
  | "mock"
  | "fallback";

export interface APIHealthState {
  isOnline: boolean;
  status: "healthy" | "degraded" | "loaded" | "offline" | "unknown" | "error";
  latency: number | null;
  modelVersion: string | null;
  lastChecked: Date | null;
  isChecking: boolean;
  connectionMode: ConnectionMode;
}

export interface ModelInfoState {
  data: ModelInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  connectionMode: ConnectionMode;
}

interface AppState {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;

  locationMode: LocationMode;
  setLocationMode: (mode: LocationMode) => void;
  selectedCity: string;
  setCity: (city: string) => void;
  prediction: PredictResponse | null;
  lastUpdated: Date | null;
  setPrediction: (prediction: PredictResponse, city: string) => void;

  connectionMode: ConnectionMode;
  setConnectionMode: (mode: ConnectionMode) => void;
  geoDetectedCity: string | null;
  geoRawName: string | null;
  setGeoCity: (city: string | null, rawName?: string | null) => void;

  apiHealth: APIHealthState;
  setApiHealth: (health: Partial<APIHealthState>) => void;

  modelInfo: ModelInfoState;
  setModelInfo: (info: Partial<ModelInfoState>) => void;

  dashboardStatus: "idle" | "loading_weather" | "predicting" | "error";
  weatherData: PredictRequest;
  setWeatherData: (data: Partial<PredictRequest>) => void;
  weatherSource: string;
  predictionSource: string;
  refreshData: (locationInput?: LocationInput) => Promise<void>;
}

const LS_CITY_KEY = "siagaai:last_city";
const LS_LOCATION_MODE_KEY = "siagaai:location_mode";

function persistCity(city: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_CITY_KEY, city);
}

function persistLocationMode(mode: LocationMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_LOCATION_MODE_KEY, mode);
}

const EMPTY_WEATHER: PredictRequest = {
  city_name: "Jakarta",
  humidity: 0,
  temperature: 0,
  rainfall_1h: 0,
  rainfall_3h: 0,
  rainfall_24h: 0,
  wind_speed: 0,
  month: new Date().getMonth() + 1,
};

export const useAppStore = create<AppState>((set) => ({
  authUser: null,
  setAuthUser: (user) => set({ authUser: user }),

  locationMode: "auto",
  setLocationMode: (mode) => {
    persistLocationMode(mode);
    set({ locationMode: mode });
  },
  selectedCity: "Jakarta",
  setCity: (city) => {
    persistCity(city);
    set({ selectedCity: city });
  },

  prediction: null,
  lastUpdated: null,
  setPrediction: (prediction, city) => {
    set({ prediction, lastUpdated: new Date(), selectedCity: city });
  },

  dashboardStatus: "idle",
  weatherData: { ...EMPTY_WEATHER },
  setWeatherData: (data) => set((state) => ({ weatherData: { ...state.weatherData, ...data } })),
  weatherSource: "—",
  predictionSource: "—",

  refreshData: async (locationInput?: LocationInput) => {
    const state = useAppStore.getState();
    const city = locationInput?.city || state.selectedCity;

    set({ dashboardStatus: "loading_weather", selectedCity: city });

    try {
      const fallbackLocation: LocationInput = locationInput ?? {
        lat: 0,
        lng: 0,
        city: city,
        province: city,
        display_name: city,
      };

      const statusResult = await getLocationStatus(fallbackLocation).catch(() => null);

      if (!statusResult || !statusResult.weather) {
        throw new Error("Data cuaca tidak tersedia");
      }

      const w = statusResult.weather;
      const newWeather: PredictRequest = {
        city_name: city,
        temperature: w.temperature,
        humidity: w.humidity,
        rainfall_1h: w.rainfall_1h,
        rainfall_3h: 0,
        rainfall_24h: 0,
        wind_speed: w.wind_speed,
        month: new Date().getMonth() + 1,
      };

      set({
        weatherData: newWeather,
        weatherSource: "OpenWeather (Live)",
        dashboardStatus: "predicting",
      });

      const req = { ...useAppStore.getState().weatherData };

      const result = await (locationInput ? predictAuto(locationInput) : predict(req));

      if (!result || !result.data) {
        throw new Error("Prediksi tidak tersedia");
      }

      set({
        prediction: result.data,
        lastUpdated: new Date(),
        predictionSource: result.mode === "live" ? "Backend API" : "Fallback",
        connectionMode: result.mode,
        dashboardStatus: "idle",
      });
    } catch (e: any) {
      console.error("Dashboard fetch error:", e);
      set({
        dashboardStatus: "error",
        connectionMode: "fallback",
        weatherSource: "Error",
        predictionSource: "Error",
      });
    }
  },

  connectionMode: "live",
  setConnectionMode: (mode) => set({ connectionMode: mode }),

  geoDetectedCity: null,
  geoRawName: null,
  setGeoCity: (city, rawName = null) =>
    set({ geoDetectedCity: city, geoRawName: rawName }),

  apiHealth: {
    isOnline: false,
    status: "unknown",
    latency: null,
    modelVersion: null,
    lastChecked: null,
    isChecking: false,
    connectionMode: "live",
  },
  setApiHealth: (health) => set((state) => ({ apiHealth: { ...state.apiHealth, ...health } })),

  modelInfo: {
    data: null,
    isLoading: true,
    error: null,
    connectionMode: "live",
  },
  setModelInfo: (info) => set((state) => ({ modelInfo: { ...state.modelInfo, ...info } })),

}));