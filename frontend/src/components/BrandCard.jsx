import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  Plus,
  Minus,
  ArrowUpRight,
} from "lucide-react";

const cardVariant = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

export const BrandCard = ({ brand, isHighlighted }) => {
  const [open, setOpen] = useState(false);
  const a = brand.accent;

  return (
    <motion.article
      id={`brand-${brand.key}`}
      data-testid={`brand-card-${brand.key}`}
      variants={cardVariant}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white"
      style={{
        boxShadow: isHighlighted
          ? `0 0 0 3px ${a}, 0 28px 60px rgba(0,0,0,0.14)`
          : "0 8px 30px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.5s ease",
      }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={brand.image}
          alt={brand.imageAlt}
          className="h-full w-full object-cover grayscale-[30%] transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${a}26, transparent 55%)`,
          }}
        />
        {/* Spotlight on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, rgba(255,255,255,0.28), transparent 62%)",
          }}
        />
        {/* Clipped inner frame on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-[1.15rem] border border-white/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="absolute right-4 top-4 z-10 flex flex-wrap justify-end gap-2">
          {brand.badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider backdrop-blur"
              style={{ color: a }}
              data-testid={`badge-${brand.key}`}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <img
          src={brand.logo}
          alt={brand.name}
          className="mb-6 h-11 w-auto max-w-[70%] self-start object-contain"
        />

        <p className="text-base leading-relaxed text-navy-800">
          {brand.oneLiner}
        </p>

        <div className="mt-6 space-y-2.5 text-sm text-navy-600">
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" style={{ color: a }} />
            <div className="flex flex-col gap-0.5">
              {brand.hours.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: a }} />
            <span>{brand.address}</span>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <motion.a
            href={brand.primaryHref}
            data-testid={`brand-primary-${brand.key}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: a }}
          >
            {brand.primaryLabel}
          </motion.a>
          <motion.a
            href={`tel:${brand.phoneRaw}`}
            data-testid={`brand-call-${brand.key}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold"
            style={{ color: a, borderColor: `${a}40` }}
          >
            <Phone className="h-4 w-4" />
            Call
          </motion.a>
        </div>

        <button
          data-testid={`brand-expander-${brand.key}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-6 flex items-center justify-between border-t border-black/5 pt-5 text-sm font-semibold text-navy-700 transition-colors duration-300 hover:text-navy-900"
        >
          <span>{open ? "Less info" : "More info"}</span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: `${a}14`, color: a }}
          >
            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="expander"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-5 pt-5">
                <div className="flex flex-wrap gap-2">
                  {brand.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{ backgroundColor: brand.surface, color: a }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {brand.extras.map((ex) => (
                  <div
                    key={ex.title}
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: brand.surface }}
                  >
                    <p className="text-sm font-semibold" style={{ color: a }}>
                      {ex.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-navy-700">
                      {ex.text}
                    </p>
                  </div>
                ))}

                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`brand-website-${brand.key}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: a }}
                >
                  {brand.websiteLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};
