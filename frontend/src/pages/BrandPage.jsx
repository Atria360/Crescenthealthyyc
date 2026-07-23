import { useParams, Link, useOutletContext, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  ArrowRight,
  ArrowLeft,
  Clock,
  MapPin,
  Navigation,
  Check,
  MessageCircle,
  Globe,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LocationMap } from "@/components/LocationMap";
import { siteContent, mapUrl } from "@/data/siteContent";
import { brandContent } from "@/data/brandContent";

const HERO_BG = {
  pharmasave: "linear-gradient(155deg, #E01449 0%, #A50E36 100%)",
  crescent: "linear-gradient(155deg, #1B4F9C 0%, #1FA48A 100%)",
  physio: "linear-gradient(155deg, #1E3A5F 0%, #3A6D8C 100%)",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function BrandPage() {
  const { key } = useParams();
  const { openForm } = useOutletContext();
  const brand = siteContent.brands.find((b) => b.key === key);
  const extra = brandContent[key];

  if (!brand || !extra) return <Navigate to="/" replace />;

  return (
    <div data-testid={`brand-page-${brand.key}`}>
      {/* Hero */}
      <section
        className="relative overflow-hidden pt-[72px]"
        style={{ background: HERO_BG[brand.key] }}
      >
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div className="container-x relative z-10 py-16 md:py-24">
          <Link
            to="/"
            data-testid="brand-back-home"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Complete Care
          </Link>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <div className="mb-7 inline-flex rounded-2xl bg-white px-6 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto max-w-[210px] object-contain md:h-14"
              />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/75">
              {extra.serviceType}
            </p>
            <h1 className="mt-4 font-heading text-[clamp(2.25rem,5.5vw,4rem)] font-medium leading-[0.98] tracking-tight text-white">
              {extra.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
              {brand.oneLiner}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {brand.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <motion.a
                href={brand.primaryHref}
                data-testid={`brand-primary-${brand.key}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold shadow-lg"
                style={{ color: brand.accent }}
              >
                {brand.primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <a
                href={`tel:${brand.phoneRaw}`}
                data-testid={`brand-call-${brand.key}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" /> {brand.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro + quick facts */}
      <section className="py-20 md:py-28">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-7"
          >
            <p className="eyebrow mb-4">About</p>
            <div className="space-y-5">
              {extra.intro.map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-navy-700 first:text-xl first:text-navy-900"
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.aside
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
            className="lg:col-span-5"
          >
            <div
              className="rounded-[1.5rem] border border-black/5 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
              data-testid={`brand-facts-${brand.key}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${brand.accent}14`, color: brand.accent }}
                >
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-navy-500">
                    Hours
                  </p>
                  <div className="mt-1 flex flex-col text-base text-navy-800">
                    {brand.hours.map((h) => (
                      <span key={h}>{h}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${brand.accent}14`, color: brand.accent }}
                >
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-navy-500">
                    Address
                  </p>
                  <p className="mt-1 text-base text-navy-800">{brand.address}</p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${brand.accent}14`, color: brand.accent }}
                >
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-navy-500">
                    Phone
                  </p>
                  <a
                    href={`tel:${brand.phoneRaw}`}
                    className="mt-1 block text-base font-medium text-navy-900 hover:opacity-70"
                  >
                    {brand.phone}
                  </a>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-black/5 pt-6">
                <a
                  href={mapUrl(brand.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`brand-directions-${brand.key}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`brand-website-${brand.key}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-6 py-3 text-sm font-semibold text-navy-800 transition-colors hover:bg-black/5"
                >
                  <Globe className="h-4 w-4" /> {brand.websiteLabel}
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white/60 py-20 md:py-28">
        <div className="container-x">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-12 max-w-2xl"
          >
            <p className="eyebrow mb-4">What we offer</p>
            <h2 className="font-heading text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl">
              Services &amp; care.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {extra.serviceDetails.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                data-testid={`brand-service-${brand.key}-${i}`}
                className="rounded-[1.25rem] border border-black/5 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgb(0,0,0,0.07)]"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${brand.accent}14`, color: brand.accent }}
                >
                  <Check className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-medium text-navy-900">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-4"
          >
            <p className="eyebrow mb-4">Good to know</p>
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-navy-900 sm:text-5xl">
              Questions,
              <br />
              answered.
            </h2>
            <button
              onClick={() => openForm(brand.short)}
              data-testid={`brand-faq-message-${brand.key}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: brand.accent }}
            >
              <MessageCircle className="h-4 w-4" /> Still have a question? Message us
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
            className="lg:col-span-8"
          >
            <Accordion
              type="single"
              collapsible
              className="w-full"
              data-testid={`brand-faq-${brand.key}`}
            >
              {extra.faq.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  data-testid={`brand-faq-item-${brand.key}-${i}`}
                  className="border-b border-black/10"
                >
                  <AccordionTrigger className="py-6 text-left font-heading text-lg font-medium text-navy-900 hover:no-underline md:text-xl">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base leading-relaxed text-navy-600">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Location */}
      <LocationMap />

      {/* CTA band */}
      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[1.75rem] p-10 text-center md:p-16"
            style={{ background: HERO_BG[brand.key] }}
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            />
            <h2 className="relative z-10 mx-auto max-w-xl font-heading text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Ready when you are.
            </h2>
            <p className="relative z-10 mx-auto mt-4 max-w-md text-base leading-relaxed text-white/85">
              Reach out to {brand.name} and our team will take great care of you.
            </p>
            <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
              <motion.a
                href={brand.primaryHref}
                data-testid={`brand-cta-primary-${brand.key}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold shadow-lg"
                style={{ color: brand.accent }}
              >
                {brand.primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <button
                onClick={() => openForm(brand.short)}
                data-testid={`brand-cta-message-${brand.key}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" /> Message this practice
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
