import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Pill, Stethoscope, Activity, ArrowRight, ArrowDown } from "lucide-react";
import { brandColors } from "@/data/siteContent";

const iconMap = { pill: Pill, stethoscope: Stethoscope, activity: Activity };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const lineUp = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export const Hero = ({ content, onPick }) => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 900], [0, 140]);
  const scaleBg = useTransform(scrollY, [0, 900], [1, 1.15]);
  const yContent = useTransform(scrollY, [0, 700], [0, 90]);
  const fade = useTransform(scrollY, [0, 620], [1, 0]);

  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const glowX = useSpring(mx, { stiffness: 120, damping: 30, mass: 0.5 });
  const glowY = useSpring(my, { stiffness: 120, damping: 30, mass: 0.5 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section
      id="top"
      onMouseMove={reduce ? undefined : handleMove}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0 z-0">
        <img
          src={content.heroImage}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-canvas/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/40 via-transparent to-canvas" />
      </motion.div>

      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-[1] hidden h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
          style={{
            left: glowX,
            top: glowY,
            background:
              "radial-gradient(circle, rgba(211,18,69,0.16), rgba(31,164,138,0.12) 42%, rgba(155,184,165,0.08) 60%, transparent 72%)",
            filter: "blur(28px)",
          }}
        />
      )}

      <motion.div
        style={{ y: yContent, opacity: fade }}
        className="container-x relative z-10 w-full pb-20 pt-28"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-5xl"
        >
          <motion.p variants={fadeUp} className="eyebrow mb-7 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#D31245] to-[#1FA48A]" />
            {content.eyebrow}
          </motion.p>

          <h1 className="font-heading text-[clamp(2.75rem,8.5vw,7.5rem)] font-medium leading-[0.9] tracking-tighter text-navy-900">
            {content.titleLines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.05em]">
                <motion.span variants={lineUp} className="block">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-lg leading-relaxed text-navy-700 md:text-xl"
          >
            {content.subheadline}
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <p className="eyebrow mb-4">{content.pickerPrompt}</p>
          <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
            {content.picker.map((p) => {
              const Icon = iconMap[p.icon];
              const color = brandColors[p.key];
              return (
                <motion.button
                  key={p.key}
                  data-testid={`hero-picker-${p.key}`}
                  onClick={() => onPick(p.key)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 rounded-full border border-black/5 bg-white/80 py-3.5 pl-4 pr-5 text-left shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur-md"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}1A`, color }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-navy-800 md:text-base">
                    {p.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-navy-400 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-navy-400"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
};
