import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const FAQ = ({ items }) => {
  return (
    <section id="faq" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <p className="eyebrow mb-4">04 — Good to know</p>
            <h2 className="font-heading text-4xl font-medium leading-tight tracking-tight text-navy-900 sm:text-5xl">
              Questions,
              <br />
              answered.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-navy-600">
              Can't find what you're looking for? Message us and the right team
              will get back to you within one business day.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8"
          >
            <Accordion
              type="single"
              collapsible
              className="w-full"
              data-testid="faq-accordion"
            >
              {items.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  data-testid={`faq-item-${i}`}
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
      </div>
    </section>
  );
};
