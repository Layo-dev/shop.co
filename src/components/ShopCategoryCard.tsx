import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ShopCategoryCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  bgGradient: string;
}

const ShopCategoryCard = ({ title, subtitle, image, link, bgGradient }: ShopCategoryCardProps) => {
  return (
    <Link to={link} className="group block">
      <div className="glass-card rounded-3xl overflow-hidden h-96 relative transition-all duration-500 hover:scale-105">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold leading-tight">
              {title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed">
              {subtitle}
            </p>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300 group-hover:translate-x-1"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
      </div>
    </Link>
  );
};

export default ShopCategoryCard;