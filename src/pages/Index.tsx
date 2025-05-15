
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { RouteForm } from "@/components/RouteForm";
import { Features } from "@/components/Features";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-roxy-light to-white">
      <Navbar user={user} onSignOut={handleSignOut} />
      
      <div className="container px-4 py-8">
        <Header />
        
        <div className="mt-8 md:mt-10">
          <RouteForm />
        </div>
        
        <Features className="mt-16" />
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Roxy Runs Her Route. Made for runners, by runners.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
