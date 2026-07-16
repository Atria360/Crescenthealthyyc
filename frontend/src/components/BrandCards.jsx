import { motion } from "framer-motion";
import { BrandCard } from "@/components/BrandCard";

export const BrandCards = ({ brands, highlight }) => {
  return (
    <section id="brands" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-2xl"
        >
          <p className="eyebrow mb-4">01 — Choose your care</p>
          <h2 className="font-heading text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl">
            Three practices.
            <br />
            One family.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-8">
          {brands.map((brand) => (
            <BrandCard
              key={brand.key}
              brand={brand}
              isHighlighted={highlight === brand.key}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
