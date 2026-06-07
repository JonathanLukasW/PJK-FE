

export type RiskLevel = "aman" | "waspada" | "siaga" | "awas";


export interface LocationInput {
  lat: number;
  lng: number;
  city: string;
  province: string;
  display_name: string;
}


export interface SuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}


export interface PredictRequest {
  city_name: string;
  humidity: number;
  month: number;
  rainfall_1h: number;
  rainfall_24h: number;
  rainfall_3h: number;
  temperature: number;
  wind_speed: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  value: number;
  direction: "increase_risk" | "decrease_risk" | "context";
}


export interface PredictResponse {
  risk_level: RiskLevel;
  risk_score: number;
  probabilities: Record<string, number>;
  confidence: "high" | "medium" | "low";
  top_features: FeatureImportance[];
  message: string;
  actions: string[];
  model_version: string;
  inference_ms: number;
}


export interface HealthResponse {
  status: "loaded" | "healthy" | "degraded" | "offline" | "error";
  is_ready?: boolean;
  model_loaded?: boolean;
  model_version?: string;
  version?: string;
  accuracy?: number;
  f1_score?: number;
  latency_ms?: number;
  timestamp?: string;
}

export interface ModelInfoResponse {
  model_type: string;
  model_version: string;
  trained_at: string;
  accuracy: number;
  n_features: number;
  total_training_samples: number;
  top5_features: string[];
  is_loaded: boolean;
}


export interface SOSPayload {
  session_id: string;
  situation: string;
  contact_name: string;
  contact_phone: string;
  location: LocationInput;
}

export interface SOSResponse {
  escalation_id: string;
  message: string;
  emergency_numbers: Record<string, string>;
  status: string;
}


export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}

export type ChatIntent =
  | "prediction"
  | "evacuation"
  | "first_aid"
  | "emergency"
  | "education"
  | "general";

export interface ChatSession {
  session_id: string;
  city: string;
  province: string;
  model_name: string;
  created_at: string;
}

export interface ChatSendResponse {
  success: boolean;
  reply: string;
  intent: ChatIntent;
  session_id: string;
  model_used: string;
  requires_escalation: boolean;
  suggested_actions: string[];
  message_id: string;
}

export interface ChatHistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent: string | null;
  model_used: string | null;
  requires_escalation: boolean;
  suggested_actions: string[];
  timestamp: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatHistoryMessage[];
  total: number;
}


export interface RiskContext {
  city_name: string;
  risk_level: RiskLevel;
  flood_probability: number;
}


export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}
