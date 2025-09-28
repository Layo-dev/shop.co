import { useState } from "react";
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ColorSelector from "@/components/ColorSelector";
import SizeSelector from "@/components/SizeSelector";
import QuantitySelector from "@/components/QuantitySelector";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/data/products";

interface ProductInfoProps {
  product: Product & {
    originalPrice?: number;
    discount?: number;
    colors?: { name: string; value: string }[];
    description?: string;
    material?: string;
    care?: string[];
    inStock?: boolean;
  };
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const isWishlisted = isInWishlist(product.id.toString());

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to choose a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      productId: product.id,
      product: product,
      selectedColor,
      selectedSize,
      quantity,
    });

    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) 
                      ? "text-yellow-400 fill-current" 
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating}/5 ({product.reviews} reviews)
            </span>
          </div>
          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-foreground">${product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
            {product.discount && (
              <Badge variant="destructive" className="text-sm">
                -{product.discount}% OFF
              </Badge>
            )}
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      )}

      {/* Color Selection */}
      {product.colors && (
        <div>
          <h3 className="font-semibold mb-3">Color: {selectedColor?.name}</h3>
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </div>
      )}

      {/* Size Selection */}
      <div>
        <h3 className="font-semibold mb-3">Size: {selectedSize || "Select a size"}</h3>
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />
      </div>

      {/* Quantity Selection */}
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          max={10}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          className="flex-1 glass-button" 
          size="lg"
          onClick={handleAddToCart}
          disabled={!selectedSize || !product.inStock}
        >
          Add to Cart
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => isWishlisted ? removeFromWishlist(product.id.toString()) : addToWishlist(product.id.toString())}
          className={isWishlisted ? "text-red-500 border-red-500" : ""}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>
        <Button variant="outline" size="lg">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Product Features */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="w-5 h-5 text-primary" />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <RotateCcw className="w-5 h-5 text-primary" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="w-5 h-5 text-primary" />
          <span>2-year warranty</span>
        </div>
      </div>

      {/* Material & Care */}
      {product.material && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-semibold mb-2">Material & Care</h3>
          <p className="text-sm text-muted-foreground mb-2">{product.material}</p>
          {product.care && (
            <ul className="text-sm text-muted-foreground space-y-1">
              {product.care.map((instruction, index) => (
                <li key={index}>• {instruction}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfo;