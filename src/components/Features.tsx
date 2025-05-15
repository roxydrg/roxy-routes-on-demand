
import { cn } from "@/lib/utils";

interface FeaturesProps {
  className?: string;
}

export const Features = ({ className }: FeaturesProps) => {
  const features = [
    {
      icon: "🏃",
      title: "Personalized Routes",
      description: "Tailored to your preferences, pace, and preferred distance"
    },
    {
      icon: "🔄",
      title: "Loop Paths",
      description: "Start and end at the same spot for convenient runs"
    },
    {
      icon: "🌳",
      title: "Scenic Options",
      description: "Discover beautiful landmarks and nature spots on your route"
    },
    {
      icon: "⏱️",
      title: "Time Estimates",
      description: "Get accurate predictions based on your personal pace"
    },
  ];

  return (
    <div className={cn("py-10", className)}>
      <h2 className="text-2xl font-bold text-center mb-8">Why Runners Love Roxy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
