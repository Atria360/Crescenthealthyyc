import { useEffect, useState, useCallback } from "react";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSite } from "@/context/ContentContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/* ---------- small inputs ---------- */
const Field = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
    />
  </div>
);

const Area = ({ label, value, onChange, rows = 3 }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
    <textarea
      value={value ?? ""}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
    />
  </div>
);

const Color = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
    <div className="flex items-center gap-2">
      <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900" />
    </div>
  </div>
);

/* string[] edited as one-per-line textarea */
const LineList = ({ label, value = [], onChange, rows = 3 }) => (
  <Area label={`${label} (one per line)`} value={(value || []).join("\n")} onChange={(v) => onChange(v.split("\n"))} rows={rows} />
);

function ObjectList({ label, items = [], onChange, fields, testid }) {
  const update = (i, key, val) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, ""]))]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3" data-testid={testid}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
        <button onClick={add} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-3">
        {(items || []).map((it, i) => (
          <div key={i} className="flex gap-2 rounded-lg border border-slate-200 p-3">
            <div className="flex-1 space-y-2">
              {fields.map((f) =>
                f.textarea ? (
                  <textarea
                    key={f.key}
                    value={it[f.key] ?? ""}
                    rows={2}
                    placeholder={f.label}
                    onChange={(e) => update(i, f.key, e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  />
                ) : (
                  <input
                    key={f.key}
                    value={it[f.key] ?? ""}
                    placeholder={f.label}
                    onChange={(e) => update(i, f.key, f.type === "number" ? Number(e.target.value) || 0 : e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-900"
                  />
                ),
              )}
            </div>
            <button onClick={() => remove(i)} className="h-8 w-8 shrink-0 rounded-lg border border-slate-200 text-red-500 hover:bg-red-50">
              <Trash2 className="mx-auto h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- clean before save ---------- */
function clean(data) {
  const d = structuredClone(data);
  (d.brands || []).forEach((b) => {
    b.badges = (b.badges || []).filter((x) => x && x.trim());
    b.hours = (b.hours || []).filter((x) => x && x.trim());
    b.intro = (b.intro || []).filter((x) => x && x.trim());
    b.serviceDetails = (b.serviceDetails || []).filter((s) => s.name || s.desc);
    b.faq = (b.faq || []).filter((f) => f.q || f.a);
  });
  d.faq = (d.faq || []).filter((f) => f.q || f.a);
  d.testimonials = (d.testimonials || []).filter((t) => t.text || t.name);
  return d;
}

export default function AdminContent() {
  const { refresh } = useSite();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await api.get("/content");
    setDraft(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (mutator) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      mutator(next);
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/content", clean(draft));
      toast.success("Content saved");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!draft) {
    return (
      <div className="flex justify-center py-20 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
    );
  }

  return (
    <div data-testid="admin-content">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Site Content</h1>
          <p className="mt-1 text-sm text-slate-500">Edit everything on the public website.</p>
        </div>
        <button onClick={save} disabled={saving} data-testid="content-save" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="general" data-testid="tab-general">General</TabsTrigger>
          <TabsTrigger value="brands" data-testid="tab-brands">Brands</TabsTrigger>
          <TabsTrigger value="testimonials" data-testid="tab-testimonials">Reviews</TabsTrigger>
          <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
          <TabsTrigger value="faq" data-testid="tab-faq">FAQ</TabsTrigger>
          <TabsTrigger value="footer" data-testid="tab-footer">Footer</TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general">
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <Field label="Brand name" value={draft.brandName} onChange={(v) => set((d) => (d.brandName = v))} />
            <Field label="Hero eyebrow" value={draft.hero?.eyebrow} onChange={(v) => set((d) => (d.hero.eyebrow = v))} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Headline line 1" value={draft.hero?.titleLines?.[0]} onChange={(v) => set((d) => (d.hero.titleLines[0] = v))} />
              <Field label="Headline line 2" value={draft.hero?.titleLines?.[1]} onChange={(v) => set((d) => (d.hero.titleLines[1] = v))} />
            </div>
            <Area label="Sub-headline" value={draft.hero?.subheadline} onChange={(v) => set((d) => (d.hero.subheadline = v))} />
            <LineList label="Marquee words" value={draft.marquee} onChange={(v) => set((d) => (d.marquee = v))} rows={3} />
          </div>
        </TabsContent>

        {/* BRANDS */}
        <TabsContent value="brands">
          <div className="space-y-6">
            {(draft.brands || []).map((b, bi) => (
              <div key={b.key} data-testid={`content-brand-${b.key}`} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: b.accent }} />
                  <h3 className="font-semibold text-slate-900">{b.name}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" value={b.name} onChange={(v) => set((d) => (d.brands[bi].name = v))} />
                  <Field label="Short name" value={b.short} onChange={(v) => set((d) => (d.brands[bi].short = v))} />
                  <Field label="Service type" value={b.serviceType} onChange={(v) => set((d) => (d.brands[bi].serviceType = v))} />
                  <Color label="Accent color" value={b.accent} onChange={(v) => set((d) => (d.brands[bi].accent = v))} />
                  <Field label="Phone (display)" value={b.phone} onChange={(v) => set((d) => (d.brands[bi].phone = v))} />
                  <Field label="Phone (raw, e.g. +14035550100)" value={b.phoneRaw} onChange={(v) => set((d) => (d.brands[bi].phoneRaw = v))} />
                  <Field label="Primary button label" value={b.primaryLabel} onChange={(v) => set((d) => (d.brands[bi].primaryLabel = v))} />
                  <Field label="Booking link (primary button)" value={b.primaryHref} onChange={(v) => set((d) => (d.brands[bi].primaryHref = v))} />
                  <Field label="Website URL" value={b.website} onChange={(v) => set((d) => (d.brands[bi].website = v))} />
                  <Field label="Website label" value={b.websiteLabel} onChange={(v) => set((d) => (d.brands[bi].websiteLabel = v))} />
                  <Field label="Logo URL" value={b.logo} onChange={(v) => set((d) => (d.brands[bi].logo = v))} />
                  <Field label="Interior image URL" value={b.image} onChange={(v) => set((d) => (d.brands[bi].image = v))} />
                </div>
                <div className="mt-4 space-y-4">
                  <Field label="Address" value={b.address} onChange={(v) => set((d) => (d.brands[bi].address = v))} />
                  <Area label="One-liner" value={b.oneLiner} onChange={(v) => set((d) => (d.brands[bi].oneLiner = v))} rows={2} />
                  <Field label="Tagline (brand page hero)" value={b.tagline} onChange={(v) => set((d) => (d.brands[bi].tagline = v))} />
                  <LineList label="Badges" value={b.badges} onChange={(v) => set((d) => (d.brands[bi].badges = v))} rows={2} />
                  <LineList label="Hours" value={b.hours} onChange={(v) => set((d) => (d.brands[bi].hours = v))} rows={3} />
                  <LineList label="Intro paragraphs (brand page)" value={b.intro} onChange={(v) => set((d) => (d.brands[bi].intro = v))} rows={4} />
                  <ObjectList
                    label="Services"
                    items={b.serviceDetails}
                    onChange={(v) => set((d) => (d.brands[bi].serviceDetails = v))}
                    fields={[{ key: "name", label: "Service name" }, { key: "desc", label: "Description", textarea: true }]}
                    testid={`brand-services-${b.key}`}
                  />
                  <ObjectList
                    label="Brand FAQ"
                    items={b.faq}
                    onChange={(v) => set((d) => (d.brands[bi].faq = v))}
                    fields={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", textarea: true }]}
                    testid={`brand-faq-${b.key}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TESTIMONIALS */}
        <TabsContent value="testimonials">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ObjectList
              label="Reviews"
              items={draft.testimonials}
              onChange={(v) => set((d) => (d.testimonials = v))}
              fields={[
                { key: "brandName", label: "Practice name" },
                { key: "name", label: "Reviewer name" },
                { key: "stars", label: "Stars (1-5)", type: "number" },
                { key: "text", label: "Review text", textarea: true },
              ]}
              testid="content-testimonials"
            />
          </div>
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about">
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <Field label="Eyebrow" value={draft.about?.eyebrow} onChange={(v) => set((d) => (d.about.eyebrow = v))} />
            <Field label="Heading" value={draft.about?.heading} onChange={(v) => set((d) => (d.about.heading = v))} />
            <Area label="Blurb" value={draft.about?.blurb} onChange={(v) => set((d) => (d.about.blurb = v))} />
            <ObjectList
              label="Chapters (See / Fill / Recover)"
              items={draft.about?.chapters}
              onChange={(v) => set((d) => (d.about.chapters = v))}
              fields={[
                { key: "no", label: "No. (01)" },
                { key: "verb", label: "Verb (See)" },
                { key: "brand", label: "Brand label (Clinic)" },
                { key: "text", label: "Text", textarea: true },
                { key: "color", label: "Color (#hex)" },
              ]}
              testid="content-chapters"
            />
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <ObjectList
              label="Homepage FAQ"
              items={draft.faq}
              onChange={(v) => set((d) => (d.faq = v))}
              fields={[{ key: "q", label: "Question" }, { key: "a", label: "Answer", textarea: true }]}
              testid="content-faq"
            />
          </div>
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="footer">
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <Field label="Tagline" value={draft.footer?.tagline} onChange={(v) => set((d) => (d.footer.tagline = v))} />
            <Field label="Legal / copyright" value={draft.footer?.legal} onChange={(v) => set((d) => (d.footer.legal = v))} />
            <Field label="Privacy link label" value={draft.footer?.privacyLabel} onChange={(v) => set((d) => (d.footer.privacyLabel = v))} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
