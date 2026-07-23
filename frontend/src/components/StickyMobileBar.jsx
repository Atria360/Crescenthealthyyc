import { CalendarClock, MessageCircle, MapPin } from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import { mapUrl } from "@/data/siteContent";

const ADDRESS = "150-909 5 Avenue SW, Calgary, AB";

export const StickyMobileBar = ({ onMessage }) => {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-black/5 bg-white/90 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-3">
        <button
          data-testid="mobile-book"
          onClick={() => scrollToId("top", -80)}
          className="flex flex-col items-center gap-1 py-3 text-navy-700 active:bg-black/5"
        >
          <CalendarClock className="h-5 w-5" />
          <span className="text-xs font-semibold">Book</span>
        </button>
        <button
          data-testid="mobile-message"
          onClick={onMessage}
          className="flex flex-col items-center gap-1 py-3 text-navy-700 active:bg-black/5"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-semibold">Message</span>
        </button>
        <a
          data-testid="mobile-directions"
          href={mapUrl(ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-navy-700 active:bg-black/5"
        >
          <MapPin className="h-5 w-5" />
          <span className="text-xs font-semibold">Directions</span>
        </a>
      </div>
    </div>
  );
};
