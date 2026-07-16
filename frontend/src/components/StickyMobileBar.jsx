import { CalendarClock, MessageCircle, MapPin } from "lucide-react";
import { scrollToId } from "@/lib/scroll";

export const StickyMobileBar = ({ onMessage }) => {
  const items = [
    {
      label: "Book",
      icon: CalendarClock,
      testid: "mobile-book",
      onClick: () => scrollToId("brands"),
    },
    {
      label: "Message",
      icon: MessageCircle,
      testid: "mobile-message",
      onClick: onMessage,
    },
    {
      label: "Directions",
      icon: MapPin,
      testid: "mobile-directions",
      onClick: () => scrollToId("contact"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-black/5 bg-white/90 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-3">
        {items.map((it) => (
          <button
            key={it.label}
            data-testid={it.testid}
            onClick={it.onClick}
            className="flex flex-col items-center gap-1 py-3 text-navy-700 active:bg-black/5"
          >
            <it.icon className="h-5 w-5" />
            <span className="text-xs font-semibold">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
