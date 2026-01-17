import LogoLoop, { LogoItem } from "@/components/LogoLoop";

const BrandLogos = () => {
  const brands = [{
    name: "VERSACE",
    style: "font-luxury font-bold text-xl"
  }, {
    name: "ZARA",
    style: "font-bold text-xl tracking-wider"
  }, {
    name: "GUCCI",
    style: "font-serif font-bold text-xl"
  }, {
    name: "PRADA",
    style: "font-bold text-xl tracking-wide"
  }, {
    name: "Calvin Klein",
    style: "font-light text-lg tracking-wide"
  }];

  // Convert brands to LogoItem format for LogoLoop
  const logoItems: LogoItem[] = brands.map(brand => ({
    node: (
      <span className={`${brand.style} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`}>
        {brand.name}
      </span>
    )
  }));

  return (
    <section className="bg-primary text-primary-foreground py-[14px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LogoLoop
          logos={logoItems}
          speed={100}
          direction="left"
          logoHeight={28}
          gap={64}
          pauseOnHover={true}
          className="w-full"
          ariaLabel="Brand logos"
        />
      </div>
    </section>
  );
};

export default BrandLogos;