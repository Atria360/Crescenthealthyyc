import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight, ArrowUpRight, Clock, MapPin } from "lucide-react";

const META = {
  crescent: {
    serviceType: "Medical Clinic",
    overlay: "linear-gradient(160deg, #1B4F9C 0%, #1FA48A 100%)",
  },
  pharmasave: {
    serviceType: "Pharmacy",
    overlay: "linear-gradient(160deg, #E01449 0%, #A50E36 100%)",
  },
  physio: {
    serviceType: "Physiotherapy",
    overlay: "linear-gradient(160deg, #1E3A5F 0%, #3A6D8C 100%)",
  },
};

const ORDER = ["crescent", "pharmasave", "physio"];

const MERGED =
  "linear-gradient(100deg, #1FA48A 0%, #1B4F9C 26%, #D31245 50%, #2B4F74 74%, #1E3A5F 100%)";

const panelIn = {
  hidden: { opacity: 0, y: 50 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const headlineContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const lineUp = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const BrandSplitHero = ({ brands, hero }) => {
  const [hovered, setHovered] = useState(null);
  const ordered = ORDER.map((k) => brands.find((b) => b.key === k)).filter(Boolean);

  return (
    <section id="top" className="relative">
      <div
        className="flex flex-col overflow-hidden pt-[72px] md:min-h-screen md:flex-row md:items-stretch"
        style={{ background: MERGED }}
      >
        {ordered.map((brand, i) => {
          const meta = META[brand.key];
          const isLit = hovered === brand.key;
          return (
            <motion.div
              key={brand.key}
              id={`brand-${brand.key}`}
              data-testid={`brand-panel-${brand.key}`}
              custom={i}
              variants={panelIn}
              initial="hidden"
              animate="show"
              onMouseEnter={() => setHovered(brand.key)}
              onMouseLeave={() => setHovered(null)}
              className="group relative flex-1 overflow-hidden"
            >
              <div aria-hidden className="absolute inset-0 bg-black/15" />
              <div
                aria-hidden
                className="absolute inset-0 transition-opacity duration-500"
                style={{ background: meta.overlay, opacity: isLit ? 0.94 : 0 }}
              />
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              />

              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-7 py-14 text-center md:px-8 md:py-16">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-12 w-auto max-w-[190px] object-contain md:h-14"
                  />
                </motion.div>

                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/75">
                  {meta.serviceType}
                </p>

                <p className="max-w-xs text-base leading-relaxed text-white/95">
                  {brand.oneLiner}
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {brand.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-2 text-sm text-white/90">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-white/70" />
                    {brand.address}
                  </span>
                  <span className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/70" />
                    <span className="flex flex-col">
                      {brand.hours.map((h) => (
                        <span key={h}>{h}</span>
                      ))}
                    </span>
                  </span>
                </div>

                <div className="mt-1 flex flex-col items-center gap-3">
                  <motion.a
                    href={brand.primaryHref}
                    data-testid={`panel-primary-${brand.key}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold shadow-lg"
                    style={{ color: brand.accent }}
                  >
                    {brand.primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </motion.a>
                  <div className="flex items-center gap-4">
                    <a
                      href={`tel:${brand.phoneRaw}`}
                      data-testid={`panel-call-${brand.key}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-white"
                    >
                      <Phone className="h-4 w-4" /> Call
                    </a>
                    <span className="text-white/30">·</span>
                    <Link
                      to={`/practice/${brand.key}`}
                      data-testid={`panel-more-${brand.key}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 underline-offset-4 hover:underline"
                    >
                      More info <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        variants={headlineContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="container-x py-20 text-center md:py-28"
      >
        <motion.p
          variants={fadeUp}
          className="eyebrow mb-6 flex items-center justify-center gap-3"
        >
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#D31245] to-[#1FA48A]" />
          {hero.eyebrow}
        </motion.p>
        <h1 className="mx-auto max-w-5xl font-heading text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.92] tracking-tighter text-navy-900">
          {hero.titleLines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={lineUp} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-navy-600 md:text-lg"
        >
          {hero.subheadline}
        </motion.p>
      </motion.div>
    </section>
  );
};
