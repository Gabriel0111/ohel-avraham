import { UserPlus, Search, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create a Profile",
    description: "As a host or as a guest",
  },
  {
    icon: Search,
    title: "Search by City",
    description: "Find a suitable Shabbat table",
  },
  {
    icon: Heart,
    title: "Share Shabbat Together",
    description: "In warmth and peace",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground text-center mb-16">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              {/* Icon Container */}
              <div className="relative mb-6 inline-flex">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-card group-hover:shadow-soft transition-shadow duration-300">
                  <step.icon
                    className="w-8 h-8 text-primary"
                    strokeWidth={1.5}
                  />
                </div>
                {/* Step Number */}
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-semibold flex items-center justify-center shadow-sm">
                  {index + 1}
                </span>
              </div>

              {/* Text */}
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Connecting Lines (Desktop) */}
        <div className="hidden md:flex justify-center items-center mt-8">
          <div className="flex items-center gap-4">
            <div className="h-px w-24 bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="h-px w-24 bg-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <div className="h-px w-24 bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
