
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Home, List, User as UserIcon, LogOut } from "lucide-react";

interface NavbarProps {
  user: User | null;
  onSignOut: () => void;
}

export const Navbar = ({ user, onSignOut }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-sm py-3">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-roxy-teal">Roxy Runs</Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home size={16} />
                  <span>Home</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <List size={16} />
                  <span>My Routes</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={onSignOut}
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        ) : (
          <Button asChild size="sm" className="gradient-bg hover:opacity-90 transition-opacity">
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
