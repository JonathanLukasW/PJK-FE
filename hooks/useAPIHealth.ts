"use client";

import { useShallow } from "zustand/react/shallow";
import type { APIHealthState } from "@/stores/app-store";
import { useAppStore } from "@/stores/app-store";

export function useAPIHealth(): APIHealthState {
  return useAppStore(useShallow((s) => s.apiHealth));
}

