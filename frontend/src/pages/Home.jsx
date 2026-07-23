import { BrandSplitHero } from "@/components/BrandSplitHero";
import { ContactStrip } from "@/components/ContactStrip";
import { LocationMap } from "@/components/LocationMap";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { AboutFamily } from "@/components/AboutFamily";
import { BlogTeaser } from "@/components/BlogTeaser";
import { siteContent } from "@/data/siteContent";
import { blogPosts } from "@/data/blog";

export default function Home() {
  return (
    <>
      <BrandSplitHero brands={siteContent.brands} hero={siteContent.hero} />
      <ContactStrip brands={siteContent.brands} />
      <LocationMap />
      <Testimonials items={siteContent.testimonials} />
      <FAQ items={siteContent.faq} />
      <AboutFamily content={siteContent.about} marquee={siteContent.marquee} />
      <BlogTeaser posts={blogPosts.slice(0, 3)} />
    </>
  );
}
