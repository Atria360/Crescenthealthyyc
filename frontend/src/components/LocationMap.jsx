import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { mapUrl } from "@/data/siteContent";

const ADDRESS = "150-909 5 Avenue SW, Calgary, AB";
const EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  ADDRESS,
)}&z=15&output=embed`;

export const LocationMap = () => {
  return (
    <section id="location" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.05)] lg:grid-cols-5"
        >
          <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-2">
            <p className="eyebrow mb-4">02 — One location</p>
            <h2 className="font-heading text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl">
              Three practices,
              <br />
              one address.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-navy-600">
              Pharmasave, Crescent Medical and The Physio Studio share the same
              downtown Calgary location — your complete care, all under one roof.
            </p>

            <div className="mt-8 flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D31245] via-[#1FA48A] to-[#1E3A5F] text-white">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="pt-1.5 text-base font-medium text-navy-800">
                {ADDRESS}
              </span>
            </div>

            <motion.a
              href={mapUrl(ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="location-directions"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white"
            >
              <Navigation className="h-4 w-4" />
              Get Directions
            </motion.a>
          </div>

          <div className="min-h-[340px] lg:col-span-3 lg:min-h-[460px]">
            <iframe
              title="Map showing 150-909 5 Avenue SW, Calgary, AB"
              src={EMBED}
              data-testid="location-map"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
