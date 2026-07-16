import { GradientDivider } from "@/components/GradientDivider";

export const Footer = ({ content }) => {
  const { brands, footer } = content;
  return (
    <footer className="bg-[#F0EFEA]">
      <GradientDivider animated />
      <div className="container-x py-16">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-3 sm:gap-12">
            {brands.map((brand) => (
              <a
                key={brand.key}
                href={brand.website}
                data-testid={`footer-logo-${brand.key}`}
                className="transition-opacity duration-300 hover:opacity-70"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-9 w-auto max-w-[180px] object-contain"
                />
              </a>
            ))}
          </div>
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
