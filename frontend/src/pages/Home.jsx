import { BrandSplitHero } from "@/components/BrandSplitHero";
import { ContactStrip } from "@/components/ContactStrip";
import { LocationMap } from "@/components/LocationMap";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { AboutFamily } from "@/components/AboutFamily";
import { BlogTeaser } from "@/components/BlogTeaser";
import { useSite } from "@/context/ContentContext";

export default function Home() {
  const { content, posts } = useSite();
  return (
    <>
      <BrandSplitHero brands={content.brands} hero={content.hero} />
      <ContactStrip brands={content.brands} />
      <LocationMap />
      <Testimonials items={content.testimonials} />
      <FAQ items={content.faq} />
      <AboutFamily content={content.about} marquee={content.marquee} />
      <BlogTeaser posts={posts.slice(0, 3)} />
    </>
  );
}
