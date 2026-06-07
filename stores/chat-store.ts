import { create } from "zustand";
import { persist } from "zustand/middleware";
import { closeChatSession } from "@/services/api/chat";

export interface ChatSessionMeta {
  id: string;
  title: string;
  city: string;
  updatedAt: string;
}

interface ChatStoreState {
  sessions: ChatSessionMeta[];
  activeSessionId: string | null;
  isDrawerOpen: boolean;
  isLoading: boolean;

  // Actions
  setSessions: (sessions: ChatSessionMeta[]) => void;
  addSession: (session: ChatSessionMeta) => void;
  removeSession: (id: string) => Promise<void>;
  updateSessionTitle: (id: string, title: string) => void;
  setActiveSession: (id: string | null) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      isDrawerOpen: false,
      isLoading: false,

      setSessions: (sessions) => set({ sessions }),

      addSession: (session) =>
        set((state) => {
          if (state.sessions.find((s) => s.id === session.id)) return state;
          return { sessions: [session, ...state.sessions], activeSessionId: session.id };
        }),

      removeSession: async (id) => {
        const { activeSessionId, sessions } = get();
        try {
          await closeChatSession(id);
        } catch {
        }

        const newSessions = sessions.filter((s) => s.id !== id);
        set({
          sessions: newSessions,
          activeSessionId: activeSessionId === id ? null : activeSessionId,
        });
      },

      updateSessionTitle: (id, title) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s
          ),
        })),

      setActiveSession: (id) => set({ activeSessionId: id, isDrawerOpen: false }),

      setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "siagaai:chat_sessions",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);
