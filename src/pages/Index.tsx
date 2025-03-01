
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero 
          title="Code Together in Real-Time" 
          subtitle="CodeHuddle is a collaborative coding platform that makes pair programming easy and fun."
          cta={
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started — It's Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log In
                </Button>
              </Link>
            </div>
          }
        />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
