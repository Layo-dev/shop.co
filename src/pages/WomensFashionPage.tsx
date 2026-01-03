import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/TopNav";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List } from "lucide-react";
const WomensFashionPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    subcategory: '',
    priceRange: [0, 1000000] as [number, number],
    colors: [] as string[],
    sizes: [] as string[],
    sortBy: 'newest',
    categories: [] as string[],
    dressStyles: [] as string[]
  });
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*').eq('category', 'women').eq('in_stock', true);

      // Apply filters
      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }
      if (filters.colors.length > 0) {
        query = query.overlaps('colors', filters.colors);
      }
      if (filters.sizes.length > 0) {
        query = query.overlaps('sizes', filters.sizes);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', {
            ascending: false
          });
          break;
        case 'oldest':
          query = query.order('created_at', {
            ascending: true
          });
          break;
        case 'price-low':
          query = query.order('price', {
            ascending: true
          });
          break;
        case 'price-high':
          query = query.order('price', {
            ascending: false
          });
          break;
        case 'rating':
          query = query.order('rating', {
            ascending: false
          });
          break;
        default:
          query = query.order('created_at', {
            ascending: false
          });
      }
      const {
        data,
        error
      } = await query;
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);
  const subcategories = ['Dresses', 'Tops', 'Blouses', 'Jeans', 'Skirts', 'Trousers', 'Blazers', 'Jackets', 'Sweaters', 'Hoodies', 'Shorts', 'Heels', 'Flats', 'Bags', 'Accessories', 'Jewelry'];
  const colors = ['Black', 'White', 'Blue', 'Gray', 'Pink', 'Red', 'Green', 'Purple', 'Navy', 'Brown'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', '14', '16'];
  const breadcrumbItems = [{
    label: 'Home',
    href: '/'
  }, {
    label: 'Shop',
    href: '/shop'
  }, {
    label: "Women's Fashion",
    href: '/womens'
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <Breadcrumb category="Women's Fashion" className="my-[20px] px-[16px]" />

        {/* Hero Section */}
        <section className="hero-gradient py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              WOMEN'S
              <br />
              <span className="text-gradient">FASHION</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Explore our stunning collection of women's clothing, from elegant dresses to casual wear. 
              Find pieces that make you feel confident and beautiful.
            </p>
          </div>
        </section>

        {/* Filters and View Controls */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              
              </div>

              <div className="flex items-center gap-2">
                <select value={filters.sortBy} onChange={e => setFilters(prev => ({
                ...prev,
                sortBy: e.target.value
              }))} className="px-3 py-2 border rounded-md text-sm bg-background">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="flex border rounded-md">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-r-none">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
              {/* Filters Sidebar */}
              {showFilters && <FilterSidebar filters={filters} category="womens" onFiltersChange={setFilters} />}

              {/* Products Grid */}
              <div className="flex-1">
                {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({
                  length: 8
                }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                  </div> : products.length > 0 ? <ProductGrid products={products} category={"Women's Fashion"} sortBy={filters.sortBy === 'newest' ? 'newest' : filters.sortBy === 'price-low' ? 'price-low-high' : filters.sortBy === 'price-high' ? 'price-high-low' : 'most-popular'} onSortChange={value => {
                const mapped = value === 'newest' ? 'newest' : value === 'price-low-high' ? 'price-low' : value === 'price-high-low' ? 'price-high' : 'rating';
                setFilters(prev => ({
                  ...prev,
                  sortBy: mapped
                }));
              }} totalProducts={products.length} /> : <div className="text-center py-16">
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or check back later for new arrivals.
                    </p>
                    <Button variant="outline" onClick={() => setFilters({
                  subcategory: '',
                  priceRange: [0, 1000000] as [number, number],
                  colors: [],
                  sizes: [],
                  sortBy: 'newest',
                  categories: [],
                  dressStyles: []
                })}>
                      Clear Filters
                    </Button>
                  </div>}
              </div>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
      
      <Footer />
    </div>;
};
export default WomensFashionPage;