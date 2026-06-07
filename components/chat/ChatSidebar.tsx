import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function ChatSidebar() {
  const { sessions, activeSessionId, setActiveSession, removeSession } = useChatStore();

  const handleNewChat = () => {
    setActiveSession(null);
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (confirm("Hapus percakapan ini?")) {
      removeSession(sessionId);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] border-r border-[var(--border-muted)] bg-[var(--bg)] hidden md:flex">
      <div className="p-4 border-b border-[var(--border-muted)]">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Chat Baru
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--fg-muted)]">
            Belum ada riwayat percakapan.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors relative overflow-hidden ${
                activeSessionId === session.id
                  ? "bg-[var(--bg-elevated)] text-[var(--fg)] shadow-sm border border-[var(--border-muted)]"
                  : "hover:bg-[var(--bg-elevated)]/50 text-[var(--fg-muted)] border border-transparent"
              }`}
            >
              <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-medium truncate">
                  {session.title || session.city || "Percakapan Baru"}
                </p>
                <p className="text-xs opacity-70 mt-0.5 truncate">
                  {session.updatedAt
                    ? formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true, locale: id })
                    : "Baru saja"}
                </p>
              </div>
              
              <button
                onClick={(e) => handleDelete(e, session.id)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-all ${
                  activeSessionId === session.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                title="Hapus obrolan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
