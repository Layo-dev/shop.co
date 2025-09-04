const BrandLogos = () => {
  const brands = [{
    name: "VERSACE",
    style: "font-luxury font-bold text-base sm:text-lg md:text-xl"
  }, {
    name: "ZARA",
    style: "font-bold text-base sm:text-lg md:text-xl tracking-wider"
  }, {
    name: "GUCCI",
    style: "font-serif font-bold text-base sm:text-lg md:text-xl"
  }, {
    name: "PRADA",
    style: "font-bold text-base sm:text-lg md:text-xl tracking-wide"
  }, {
    name: "Calvin Klein",
    style: "font-light text-sm sm:text-base md:text-lg tracking-wide"
  }];
  return (
    <section className="bg-primary text-primary-foreground py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div key={index} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer py-2">
              <span className={brand.style}>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default BrandLogos;