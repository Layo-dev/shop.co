import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-models.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-gradient py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] sm:leading-tight">
                <span className="block">FIND CLOTHES</span>
                <span className="block text-gradient">THAT MATCHES</span>
                <span className="block">YOUR STYLE</span>
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-md sm:max-w-lg lg:max-w-md mx-auto lg:mx-0">
                Browse through our diverse range of meticulously crafted garments, designed 
                to bring out your individuality and cater to your sense of style.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start pt-2">
              <Link to="/shop">
                <Button variant="hero" size="xl" className="w-full xs:w-auto min-w-[180px] sm:min-w-[200px] px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium">
                  Shop Now
                </Button>
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 border-t border-border">
              <div className="text-center lg:text-left py-2 xs:py-0">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">200+</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">International Brands</p>
              </div>
              <div className="text-center lg:text-left py-2 xs:py-0 border-t xs:border-t-0 border-border xs:border-none">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">2,000+</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">High-Quality Products</p>
              </div>
              <div className="text-center lg:text-left py-2 xs:py-0 border-t xs:border-t-0 border-border xs:border-none">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">30,000+</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative order-1 lg:order-2">
            <div className="glass-card rounded-2xl sm:rounded-3xl p-2 overflow-hidden max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
              <img
                src={heroImage}
                alt="Fashion models wearing trendy clothes"
                className="w-full h-auto rounded-xl sm:rounded-2xl object-cover aspect-[4/5] sm:aspect-square"
                loading="eager"
              />
            </div>
            
            {/* Floating decorative elements - Hidden on mobile for cleaner look */}
            <div className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 sm:w-16 h-12 sm:h-16 bg-accent rounded-full opacity-20"></div>
            <div className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-8 sm:w-12 h-8 sm:h-12 bg-primary rounded-full opacity-10"></div>
            <Star className="absolute top-4 sm:top-8 right-4 sm:right-8 w-5 h-5 sm:w-6 sm:h-6 text-accent fill-current" />
            <Star className="absolute bottom-12 sm:bottom-16 left-4 sm:left-8 w-4 h-4 text-primary fill-current" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;