import { Button } from "@/components/ui/button";
// import heroImage from "@/public/hero-shabbat.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {/*<div*/}
      {/*  className="absolute inset-0 bg-cover bg-center bg-no-repeat"*/}
      {/*  style={{ backgroundImage: `url(${heroImage.src})` }}*/}
      {/*/>*/}

      {/* Candle Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,hsl(43_90%_70%/0.15)_0%,transparent_50%)]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Main Title */}
          <h1 className="text-5xl sm:text-5xl md:text-6xl font-serif font-semibold mb-6 leading-tight">
            Welcome to Ohel Avraham
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Connecting hosts and guests for the holy Shabbat throughout the Land
            of Israel.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button size="xl">Join the Community</Button>
            <Button size="xl" variant="outline">
              Find Shabbat Hosting
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
