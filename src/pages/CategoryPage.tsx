import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Breadcrumb from "@/components/Breadcrumb";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

interface CategoryPageProps {
  category: "casual" | "formal" | "party" | "gym";
}

const CategoryPage = ({ category }: CategoryPageProps) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 500] as [number, number],
    colors: [] as string[],
    sizes: [] as string[],
    dressStyles: [] as string[],
  });
  const [sortBy, setSortBy] = useState("most-popular");

  const categoryProducts = products.filter(product => 
    product.category.toLowerCase() === category
  );

  const filteredProducts = categoryProducts.filter(product => {
    // Apply filters
    if (filters.categories.length && !filters.categories.includes(product.subcategory)) return false;
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;
    if (filters.colors.length && !filters.colors.includes(product.color)) return false;
    if (filters.sizes.length && !product.sizes.some(size => filters.sizes.includes(size))) return false;
    if (filters.dressStyles.length && !filters.dressStyles.includes(product.style)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return b.rating - a.rating; // most popular by rating
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