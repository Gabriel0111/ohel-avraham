const PurposeSection = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-8">
          Hospitality Is a Foundation of Our Tradition
        </h2>

        <p className="text-lg text-muted-foreground leading-relaxed">
          From the days of our forefathers, opening one&#39;s home to others has
          been a path of kindness, faith, and unity. This platform was created
          to help Jews in the Land of Israel share Shabbat together, in an
          atmosphere of trust and respect.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <div className="h-px w-16 bg-accent/50" />
          <div className="w-2 h-2 rounded-full bg-accent" />
          <div className="h-px w-16 bg-accent/50" />
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
