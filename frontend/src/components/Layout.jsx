import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MessageForm } from "@/components/MessageForm";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { siteContent } from "@/data/siteContent";

export default function Layout() {
  const [formOpen, setFormOpen] = useState(false);
  const [formBrand, setFormBrand] = useState(null);

  const openForm = (brandShort = null) => {
    setFormBrand(brandShort);
    setFormOpen(true);
  };

  return (
    <SmoothScroll>
      <ScrollProgress />
      <ScrollToTop />
      <div className="noise-overlay relative min-h-screen bg-canvas font-body text-navy-900">
        <Navbar content={siteContent} onOpenForm={() => openForm()} />
        <main>
          <Outlet context={{ openForm }} />
        </main>
        <Footer content={siteContent} />
        <div className="h-16 md:hidden" />
      </div>

      <MessageForm
        brands={siteContent.brands}
        open={formOpen}
        setOpen={setFormOpen}
        initialBrand={formBrand}
      />
      <StickyMobileBar onMessage={() => openForm()} />
    </SmoothScroll>
  );
}
