import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/TopNav";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Breadcrumb from "@/components/Breadcrumb";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { supabase } from "@/integrations/supabase/client";

interface CategoryPageProps {
  category: "casual" | "formal" | "party" | "gym";
}

const CategoryPage = ({ category }: CategoryPageProps) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 500] as [number, number],
    colors: [] as string[],
    sizes: [] as string[],
    dressStyles: [] as string[],
  });
  const [sortBy, setSortBy] = useState("most-popular");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('category', category);
      
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  const categoryProducts = products;

  const filteredProducts = categoryProducts.filter(product => {
    // Apply filters
    if (filters.categories.length && product.subcategory && !filters.categories.includes(product.subcategory)) return false;
    const price = Number(product.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    // Skip color/size/style filters if product doesn't have those fields
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return Number(a.price) - Number(b.price);
      case "price-high-low":
        return Number(b.price) - Number(a.price);
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return Number(b.rating) - Number(a.rating); // most popular by rating
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb category={category} />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
            <div className="lg:col-span-1">
              <FilterSidebar 
                filters={filters}
                onFiltersChange={setFilters}
                category={category}
              />
            </div>
            
            <div className="lg:col-span-3">
              <ProductGrid
                products={sortedProducts}
                category={category}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalProducts={categoryProducts.length}
              />
            </div>
          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default CategoryPage;