export const Marquee = ({ items }) => {
  const sequence = [...items, ...items, ...items];
  return (
    <div
      aria-hidden
      className="relative w-full select-none overflow-hidden py-2"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {sequence.concat(sequence).map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-accent text-6xl font-medium italic text-navy-900/5 md:text-8xl">
              {word}
            </span>
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-[#D31245] to-[#1FA48A] opacity-20" />
          </span>
        ))}
      </div>
    </div>
  );
};
