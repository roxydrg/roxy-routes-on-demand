
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("py-6 text-center", className)}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
        Roxy Runs Her Route
      </h1>
      <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
        Personalized running routes that fit your distance, location, and preferences
      </p>
    </header>
  );
};
