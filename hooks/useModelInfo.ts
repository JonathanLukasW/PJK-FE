"use client";

import { useShallow } from "zustand/react/shallow";
import type { ModelInfoState } from "@/stores/app-store";
import { useAppStore } from "@/stores/app-store";

export function useModelInfo(): ModelInfoState {
  return useAppStore(useShallow((s) => s.modelInfo));
}
