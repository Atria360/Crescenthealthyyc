import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSite } from "@/context/ContentContext";

const EMPTY = {
  slug: "",
  title: "",
  excerpt: "",
  cover: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "3 min read",
  author: "",
  tag: "Wellness",
  accent: "#1FA48A",
  content: [{ type: "p", text: "" }],
  published: true,
  sortOrder: 0,
};

const Field = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
    />
  </div>
);

function BlogEditor({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const setBlock = (i, patch) =>
    setForm((f) => ({ ...f, content: f.content.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) }));
  const addBlock = (type) =>
    setForm((f) => ({ ...f, content: [...f.content, { type, text: "" }] }));
  const removeBlock = (i) =>
    setForm((f) => ({ ...f, content: f.content.filter((_, idx) => idx !== i) }));
  const moveBlock = (i, dir) =>
    setForm((f) => {
      const arr = [...f.content];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...f, content: arr };
    });

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (form.id) await api.put(`/admin/blog/${form.id}`, form);
      else await api.post("/admin/blog", form);
      toast.success("Post saved");
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="blog-editor">
      <button onClick={onCancel} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Field label="Title" value={form.title} onChange={set("title")} placeholder="Post title" />
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt")(e.target.value)}
                rows={2}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Content</h3>
              <div className="flex gap-2">
                <button onClick={() => addBlock("h")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  + Heading
                </button>
                <button onClick={() => addBlock("p")} data-testid="blog-add-paragraph" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  + Paragraph
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {form.content.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex flex-col items-center gap-1 pt-2 text-slate-300">
                    <GripVertical className="h-4 w-4" />
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                      {b.type === "h" ? "H" : "P"}
                    </span>
                  </div>
                  <textarea
                    value={b.text}
                    onChange={(e) => setBlock(i, { text: e.target.value })}
                    rows={b.type === "h" ? 1 : 3}
                    placeholder={b.type === "h" ? "Heading text" : "Paragraph text"}
                    className={`flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900 ${
                      b.type === "h" ? "font-semibold" : ""
                    }`}
                  />
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveBlock(i, -1)} className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => moveBlock(i, 1)} className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeBlock(i)} className="rounded border border-slate-200 p-1 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <Field label="Slug" value={form.slug} onChange={set("slug")} placeholder="auto from title" />
            <Field label="Tag" value={form.tag} onChange={set("tag")} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accent} onChange={(e) => set("accent")(e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
                <input value={form.accent} onChange={(e) => set("accent")(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900" />
              </div>
            </div>
            <Field label="Author" value={form.author} onChange={set("author")} />
            <Field label="Date" value={form.date} onChange={set("date")} type="date" />
            <Field label="Read time" value={form.readTime} onChange={set("readTime")} />
            <Field label="Cover image URL" value={form.cover} onChange={set("cover")} />
            {form.cover && (
              <img src={form.cover} alt="" className="h-28 w-full rounded-lg object-cover" />
            )}
            <Field label="Sort order" value={form.sortOrder} onChange={(v) => set("sortOrder")(Number(v) || 0)} type="number" />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published")(e.target.checked)} data-testid="blog-published" />
              Published
            </label>
          </div>
          <button
            onClick={save}
            disabled={saving}
            data-testid="blog-save"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const { refresh } = useSite();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, object = editor

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/blog");
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onSaved = () => {
    setEditing(null);
    load();
    refresh();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/blog/${id}`);
      toast.success("Post deleted");
      load();
      refresh();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (editing) {
    return <BlogEditor initial={editing} onCancel={() => setEditing(null)} onSaved={onSaved} />;
  }

  return (
    <div data-testid="admin-blog">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-slate-500">{posts.length} posts</p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          data-testid="blog-new"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} data-testid={`blog-row-${p.slug}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              {p.cover && <img src={p.cover} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: p.accent }}>{p.tag}</span>
                  {!p.published && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Draft</span>}
                </div>
                <p className="mt-1 truncate font-semibold text-slate-900">{p.title}</p>
                <p className="truncate text-xs text-slate-400">/{p.slug} · {p.date}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setEditing(p)} data-testid={`blog-edit-${p.slug}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(p.id)} data-testid={`blog-delete-${p.slug}`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
