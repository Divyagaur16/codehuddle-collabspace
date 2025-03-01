
import { Code, Users, GitBranch, Zap, MessageSquare, Lock, Globe, Coffee } from 'lucide-react';

const Features = () => {
  return (
    <div className="section bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Everything you need to code collaboratively
          </h2>
          <p className="text-muted-foreground">
            CodeHuddle provides all the essential tools to make collaborative coding efficient and enjoyable.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Code />}
            title="Real-time Code Editor"
            description="Edit code together with zero latency. See changes as they happen with visual indicators showing who is editing what."
          />
          
          <FeatureCard 
            icon={<MessageSquare />}
            title="Integrated Chat"
            description="Discuss your code without switching tools. Built-in text chat keeps everyone on the same page."
          />
          
          <FeatureCard 
            icon={<GitBranch />}
            title="GitHub Integration"
            description="Push your collaborative work directly to GitHub repositories. Create, fork, and make pull requests without leaving CodeHuddle."
          />
          
          <FeatureCard 
            icon={<Zap />}
            title="Code Execution"
            description="Run and test your code inside the editor. Support for multiple programming languages with instant feedback."
          />
          
          <FeatureCard 
            icon={<Users />}
            title="Team Management"
            description="Organize team members with role-based permissions. Free tier supports up to 6 collaborators per room."
          />
          
          <FeatureCard 
            icon={<Lock />}
            title="Private Rooms"
            description="Create password-protected rooms for confidential coding sessions. Control who can view, edit, or run your code."
          />
          
          <FeatureCard 
            icon={<Globe />}
            title="Multi-language Support"
            description="Syntax highlighting and intellisense for all popular programming languages including JavaScript, TypeScript, Python, and more."
          />
          
          <FeatureCard 
            icon={<Coffee />}
            title="Intuitive UI"
            description="Clean, distraction-free interface designed for focused coding. Dark and light themes available."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="glass-card border border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/20 h-full">
      <div className="flex flex-col h-full">
        <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="font-semibold mb-2 text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Features;
