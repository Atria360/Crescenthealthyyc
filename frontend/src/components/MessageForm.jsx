import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

const empty = { name: "", contact: "", brand: "", message: "" };

export const MessageForm = ({ brands, open, setOpen, initialBrand }) => {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialBrand) setForm((f) => ({ ...f, brand: initialBrand }));
  }, [open, initialBrand]);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.brand || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/messages", form);
      setSent(true);
    } catch (err) {
      toast.error("Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (o) => {
    setOpen(o);
    if (!o) setTimeout(() => { setSent(false); setForm(empty); }, 300);
  };

  return (
    <>
      <motion.button
        data-testid="message-pill"
        onClick={() => setOpen(true)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 120, damping: 15 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-navy-900 py-4 pl-5 pr-6 text-white shadow-[0_10px_40px_rgb(0,0,0,0.18)] md:flex"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-semibold">Message us</span>
      </motion.button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-l border-black/5 bg-canvas sm:max-w-md"
          data-testid="message-sheet"
        >
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center px-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1FA48A]/12 text-[#1FA48A]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-6 font-heading text-2xl font-medium text-navy-900">
                Message sent
              </h3>
              <p className="mt-3 max-w-xs text-navy-600">
                Thanks! The right team will get back to you within one business
                day.
              </p>
              <button
                data-testid="message-send-another"
                onClick={() => { setSent(false); setForm(empty); }}
                className="mt-8 rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-navy-800 transition-colors duration-300 hover:bg-navy-900 hover:text-white"
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="font-heading text-2xl font-medium tracking-tight text-navy-900">
                  Message us
                </SheetTitle>
                <SheetDescription className="text-navy-600">
                  Tell us what you need and the right team will reply within one
                  business day.
                </SheetDescription>
              </SheetHeader>

              <form onSubmit={submit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="mf-name" className="text-navy-700">Name</Label>
                  <Input
                    id="mf-name"
                    data-testid="message-name"
                    value={form.name}
                    onChange={(e) => update("name")(e.target.value)}
                    placeholder="Your name"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mf-contact" className="text-navy-700">
                    Phone or Email
                  </Label>
                  <Input
                    id="mf-contact"
                    data-testid="message-contact"
                    value={form.contact}
                    onChange={(e) => update("contact")(e.target.value)}
                    placeholder="How can we reach you?"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-navy-700">I'm contacting</Label>
                  <Select
                    value={form.brand}
                    onValueChange={update("brand")}
                  >
                    <SelectTrigger data-testid="message-brand" className="bg-white">
                      <SelectValue placeholder="Choose a practice" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem
                          key={b.key}
                          value={b.short}
                          data-testid={`message-brand-${b.key}`}
                        >
                          {b.short}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mf-message" className="text-navy-700">
                    Message
                  </Label>
                  <Textarea
                    id="mf-message"
                    data-testid="message-text"
                    value={form.message}
                    onChange={(e) => update("message")(e.target.value)}
                    placeholder="How can we help?"
                    rows={4}
                    className="bg-white"
                  />
                </div>

                <motion.button
                  type="submit"
                  data-testid="message-submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-900 py-3.5 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send Message"}
                  {!loading && <Send className="h-4 w-4" />}
                </motion.button>

                <p className="flex items-start gap-2 text-xs leading-relaxed text-navy-500">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  Please don't include personal health information in this form.
                </p>
              </form>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
