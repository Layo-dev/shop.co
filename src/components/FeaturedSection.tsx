import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Sparkles } from "lucide-react";
import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productShirt from "@/assets/product-shirt.jpg";
import productOrange from "@/assets/product-orange.jpg";

const FeaturedSection = () => {
  const featuredProducts = [
    {
      image: productTshirt,
      title: "Trending T-Shirt",
      price: 120,
      originalPrice: 150,
      rating: 4.8,
      badge: "Trending"
    },
    {
      image: productJeans,
      title: "Premium Jeans",
      price: 240,
      originalPrice: 300,
      rating: 4.6,
      badge: "Popular"
    },
    {
      image: productShirt,
      title: "Elegant Shirt",
      price: 180,
      rating: 4.9,
      badge: "New"
    },
    {
      image: productOrange,
      title: "Casual Wear",
      price: 130,
      originalPrice: 160,
      rating: 4.7,
      badge: "Sale"
    }
  ];

  const collections = [
    {
      title: "Summer Collection 2024",
      description: "Light, breathable fabrics perfect for warm weather",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=400&fit=crop",
      link: "/casual"
    },
    {
      title: "Professional Workwear",
      description: "Sophisticated pieces for the modern professional",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face",
      link: "/formal"
    }
  ];

  return (
    <div className="space-y-20">
      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">FEATURED PRODUCTS</h2>
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular and trending items, handpicked just for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (
              <Link key={index} to="/casual" className="group">
                <div className="glass-card rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.badge === 'Trending' ? 'bg-primary text-primary-foreground' :
                        product.badge === 'Popular' ? 'bg-blue-600 text-white' :
                        product.badge === 'New' ? 'bg-green-600 text-white' :
                        'bg-destructive text-destructive-foreground'
                      }`}>
                        {product.badge}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">({product.rating})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/casual">
              <Button variant="outline" className="glass-button px-8">
                <TrendingUp className="w-4 h-4 mr-2" />
                View All Featured Items
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Collections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SPECIAL COLLECTIONS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Curated collections designed for specific occasions and seasons
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link key={index} to={collection.link} className="group">
                <div className="glass-card rounded-3xl overflow-hidden h-64 relative transition-all duration-500 hover:scale-105">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/20" />
                  
                  <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">{collection.title}</h3>
                      <p className="text-white/90">{collection.description}</p>
                      <Button 
                        variant="secondary" 
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary"
                      >
                        Explore Collection
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedSection;