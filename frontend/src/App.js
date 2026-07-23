import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import BrandPage from "@/pages/BrandPage";
import BlogIndex from "@/pages/BlogIndex";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminContent from "@/pages/admin/AdminContent";
import { ContentProvider } from "@/context/ContentContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/practice/:key" element={<BrandPage />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminShell />}>
              <Route index element={<AdminMessages />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="content" element={<AdminContent />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
