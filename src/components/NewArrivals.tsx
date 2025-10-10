import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const NewArrivals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);
  return <section id="new-arrivals" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">NEW ARRIVALS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                image={product.image_url || product.images?.[0]}
                title={product.title}
                price={Number(product.price)}
                originalPrice={product.original_price ? Number(product.original_price) : undefined}
                rating={Number(product.rating)}
                reviews={product.reviews}
                discount={product.discount}
              />
            ))
          )}
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