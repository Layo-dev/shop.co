import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id?: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  discount?: number;
}

const ProductCard = ({ 
  id,
  image, 
  title, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  discount 
}: ProductCardProps) => {
  const content = (
    <div className="glass-card rounded-2xl p-4 group cursor-pointer">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl mb-4 bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating) 
                    ? "text-yellow-400 fill-current" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {rating}/5 ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">${price}</span>
          {originalPrice && (
            <span className="text-muted-foreground line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (id) {
    return <Link to={`/product/${id}`}>{content}</Link>;
  }

  return content;
};

export default ProductCard;