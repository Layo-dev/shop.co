import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import BrandSpotlight from "@/components/BrandSpotlight";
import BrandDirectory from "@/components/BrandDirectory";
import TrustIndicators from "@/components/TrustIndicators";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { getSpotlightBrand } from "@/data/brands";

const BrandsPage = () => {
  const spotlightBrand = getSpotlightBrand();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Premium Brand Collection
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Discover 
              <span className="text-gradient"> World-Class</span>
              <br />
              Fashion Brands
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From heritage luxury houses to contemporary innovators, explore our carefully 
              curated collection of the world's most prestigious fashion brands.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" className="glass-button">
                Explore All Brands
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="glass-button">
                View Collections
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Brand Spotlight */}
      <BrandSpotlight brand={spotlightBrand} />

      {/* Brand Directory */}
      <BrandDirectory />

      {/* Newsletter */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BrandsPage;