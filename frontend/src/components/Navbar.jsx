import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Plus } from "lucide-react";
import { scrollToId, scrollToTop } from "@/lib/scroll";

const links = [
  { label: "Pharmacy", id: "brand-pharmasave" },
  { label: "Clinic", id: "brand-crescent" },
  { label: "Physio", id: "brand-physio" },
  { label: "Reviews", id: "testimonials" },
  { label: "About", id: "about" },
];

export const Navbar = ({ content, onOpenForm }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`fixed top-0 left-0 z-40 w-full transition-colors duration-500 ${
        scrolled
          ? "bg-canvas/80 backdrop-blur-xl border-b border-black/5"
          : "bg-transparent"
      }`}
      data-testid="navbar"
    >
      <nav className="container-x flex h-[72px] items-center justify-between">
        <button
          onClick={scrollToTop}
          data-testid="nav-logo"
          className="group flex items-center gap-3"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#D31245] via-[#1FA48A] to-[#9BB8A5] shadow-[0_4px_14px_rgba(31,164,138,0.35)] transition-transform duration-300 group-hover:scale-105">
            <Plus className="h-5 w-5 text-white" strokeWidth={2.75} />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/25" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-[17px] font-semibold tracking-tight text-navy-900">
              {content.brandName}
            </span>
            <span className="mt-[3px] text-[9px] font-semibold uppercase tracking-[0.2em] text-navy-400">
              Calgary Health Family
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => scrollToId(l.id)}
              className="text-sm font-medium text-navy-600 transition-colors duration-300 hover:text-navy-900"
            >
              {l.label}
            </button>
          ))}
        </div>

        <motion.button
          data-testid="nav-message-btn"
          onClick={onOpenForm}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Message us</span>
        </motion.button>
      </nav>
    </motion.header>
  );
};
