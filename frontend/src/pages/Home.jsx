import { useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrandCards } from "@/components/BrandCards";
import { ContactStrip } from "@/components/ContactStrip";
import { LocationMap } from "@/components/LocationMap";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { AboutFamily } from "@/components/AboutFamily";
import { Footer } from "@/components/Footer";
import { MessageForm } from "@/components/MessageForm";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { siteContent } from "@/data/siteContent";
import { scrollToId } from "@/lib/scroll";

export default function Home() {
  const [highlight, setHighlight] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formBrand, setFormBrand] = useState(null);

  const handlePick = (key) => {
    setHighlight(key);
    scrollToId(`brand-${key}`, -110);
    window.clearTimeout(window.__hlTimer);
    window.__hlTimer = window.setTimeout(() => setHighlight(null), 2800);
  };

  const openForm = (brandShort = null) => {
    setFormBrand(brandShort);
    setFormOpen(true);
  };

  return (
    <SmoothScroll>
      <ScrollProgress />
      <div className="noise-overlay relative min-h-screen bg-canvas font-body text-navy-900">
        <Navbar content={siteContent} onOpenForm={() => openForm()} />
        <main>
          <Hero content={siteContent.hero} onPick={handlePick} />
          <BrandCards brands={siteContent.brands} highlight={highlight} />
          <ContactStrip brands={siteContent.brands} />
          <LocationMap />
          <Testimonials items={siteContent.testimonials} />
          <FAQ items={siteContent.faq} />
          <AboutFamily content={siteContent.about} marquee={siteContent.marquee} />
          <Footer content={siteContent} />
          <div className="h-16 md:hidden" />
        </main>

        <MessageForm
          brands={siteContent.brands}
          open={formOpen}
          setOpen={setFormOpen}
          initialBrand={formBrand}
        />
        <StickyMobileBar onMessage={() => openForm()} />
      </div>
    </SmoothScroll>
  );
}
