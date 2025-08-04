import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { Brand } from "@/data/brands";

interface BrandCardProps {
  brand: Brand;
}

const BrandCard = ({ brand }: BrandCardProps) => {
  return (
    <div className="glass-card p-6 rounded-xl group cursor-pointer">
      <div className="space-y-4">
        {/* Brand Logo */}
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-lg font-bold text-primary">{brand.name.charAt(0)}</span>
        </div>
        
        {/* Brand Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{brand.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{brand.description}</p>
        </div>
        
        {/* Brand Details */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Est. {brand.founded}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{brand.origin}</span>
          </div>
        </div>
        
        {/* Product Count */}
        <div className="text-sm text-muted-foreground">
          {brand.productCount} products available
        </div>
        
        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
        >
          Explore Collection
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default BrandCard;