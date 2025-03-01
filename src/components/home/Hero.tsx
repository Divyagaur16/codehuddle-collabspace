
import { ArrowRight, Code, Users, GitBranch, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-20 md:py-32 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 mb-6 animate-fade-in">
            <span className="text-xs font-medium text-primary">Collaboration reimagined</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-in-up text-balance">
            Code together in real-time with <span className="text-primary">CodeHuddle</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mb-10 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
            A powerful collaborative code editor for pair programming, technical interviews, and teaching. Create a room, share the link, and start coding together instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
            <Button size="lg" asChild>
              <Link to="/register">
                Start collaborating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/demo">
                Try demo
              </Link>
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
            <FeatureCard 
              icon={<Code className="h-5 w-5 text-primary" />}
              title="Real-time editing"
              description="See changes as they happen with zero delay"
            />
            <FeatureCard 
              icon={<Users className="h-5 w-5 text-primary" />}
              title="Team collaboration"
              description="Invite up to 6 members with free accounts"
            />
            <FeatureCard 
              icon={<GitBranch className="h-5 w-5 text-primary" />}
              title="GitHub integration"
              description="Publish your code directly to GitHub"
            />
          </div>
        </div>
      </div>
      
      {/* Floating code preview */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl pointer-events-none">
        <div className="glass border border-white/20 shadow-glass-lg rounded-t-xl overflow-hidden animate-slide-in-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-black/80 p-3 border-b border-white/10 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 text-xs text-white/70">collaborative-session.js</div>
          </div>
          <div className="bg-code text-code-foreground p-4 text-sm font-mono overflow-hidden h-16 sm:h-24 md:h-32 opacity-90">
            <pre className="text-blue-400">
              <span className="text-pink-400">function</span> <span className="text-yellow-300">createRoom</span><span className="text-white">(</span><span className="text-orange-300">roomName</span><span className="text-white">)</span> <span className="text-white">{'{'}</span>
              <br />  <span className="text-pink-400">const</span> <span className="text-green-300">roomId</span> <span className="text-white">=</span> <span className="text-yellow-300">generateUniqueId</span><span className="text-white">();</span>
              <br />  <span className="text-pink-400">return</span> <span className="text-white">{'{'}</span> <span className="text-green-300">id</span><span className="text-white">:</span> <span className="text-green-300">roomId</span><span className="text-white">,</span> <span className="text-green-300">name</span><span className="text-white">:</span> <span className="text-green-300">roomName</span><span className="text-white">,</span> <span className="text-green-300">createdAt</span><span className="text-white">:</span> <span className="text-yellow-300">new</span> <span className="text-yellow-300">Date</span><span className="text-white">() {'}'};</span>
              <br /><span className="text-white">{'}'}</span>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="glass-card flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="p-3 bg-primary/10 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Hero;
