import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';

const WishlistPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, loading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const wishlistProducts = wishlistItems.map(item => {
    const product = products.find(p => p.id.toString() === item.product_id);
    return product ? { ...product, wishlistId: item.id } : null;
  }).filter(Boolean);

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addItem({
        productId: productId,
        product: product,
        selectedSize: '',
        quantity: 1,
      });
    }
  };

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId.toString());
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/account">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Link>
              </Button>
            </div>
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your wishlist...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/account">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Account
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} item(s) saved for later
            </p>
          </div>

          {wishlistProducts.length === 0 ? (
            <Card className="glass-card text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Save items you love to your wishlist
                </p>
                <Button asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <Card key={product.id} className="glass-card group overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;