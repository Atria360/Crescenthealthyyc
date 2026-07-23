import { motion } from "framer-motion";
import { Phone, Navigation } from "lucide-react";
import { mapUrl } from "@/data/siteContent";

const ORDER = ["crescent", "pharmasave", "physio"];

export const ContactStrip = ({ brands }) => {
  const ordered = ORDER.map((k) => brands.find((b) => b.key === k)).filter(Boolean);
  return (
    <section id="contact" className="scroll-mt-24 border-y border-black/5 bg-white/60">
      <div className="container-x grid grid-cols-1 divide-y divide-black/5 md:grid-cols-3 md:divide-x md:divide-y-0">
        {ordered.map((brand, i) => (
          <motion.div
            key={brand.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 px-2 py-8 md:px-8"
            data-testid={`contact-col-${brand.key}`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: brand.accent }}
              />
              <span className="text-sm font-semibold uppercase tracking-wide text-navy-700">
                {brand.short}
              </span>
            </div>

            <a
              href={`tel:${brand.phoneRaw}`}
              data-testid={`contact-call-${brand.key}`}
              className="group flex items-center gap-3 text-navy-900 transition-colors duration-300"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: `${brand.accent}14`, color: brand.accent }}
              >
                <Phone className="h-4 w-4" />
              </span>
              <span className="font-heading text-xl font-medium tracking-tight group-hover:opacity-70">
                {brand.phone}
              </span>
            </a>

            <a
              href={mapUrl(brand.address)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`contact-directions-${brand.key}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 transition-colors duration-300 hover:text-navy-900"
            >
              <Navigation className="h-4 w-4" style={{ color: brand.accent }} />
              Get Directions
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
