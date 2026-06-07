import { useEffect } from "react";
import { X } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { ChatSidebar } from "./ChatSidebar";

export function ChatDrawer() {
  const { isDrawerOpen, setIsDrawerOpen } = useChatStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    if (isDrawerOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg)] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-muted)]">
          <h2 className="font-semibold text-[var(--fg)]">Riwayat Chat</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto [&>aside]:w-full [&>aside]:h-full [&>aside]:flex [&>aside]:md:flex [&>aside]:border-r-0">
          <ChatSidebar />
        </div>
      </div>
    </div>
  );
}
