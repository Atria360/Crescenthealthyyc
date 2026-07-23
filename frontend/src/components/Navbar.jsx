import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Clinic", to: "/practice/crescent" },
  { label: "Pharmacy", to: "/practice/pharmasave" },
  { label: "Physio", to: "/practice/physio" },
  { label: "Blog", to: "/blog" },
];

export const Navbar = ({ content, onOpenForm }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`fixed top-0 left-0 z-50 w-full border-b bg-canvas/85 backdrop-blur-xl transition-colors duration-300 ${
        scrolled || menuOpen ? "border-black/5" : "border-transparent"
      }`}
      data-testid="navbar"
    >
      <nav className="container-x flex h-[72px] items-center justify-between">
        <Link
          to="/"
          data-testid="nav-logo"
          aria-label="Crescent Wellness Centre — home"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-end justify-center gap-[3.5px] rounded-xl border border-black/[0.06] bg-white px-[9px] pb-[11px] pt-2 shadow-[0_4px_14px_rgba(10,17,40,0.08)] transition-transform duration-300 group-hover:scale-105"
          >
            <span className="w-[4px] rounded-full bg-[#D31245] transition-[height] duration-300 group-hover:h-[15px]" style={{ height: "11px" }} />
            <span className="w-[4px] rounded-full bg-[#1FA48A]" style={{ height: "18px" }} />
            <span className="w-[4px] rounded-full bg-[#1E3A5F] transition-[height] duration-300 group-hover:h-[16px]" style={{ height: "13px" }} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-[18px] font-semibold tracking-tight text-navy-900">
              {content.brandName}
            </span>
            <span className="mt-[4px] flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em]">
              <span style={{ color: "#0F7A66" }}>Clinic</span>
              <span className="text-navy-300">·</span>
              <span style={{ color: "#B10E39" }}>Pharmacy</span>
              <span className="text-navy-300">·</span>
              <span style={{ color: "#1E3A5F" }}>Physio</span>
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-sm font-medium text-navy-600 transition-colors duration-300 hover:text-navy-900"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
          <button
            data-testid="nav-menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy-800 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/5 bg-canvas lg:hidden"
          >
            <div className="container-x flex flex-col py-3">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-black/5 py-3.5 text-base font-medium text-navy-800 last:border-0"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
