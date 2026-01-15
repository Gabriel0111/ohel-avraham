import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Users,
  Sparkles,
  GraduationCap,
  Heart,
  HandHeart,
} from "lucide-react";

const hostBenefits = [
  { icon: Home, text: "Open your home for Shabbat" },
  { icon: HandHeart, text: "Perform an act of kindness" },
  { icon: Sparkles, text: "Strengthen the community" },
];

const guestBenefits = [
  { icon: Users, text: "Find a welcoming Shabbat table" },
  {
    icon: GraduationCap,
    text: "A solution for students, new arrivals, singles, and families",
  },
  { icon: Heart, text: "A sense of belonging" },
];

const HostsGuestsSection = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Hosts */}
          <Card className="border-border/50 shadow-card hover:shadow-soft transition-shadow duration-300 bg-background">
            <CardContent className="p-8">
              <h3 className="text-3xl font-serif font-semibold text-foreground mb-6 text-center">
                For Hosts
              </h3>

              <ul className="space-y-4 mb-8">
                {hostBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <benefit.icon
                        className="w-5 h-5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-foreground">{benefit.text}</span>
                  </li>
                ))}
              </ul>

              <Button variant="default" size="lg" className="w-full">
                I Wish to Host
              </Button>
            </CardContent>
          </Card>

          {/* For Guests */}
          <Card className="border-border/50 shadow-card hover:shadow-soft transition-shadow duration-300 bg-background">
            <CardContent className="p-8">
              <h3 className="text-3xl font-serif font-semibold text-foreground mb-6 text-center">
                For Guests
              </h3>

              <ul className="space-y-4 mb-8">
                {guestBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <benefit.icon
                        className="w-5 h-5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-foreground">{benefit.text}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" size="lg" className="w-full">
                I Am Looking for Hosting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HostsGuestsSection;
