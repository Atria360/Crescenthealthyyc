import { useEffect, useState, useCallback } from "react";
import { Loader2, Mail, Trash2, Check, Circle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ messages: 0, unread: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, s] = await Promise.all([api.get("/admin/messages"), api.get("/admin/stats")]);
      setMessages(m.data);
      setStats(s.data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (msg) => {
    try {
      await api.patch(`/admin/messages/${msg.id}`, { read: !msg.read });
      setMessages((prev) => prev.map((x) => (x.id === msg.id ? { ...x, read: !x.read } : x)));
      setStats((s) => ({ ...s, unread: s.unread + (msg.read ? 1 : -1) }));
    } catch {
      toast.error("Update failed");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages((prev) => prev.filter((x) => x.id !== id));
      toast.success("Message deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div data-testid="admin-messages">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            {stats.messages} total · <span className="font-semibold text-slate-700">{stats.unread} unread</span>
          </p>
        </div>
        <button
          onClick={load}
          data-testid="messages-refresh"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <Mail className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              data-testid={`message-row-${m.id}`}
              className={`rounded-xl border bg-white p-5 shadow-sm ${
                m.read ? "border-slate-200" : "border-l-4 border-l-slate-900 border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{m.name}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {m.brand}
                    </span>
                    {!m.read && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{m.contact}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{m.message}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {m.created_at ? formatDate(m.created_at) : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => toggleRead(m)}
                    data-testid={`message-toggle-${m.id}`}
                    title={m.read ? "Mark unread" : "Mark read"}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    {m.read ? <Circle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    data-testid={`message-delete-${m.id}`}
                    title="Delete"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
