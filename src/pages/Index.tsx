
import { Header } from "@/components/Header";
import { RouteForm } from "@/components/RouteForm";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-roxy-light to-white">
      <div className="container px-4 py-12">
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
