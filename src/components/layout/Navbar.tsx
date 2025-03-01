
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code, Github, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 sm:px-6",
        isScrolled ? "py-3 glass shadow-glass" : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <Code className="h-6 w-6 text-primary" />
            <span className="tracking-tight">CodeHuddle</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/features" active={isActive('/features')}>Features</NavLink>
              <NavLink to="/pricing" active={isActive('/pricing')}>Pricing</NavLink>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              
              <Button size="sm" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
          
          <button 
            className="p-2 md:hidden rounded-md text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass shadow-glass animate-scale-in">
          <div className="p-4 flex flex-col space-y-4">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/features" active={isActive('/features')}>Features</NavLink>
            <NavLink to="/pricing" active={isActive('/pricing')}>Pricing</NavLink>
            
            <div className="pt-2 flex flex-col space-y-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Log in
                </Link>
              </Button>
              
              <Button className="justify-start" asChild>
                <Link to="/register">
                  <Github className="mr-2 h-4 w-4" />
                  Sign up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        active ? "text-primary" : "text-foreground/80"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
