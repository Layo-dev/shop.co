import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortAsc } from "lucide-react";
import { brands, brandCategories, getBrandsByCategory } from "@/data/brands";
import BrandCard from "./BrandCard";
import AnimatedSection from "./AnimatedSection";

const BrandDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedBrands = useMemo(() => {
    let filtered = getBrandsByCategory(selectedCategory);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "founded":
          return b.founded - a.founded;
        case "products":
          return b.productCount - a.productCount;
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Brand Directory</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover all our partner brands and explore their unique collections
          </p>
        </div>
        
        {/* Filters and Search */}
        <div className="space-y-6 mb-12">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-none"
            />
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {brandCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="glass-button"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
          
          {/* Sort Options */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-1 text-sm"
              >
                <option value="name">Name A-Z</option>
                <option value="founded">Newest First</option>
                <option value="products">Most Products</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Showing {filteredAndSortedBrands.length} brand{filteredAndSortedBrands.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Brand Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedBrands.map((brand, index) => (
              <AnimatedSection 
                key={brand.id} 
                animation="fade-in" 
                delay={index * 100}
                className="hover-scale"
              >
                <BrandCard brand={brand} />
              </AnimatedSection>
            ))}
          </div>
          
          {filteredAndSortedBrands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No brands found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrandDirectory;