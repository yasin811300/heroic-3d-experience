import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import AINews from "./pages/AINews";
import Partners from "./pages/Partners";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai-news" element={<AINews />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
