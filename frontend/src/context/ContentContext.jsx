import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { siteContent as fallbackContent } from "@/data/siteContent";
import { blogPosts as fallbackPosts } from "@/data/blog";

const ContentCtx = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);
  const [posts, setPosts] = useState(fallbackPosts);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([api.get("/content"), api.get("/blog")]);
      if (c.data && typeof c.data === "object") setContent(c.data);
      if (Array.isArray(p.data)) setPosts(p.data);
    } catch (e) {
      // keep static fallback so the site never renders empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContentCtx.Provider value={{ content, posts, loading, refresh }}>
      {children}
    </ContentCtx.Provider>
  );
}

export const useSite = () => useContext(ContentCtx);
