
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Code, GitBranch, User, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works Section */}
        <section className="section bg-gradient-to-b from-background to-secondary/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">How CodeHuddle works</h2>
              <p className="text-muted-foreground">
                Get started in seconds and collaborate with your team in real-time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              <StepCard 
                number={1}
                title="Create a room"
                description="Sign up and create a collaborative coding room in seconds."
                icon={<Code />}
              />
              
              <StepCard 
                number={2}
                title="Invite your team"
                description="Share a link with up to 6 team members to join your room."
                icon={<Users />}
              />
              
              <StepCard 
                number={3}
                title="Code together"
                description="Edit code in real-time, chat with your team, and run your code."
                icon={<Zap />}
              />
            </div>
            
            <div className="text-center mt-16">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start collaborating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="section">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Loved by developers</h2>
              <p className="text-muted-foreground">
                Join thousands of developers who use CodeHuddle for collaboration.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="CodeHuddle has completely transformed how our team collaborates on code. The real-time editing and integrated chat save us hours every week."
                author="Sarah Chen"
                role="Senior Developer at TechCorp"
              />
              
              <TestimonialCard 
                quote="I use CodeHuddle for all my technical interviews. It's clean, reliable, and has all the features I need to evaluate candidates effectively."
                author="Michael Rodriguez"
                role="Engineering Manager"
              />
              
              <TestimonialCard 
                quote="Teaching coding remotely used to be challenging until I found CodeHuddle. Now my students can follow along and get immediate feedback."
                author="David Kim"
                role="Computer Science Educator"
              />
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <Pricing />
        
        {/* CTA Section */}
        <section className="section bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to start collaborating?</h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Join thousands of developers using CodeHuddle to write better code together.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    Sign up for free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                  <Link to="/demo">
                    Try the demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const StepCard = ({ number, title, description, icon }: { number: number; title: string; description: string; icon: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <div className="bg-primary text-primary-foreground text-sm font-medium w-6 h-6 rounded-full flex items-center justify-center mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ quote, author, role }: { quote: string; author: string; role: string }) => {
  return (
    <div className="glass-card border border-border/50 flex flex-col h-full">
      <div className="flex-1">
        <div className="text-primary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
          </svg>
        </div>
        <p className="text-foreground mb-6">{quote}</p>
      </div>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default Index;
