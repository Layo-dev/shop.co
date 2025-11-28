import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage, logError } from "@/utils/networkErrorHandler";
import { AlertCircle } from "lucide-react";

const TopSelling = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);
      
      if (fetchError) throw fetchError;
      
      setProducts(data || []);
    } catch (err) {
      logError('TopSelling', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section id="on-sale" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">TOP SELLING</h2>
        </div>

        {error ? (
          <div className="text-center py-12 space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <div>
              <p className="text-destructive font-medium mb-2">Failed to load products</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={fetchProducts} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};

export default TopSelling;
