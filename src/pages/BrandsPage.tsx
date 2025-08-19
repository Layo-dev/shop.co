import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import BrandSpotlight from "@/components/BrandSpotlight";
import BrandDirectory from "@/components/BrandDirectory";
import TrustIndicators from "@/components/TrustIndicators";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { getSpotlightBrand } from "@/data/brands";

const BrandsPage = () => {
  const spotlightBrand = getSpotlightBrand();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 hero-gradient parallax-bg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-6">
            <AnimatedSection animation="fade-in" delay={0}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-bounce-gentle">
                <Sparkles className="w-4 h-4" />
                Premium Brand Collection
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={200}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Discover 
                <span className="text-gradient"> World-Class</span>
                <br />
                Fashion Brands
              </h1>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={400}>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                From heritage luxury houses to contemporary innovators, explore our carefully 
                curated collection of the world's most prestigious fashion brands.
              </p>
            </AnimatedSection>
            
            <AnimatedSection animation="scale-in" delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="glass-button hover-scale">
                  Explore All Brands
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="glass-button hover-scale">
                  View Collections
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <AnimatedSection animation="fade-in">
        <TrustIndicators />
      </AnimatedSection>

      {/* Brand Spotlight */}
      <AnimatedSection animation="slide-up">
        <BrandSpotlight brand={spotlightBrand} />
      </AnimatedSection>

      {/* Brand Directory */}
      <AnimatedSection animation="fade-in">
        <BrandDirectory />
      </AnimatedSection>

      {/* Newsletter */}
      <AnimatedSection animation="scale-in">
        <Newsletter />
      </AnimatedSection>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll Controls */}
      <ScrollToTop />
    </div>
  );
};

export default BrandsPage;