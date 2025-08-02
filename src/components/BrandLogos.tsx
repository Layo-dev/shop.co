const BrandLogos = () => {
  const brands = [
    { name: "VERSACE", style: "font-serif font-bold text-xl" },
    { name: "ZARA", style: "font-bold text-xl tracking-wider" },
    { name: "GUCCI", style: "font-serif font-bold text-xl" },
    { name: "PRADA", style: "font-bold text-xl tracking-wide" },
    { name: "Calvin Klein", style: "font-light text-lg tracking-wide" },
  ];

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div key={index} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              <span className={brand.style}>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;