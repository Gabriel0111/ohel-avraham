import { Users, Utensils, MapPin } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "Thousands",
    label: "of community members",
  },
  {
    icon: Utensils,
    value: "Hundreds",
    label: "of Shabbat meals shared",
  },
  {
    icon: MapPin,
    value: "Dozens",
    label: "of cities across Israel",
  },
];

const CommunityStats = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground text-center mb-4">
          Community Impact
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Across Israel, Shabbat tables are being shared
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-xl bg-card border border-border/50 shadow-card"
            >
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-serif font-semibold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityStats;
