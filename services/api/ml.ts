import { client } from "./client";
import type {
  PredictRequest,
  PredictResponse,
  ModelInfoResponse,
  HealthResponse,
  LocationInput,
} from "@/types";
import type { ConnectionMode } from "@/stores/app-store";


export interface MLResult<T> {
  data: T;
  mode: ConnectionMode;
}

export async function predict(payload: PredictRequest): Promise<MLResult<PredictResponse>> {
  const res = await client.post<PredictResponse>("/api/ml/predict", payload);
  return { data: res, mode: "live" };
}


export async function predictAuto(location: LocationInput): Promise<MLResult<PredictResponse>> {
  const res = await client.post<PredictResponse>("/api/ml/predict-auto", {
    lat: location.lat,
    lng: location.lng,
    city: location.city,
    province: location.province,
    display_name: location.display_name,
  });
  return { data: res, mode: "live" };
}

export async function getModelInfo(): Promise<MLResult<ModelInfoResponse>> {
  const res = await client.get<ModelInfoResponse>("/api/ml/model-info");
  return { data: res, mode: "live" };
}

export async function getHealth(): Promise<MLResult<HealthResponse>> {
  const res = await client.get<HealthResponse>("/api/ml/health");
  return { data: res, mode: "live" };
}

export async function batchPredict(
  payloads: PredictRequest[]
): Promise<MLResult<PredictResponse[]>> {
  const res = await client.post<PredictResponse[]>("/api/ml/batch", {
    locations: payloads,
  });
  return { data: res, mode: "live" };
}
