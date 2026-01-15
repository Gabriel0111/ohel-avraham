import { Shield, BookOpen, Heart, Users, AlertCircle } from "lucide-react";

const trustPoints = [
  { icon: Shield, text: "Verified profiles" },
  { icon: BookOpen, text: "Clear community guidelines" },
  { icon: Heart, text: "Respect for modesty and family values" },
  { icon: Users, text: "Alignment with Shabbat and Halachic standards" },
  { icon: AlertCircle, text: "Reporting and moderation mechanisms" },
];

const TrustSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground text-center mb-4">
          Built on Trust and Respect
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our community operates with clear standards to ensure a dignified
          experience for all
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border/50 shadow-card"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <point.icon
                  className="w-5 h-5 text-primary"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-foreground">{point.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
