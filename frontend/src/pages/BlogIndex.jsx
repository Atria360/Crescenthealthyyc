import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useSite } from "@/context/ContentContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlogIndex() {
  const { posts } = useSite();
  const [featured, ...rest] = posts;

  if (!featured) {
    return (
      <div className="pt-[72px]" data-testid="blog-index">
        <div className="container-x py-24 text-center text-navy-500">
          No articles yet — check back soon.
        </div>
      </div>
    );
  }

  return (
    <div data-testid="blog-index">
      {/* Header */}
      <section className="pt-[72px]">
        <div className="container-x py-16 md:py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#D31245] to-[#1FA48A]" />
              From the blog
            </p>
            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.95] tracking-tight text-navy-900">
              Health, explained.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-600">
              Practical, jargon-free advice from our pharmacy, clinic and physio
              teams — to help you and your family stay well.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="pb-6">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to={`/blog/${featured.slug}`}
              data-testid={`blog-featured-${featured.slug}`}
              className="group grid grid-cols-1 overflow-hidden rounded-[1.75rem] border border-black/5 bg-white transition-shadow duration-300 hover:shadow-[0_24px_60px_rgb(0,0,0,0.1)] lg:grid-cols-2"
            >
              <div className="relative h-64 overflow-hidden lg:h-full lg:min-h-[380px]">
                <img
                  src={featured.cover}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute left-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                  style={{ backgroundColor: featured.accent }}
                >
                  {featured.tag}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-xs text-navy-400">
                  {formatDate(featured.date)} · {featured.readTime}
                </p>
                <h2 className="mt-3 font-heading text-3xl font-medium leading-tight tracking-tight text-navy-900 md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-navy-600">
                  {featured.excerpt}
                </p>
                <span
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: featured.accent }}
                >
                  Read article <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/blog/${p.slug}`}
                  data-testid={`blog-card-${p.slug}`}
                  className="group block h-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: p.accent }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-navy-400">
                      {formatDate(p.date)} · {p.readTime}
                    </p>
                    <h3 className="mt-2 font-heading text-xl font-medium leading-snug text-navy-900">
                      {p.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-navy-600">
                      {p.excerpt}
                    </p>
                    <span
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                      style={{ color: p.accent }}
                    >
                      Read <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
