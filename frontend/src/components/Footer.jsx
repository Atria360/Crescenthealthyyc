import { Link } from "react-router-dom";
import { GradientDivider } from "@/components/GradientDivider";

const footerNav = [
  { label: "Home", to: "/" },
  { label: "Pharmacy", to: "/practice/pharmasave" },
  { label: "Clinic", to: "/practice/crescent" },
  { label: "Physio", to: "/practice/physio" },
  { label: "Blog", to: "/blog" },
];

const LOGO_ORDER = ["crescent", "pharmasave", "physio"];

export const Footer = ({ content }) => {
  const { brands, footer } = content;
  const orderedBrands = LOGO_ORDER.map((k) => brands.find((b) => b.key === k)).filter(Boolean);
  return (
    <footer className="bg-[#F0EFEA]">
      <GradientDivider animated />
      <div className="container-x py-16">
        <div className="flex w-full flex-col items-center justify-between gap-10 sm:flex-row">
          {orderedBrands.map((brand, i) => (
            <a
              key={brand.key}
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`footer-logo-${brand.key}`}
              className={`flex flex-1 transition-opacity duration-300 hover:opacity-70 ${
                i === 0
                  ? "justify-center sm:justify-start"
                  : i === orderedBrands.length - 1
                    ? "justify-center sm:justify-end"
                    : "justify-center"
              }`}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto max-w-[230px] object-contain md:h-14"
              />
            </a>
          ))}
        </div>

        <nav className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-black/10 pt-10">
          {footerNav.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={`footer-nav-${l.label.toLowerCase()}`}
              className="text-sm font-medium text-navy-600 transition-colors duration-300 hover:text-navy-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex flex-col gap-4 text-sm text-navy-500 md:flex-row md:items-center md:justify-between">
          <p>{footer.tagline}</p>
          <p className="flex items-center gap-2">
            <span>{footer.legal}</span>
            <span className="text-navy-300">·</span>
            <a
              href="#"
              data-testid="footer-privacy"
              className="transition-colors duration-300 hover:text-navy-900"
            >
              {footer.privacyLabel}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
