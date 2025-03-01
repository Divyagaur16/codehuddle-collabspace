
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="section">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">
            Start for free, upgrade when you need more. No hidden fees or surprises.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard 
            title="Free"
            description="Perfect for getting started with collaborative coding"
            price="$0"
            cta="Get Started"
            ctaLink="/register"
            features={[
              "Up to 6 collaborators per room",
              "Real-time code editing",
              "Built-in text chat",
              "Basic code execution",
              "Public rooms only",
              "7-day session history",
            ]}
          />
          
          <PricingCard 
            title="Pro"
            description="For professionals who need more power and privacy"
            price="$12"
            cta="Upgrade to Pro"
            ctaLink="/register"
            popular={true}
            features={[
              "Up to 15 collaborators per room",
              "All Free features",
              "Private password-protected rooms",
              "Advanced code execution",
              "GitHub integration",
              "30-day session history",
              "Priority support",
            ]}
          />
          
          <PricingCard 
            title="Team"
            description="For teams who collaborate frequently on code projects"
            price="$49"
            cta="Contact Sales"
            ctaLink="/contact"
            features={[
              "Unlimited collaborators",
              "All Pro features",
              "Team management dashboard",
              "Advanced permissions",
              "Custom branding",
              "Unlimited session history",
              "Dedicated support",
              "Team onboarding",
            ]}
          />
        </div>
        
        <div className="mt-20 text-center">
          <h3 className="text-xl font-semibold mb-4">Need a custom plan?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We offer custom enterprise plans for larger teams and organizations with specific requirements.
            Contact our sales team to discuss your needs.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const PricingCard = ({ 
  title, 
  description, 
  price,
  cta,
  ctaLink,
  popular = false,
  features 
}: { 
  title: string; 
  description: string; 
  price: string;
  cta: string;
  ctaLink: string;
  popular?: boolean;
  features: string[] 
}) => {
  return (
    <div className={`relative rounded-xl border ${popular ? 'border-primary shadow-lg' : 'border-border'} overflow-hidden transition-all duration-300 hover:shadow-lg`}>
      {popular && (
        <div className="absolute top-0 left-0 right-0 bg-primary py-1 text-center">
          <span className="text-xs font-medium text-primary-foreground">Most Popular</span>
        </div>
      )}
      
      <div className={`p-6 ${popular ? 'pt-8' : ''}`}>
        <div className="mb-5">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-muted-foreground ml-1">/month</span>
          </div>
        </div>
        
        <Button className="w-full" variant={popular ? 'default' : 'outline'} asChild>
          <Link to={ctaLink}>{cta}</Link>
        </Button>
        
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pricing;
