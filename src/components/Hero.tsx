import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import heroImage from "@/assets/hero-models.jpg";

const Hero = () => {
  return (
    <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                FIND CLOTHES<br />
                <span className="text-gradient">THAT MATCHES</span><br />
                YOUR STYLE
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Browse through our diverse range of meticulously crafted garments, designed 
                to bring out your individuality and cater to your sense of style.
              </p>
            </div>

            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Shop Now
            </Button>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold">200+</h3>
                <p className="text-sm text-muted-foreground">International Brands</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold">2,000+</h3>
                <p className="text-sm text-muted-foreground">High-Quality Products</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold">30,000+</h3>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative">
            <div className="glass-card rounded-3xl p-2 overflow-hidden">
              <img
                src={heroImage}
                alt="Fashion models wearing trendy clothes"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-full opacity-10"></div>
            <Star className="absolute top-8 right-8 w-6 h-6 text-accent fill-current" />
            <Star className="absolute bottom-16 left-8 w-4 h-4 text-primary fill-current" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;