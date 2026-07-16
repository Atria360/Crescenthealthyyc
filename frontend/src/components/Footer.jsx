import { GradientDivider } from "@/components/GradientDivider";

export const Footer = ({ content }) => {
  const { brands, footer } = content;
  return (
    <footer className="bg-[#F0EFEA]">
      <GradientDivider animated />
      <div className="container-x py-16">
        <div className="flex w-full flex-col items-center justify-between gap-10 sm:flex-row">
          {brands.map((brand, i) => (
            <a
              key={brand.key}
              href={brand.website}
              data-testid={`footer-logo-${brand.key}`}
              className={`flex flex-1 transition-opacity duration-300 hover:opacity-70 ${
                i === 0
                  ? "justify-center sm:justify-start"
                  : i === brands.length - 1
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

        <div className="mt-14 flex flex-col gap-4 border-t border-black/10 pt-8 text-sm text-navy-500 md:flex-row md:items-center md:justify-between">
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
