import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
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
          className="flex items-center gap-3 group"
        >
          <span className="flex items-center gap-[3px]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D31245]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#1FA48A] -ml-1" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#9BB8A5] -ml-1" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-navy-900">
            {content.brandName}
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
