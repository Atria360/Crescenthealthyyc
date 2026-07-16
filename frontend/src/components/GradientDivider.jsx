export const GradientDivider = ({ className = "" }) => (
  <div
    aria-hidden
    className={`h-[2px] w-full bg-gradient-to-r from-[#D31245] via-[#1FA48A] to-[#9BB8A5] ${className}`}
  />
);
