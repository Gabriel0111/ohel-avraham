import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background with candle glow effect */}
      <div className="absolute inset-0 bg-linear-to-b from-secondary/30 to-secondary/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,hsl(43_90%_70%/0.2)_0%,transparent_60%)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-3xl text-center">
        {/* Candle Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Flame className="w-8 h-8 text-accent" strokeWidth={1.5} />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-accent/10 animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-6">
          Shabbat Was Given to Be Shared
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join our community and become part of a tradition of kindness that
          spans generations.
        </p>

        <Button variant="default" size="lg">
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
