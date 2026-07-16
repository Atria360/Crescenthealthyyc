import { motion } from "framer-motion";
import { Marquee } from "@/components/Marquee";

export const AboutFamily = ({ content, marquee }) => {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <Marquee items={marquee} />
      </div>

      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="eyebrow mb-5">{content.eyebrow}</p>
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-navy-900 sm:text-5xl">
              {content.heading}
            </h2>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-navy-700">
              {content.blurb}
            </p>
          </motion.div>

          <div className="lg:col-span-7 lg:pl-10">
            <div className="flex flex-col">
              {content.chapters.map((c, i) => (
                <motion.div
                  key={c.no}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-start gap-6 border-t border-black/10 py-8 first:border-t-0 md:gap-10"
                  data-testid={`about-chapter-${c.no}`}
                >
                  <span
                    className="font-accent text-5xl italic leading-none md:text-6xl"
                    style={{ color: c.color }}
                  >
                    {c.no}
                  </span>
                  <div className="pt-1">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-heading text-2xl font-medium tracking-tight text-navy-900 md:text-3xl">
                        {c.verb}
                      </h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">
                        {c.brand}
                      </span>
                    </div>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-navy-600">
                      {c.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
