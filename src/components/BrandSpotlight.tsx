import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Globe, Award } from "lucide-react";
import { Brand } from "@/data/brands";

interface BrandSpotlightProps {
  brand: Brand;
}

const BrandSpotlight = ({ brand }: BrandSpotlightProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-2">
                <Star className="w-3 h-3 mr-1" />
                Brand Spotlight
              </Badge>
              <h2 className="text-4xl font-bold text-foreground">{brand.name}</h2>
              <p className="text-xl text-muted-foreground">Est. {brand.founded} • {brand.origin}</p>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {brand.story}
            </p>
            
            {/* Brand Values */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Brand Values</h4>
              <div className="flex flex-wrap gap-2">
                {brand.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="glass-button">
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 py-6 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{brand.productCount}+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{new Date().getFullYear() - brand.founded}+</div>
                <div className="text-sm text-muted-foreground">Years Legacy</div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="glass-button">
                Shop {brand.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="glass-button">
                <Globe className="w-4 h-4 mr-2" />
                Visit Website
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl glass-card flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-primary">{brand.name.charAt(0)}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{brand.name}</h3>
                  <p className="text-muted-foreground">Heritage Collection</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-accent/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSpotlight;