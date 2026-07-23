import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, User } from "lucide-react";
import { formatDate } from "@/lib/format";
import { blogPosts } from "@/data/blog";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div data-testid={`blog-post-${post.slug}`}>
      {/* Header */}
      <section className="pt-[72px]">
        <div className="container-x py-14 md:py-20">
          <Link
            to="/blog"
            data-testid="blog-back"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-600 transition-colors hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <span
              className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: post.accent }}
            >
              {post.tag}
            </span>
            <h1 className="mt-5 font-heading text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.02] tracking-tight text-navy-900">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-navy-500">
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
              <span className="text-navy-300">·</span>
              <span>{formatDate(post.date)}</span>
              <span className="text-navy-300">·</span>
              <span>{post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover */}
      <section>
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[1.75rem]"
          >
            <img
              src={post.cover}
              alt={post.title}
              className="h-64 w-full object-cover md:h-[460px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <article className="py-16 md:py-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            {post.content.map((block, i) =>
              block.type === "h" ? (
                <h2
                  key={i}
                  className="mt-10 font-heading text-2xl font-medium tracking-tight text-navy-900 md:text-3xl"
                >
                  {block.text}
                </h2>
              ) : (
                <p
                  key={i}
                  className="mt-5 text-lg leading-relaxed text-navy-700"
                >
                  {block.text}
                </p>
              ),
            )}

            <div className="mt-12 border-t border-black/10 pt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 transition-opacity hover:opacity-70"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all articles
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-white/60 py-16 md:py-24">
        <div className="container-x">
          <h2 className="mb-10 font-heading text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl">
            Keep reading.
          </h2>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {related.map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={`/blog/${p.slug}`}
                  data-testid={`related-card-${p.slug}`}
                  className="group block h-full overflow-hidden rounded-[1.5rem] border border-black/5 bg-white transition-shadow duration-300 hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)]"
                >
                  <div className="relative h-44 overflow-hidden">
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
                    <h3 className="font-heading text-lg font-medium leading-snug text-navy-900">
                      {p.title}
                    </h3>
                    <span
                      className="mt-3 inline-flex items-center gap-1 text-sm font-semibold"
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
