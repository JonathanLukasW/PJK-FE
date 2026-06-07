import { client } from "./client";
import type { LocationInput, SuccessResponse } from "@/types";



export interface LocationStatusResponse {
  location: {
    lat: number;
    lng: number;
    city: string;
    province: string;
    display_name: string;
  };
  weather: {
    temperature: number;
    humidity: number;
    condition: string;
    icon: string;
    wind_speed: number;
    rainfall_1h: number;
    city_name: string;
  };
  earthquake: unknown;
  risks: unknown[];
  overall_risk: string;
  summary: string;
  updated_at: string;
}

export interface GeocodeResponse {
  city: string;
  province: string;
  lat: number;
  lng: number;
  display_name: string;
}

export interface ReverseGeocodeResponse {
  city: string;
  province: string;
  display_name: string;
  lat: number;
  lng: number;
}

export interface EarthquakeItem {
  magnitude: number;
  depth: number;
  location: string;
  time: string;
  lat: number;
  lng: number;
}

export interface EarthquakesResponse {
  earthquakes: EarthquakeItem[];
  total: number;
  source: string;
}

export interface ForecastItem {
  datetime: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  description: string;
}

export interface ForecastResponse {
  city: string;
  forecasts: ForecastItem[];
  source: string;
}




export async function getLocationStatus(
  location: LocationInput
): Promise<LocationStatusResponse> {
  const res = await client.post<SuccessResponse<LocationStatusResponse>>(
    "/api/location/status",
    {
      lat: location.lat,
      lng: location.lng,
      city: location.city,
      province: location.province,
      display_name: location.display_name,
    }
  );
  return res.data;
}


export async function geocodeCity(city: string): Promise<GeocodeResponse> {
  const res = await client.get<SuccessResponse<GeocodeResponse>>(
    `/api/location/geocode?city=${encodeURIComponent(city)}`
  );
  return res.data;
}


export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResponse> {
  const res = await client.get<SuccessResponse<ReverseGeocodeResponse>>(
    `/api/location/reverse?lat=${lat}&lng=${lng}`
  );
  return res.data;
}


export async function getEarthquakes(limit = 5): Promise<EarthquakesResponse> {
  const res = await client.get<SuccessResponse<EarthquakesResponse>>(
    `/api/location/earthquakes?limit=${limit}`
  );
  return res.data;
}


export async function getForecast(
  lat: number,
  lng: number
): Promise<ForecastResponse> {
  const res = await client.get<SuccessResponse<ForecastResponse>>(
    `/api/location/forecast?lat=${lat}&lng=${lng}`
  );
  return res.data;
}
