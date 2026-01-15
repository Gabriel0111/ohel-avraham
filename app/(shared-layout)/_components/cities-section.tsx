import { MapPin } from "lucide-react";

const cities = [
  "Jerusalem",
  "Bnei Brak",
  "Beit Shemesh",
  "Ashdod",
  "Modi'in Illit",
  "Elad",
  "Haifa",
  "Tiberias",
];

const CitiesSection = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground text-center mb-4">
          Shabbat Hosting Throughout the Land
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Find or offer hospitality in cities across Israel
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((city, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border border-border/50 shadow-sm hover:shadow-card hover:border-accent/30 transition-all duration-200 cursor-pointer group"
            >
              <MapPin
                className="w-4 h-4 text-accent group-hover:text-accent/80"
                strokeWidth={1.5}
              />
              <span className="text-foreground font-medium">{city}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
