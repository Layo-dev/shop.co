import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import productTshirt from "@/assets/product-tshirt.jpg";
import productJeans from "@/assets/product-jeans.jpg";
import productShirt from "@/assets/product-shirt.jpg";
import productOrange from "@/assets/product-orange.jpg";
const NewArrivals = () => {
  const products = [{
    image: productTshirt,
    title: "T-shirt with Tape Details",
    price: 120,
    rating: 4.5,
    reviews: 5
  }, {
    image: productJeans,
    title: "Skinny Fit Jeans",
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    reviews: 14,
    discount: 20
  }, {
    image: productShirt,
    title: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    reviews: 12
  }, {
    image: productOrange,
    title: "Sleeve Striped T-shirt",
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    reviews: 8,
    discount: 30
  }];
  return <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">NEW ARRIVALS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => <ProductCard key={index} {...product} />)}
        </div>

        <div className="text-center">
          <Button variant="outline" className="glass-button px-[30px]">
            View All
          </Button>
        </div>
      </div>
    </section>;
};
export default NewArrivals;