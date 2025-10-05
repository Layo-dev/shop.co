import { useState, useMemo, useEffect } from "react";
import { Search, Clock, TrendingUp } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchModal = ({ open, onOpenChange }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*');
      
      if (data) {
        setProducts(data);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    return products.filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.subcategory?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 results
  }, [searchQuery, products]);

  // Popular searches
  const popularSearches = [
    "T-shirts", "Jeans", "Sneakers", "Dresses", "Hoodies", "Formal Wear"
  ];

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onOpenChange(false);
    setSearchQuery("");
  };

  const handleSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-none bg-muted/50 focus-visible:ring-0"
                autoFocus
              />
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!searchQuery.trim() ? (
              /* Popular Searches */
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSearchClick(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your recent searches will appear here
                  </p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              /* Search Results */
              <div className="space-y-3">
                <h3 className="font-semibold">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </h3>
                
                <div className="grid gap-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.image_url || product.images?.[0]}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {product.category}{product.subcategory ? ` • ${product.subcategory}` : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-sm">${Number(product.price)}</span>
                          {product.original_price && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${Number(product.original_price)}
                            </span>
                          )}
                          {product.discount && (
                            <Badge variant="destructive" className="text-xs">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching for different keywords or browse our categories
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;