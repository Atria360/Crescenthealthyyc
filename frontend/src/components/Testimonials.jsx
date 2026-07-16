import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { brandColors } from "@/data/siteContent";

export const Testimonials = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (next) => {
      setDir(next > index || (index === items.length - 1 && next === 0) ? 1 : -1);
      setIndex((next + items.length) % items.length);
    },
    [index, items.length],
  );

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIndex((p) => (p + 1) % items.length);
    }, 6500);
    return () => clearInterval(t);
  }, [items.length]);

  const t = items[index];
  const accent = brandColors[t.brandKey];

  return (
    <section id="testimonials" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="container-x">
        <p className="eyebrow mb-12 text-center">03 — In their words</p>

        <div className="relative mx-auto min-h-[280px] max-w-4xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[1.75rem] border border-black/5 bg-white p-8 md:p-14"
              style={{ borderLeft: `5px solid ${accent}` }}
              data-testid="testimonial-card"
            >
              <div className="mb-6 flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5"
                    style={{ color: accent, fill: accent }}
                  />
                ))}
              </div>
              <p className="font-accent text-2xl italic leading-snug text-navy-900 md:text-3xl">
                “{t.text}”
              </p>
              <footer className="mt-8 flex items-center gap-3">
                <span className="font-semibold text-navy-900">{t.name}</span>
                <span className="text-navy-400">·</span>
                <span className="text-sm text-navy-500">
                  Google Review · {t.brandName}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={() => go(index - 1)}
            data-testid="testimonial-prev"
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-navy-700 transition-colors duration-300 hover:bg-navy-900 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {items.map((it, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                data-testid={`testimonial-dot-${i}`}
                aria-label={`Go to testimonial ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 28 : 8,
                  backgroundColor:
                    i === index ? brandColors[items[i].brandKey] : "#D1D5DB",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => go(index + 1)}
            data-testid="testimonial-next"
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-navy-700 transition-colors duration-300 hover:bg-navy-900 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
