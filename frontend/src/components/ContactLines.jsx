const telHref = (number) => {
  const digits = number.replace(/\D/g, "");
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
};

const isFax = (label = "") => /fax/i.test(label);

export const ContactLines = ({ lines = [], className = "" }) => {
  const shown = (lines || []).filter((l) => l && l.number);
  if (!shown.length) return null;
  return (
    <ul className={`flex flex-col gap-1 text-sm ${className}`}>
      {shown.map((l) => (
        <li key={`${l.label}-${l.number}`} className="flex items-baseline gap-2">
          <span className="text-navy-500">{l.label}</span>
          {isFax(l.label) ? (
            <span className="font-medium text-navy-800">{l.number}</span>
          ) : (
            <a
              href={telHref(l.number)}
              className="font-medium text-navy-800 transition-opacity duration-300 hover:opacity-70"
            >
              {l.number}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};
