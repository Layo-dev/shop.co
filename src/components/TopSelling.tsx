import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

const TopSelling = () => {
  // Using placeholders since we're focusing on layout
  const products = [
    {
      image: "/placeholder.svg",
      title: "Vertical Striped Shirt",
      price: 212,
      originalPrice: 232,
      rating: 5.0,
      reviews: 20,
      discount: 20,
    },
    {
      image: "/placeholder.svg", 
      title: "Courage Graphic T-shirt",
      price: 145,
      rating: 4.0,
      reviews: 67,
    },
    {
      image: "/placeholder.svg",
      title: "Loose Fit Bermuda Shorts",
      price: 80,
      rating: 3.0,
      reviews: 56,
    },
    {
      image: "/placeholder.svg",
      title: "Faded Skinny Jeans",
      price: 210,
      rating: 4.5,
      reviews: 135,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">TOP SELLING</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="glass-button">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopSelling;