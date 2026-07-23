import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/format";

export const BlogTeaser = ({ posts }) => {
  return (
    <section id="blog" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-x">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">05 — From the blog</p>
            <h2 className="font-heading text-4xl font-medium tracking-tight text-navy-900 sm:text-5xl">
              Health, explained.
            </h2>
          </div>
          <Link
            to="/blog"
            data-testid="blog-view-all"
            className="hidden items-center gap-2 text-sm font-semibold text-navy-800 transition-opacity hover:opacity-70 sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {posts.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
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

        <Link
          to="/blog"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 sm:hidden"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};
