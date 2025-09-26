import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";
import SearchModal from "@/components/SearchModal";
import AccountSidebar from "@/components/AccountSidebar";
import MobileNav from "@/components/MobileNav";

const Header = () => {
  const { state } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 safe-top">
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="transition-transform hover:scale-105 focus:outline-none" aria-label="Go to homepage">
              <h1 className="text-2xl font-bold text-gradient cursor-pointer">SHOP.CO</h1>
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              On Sale
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              New Arrivals
            </a>
            <Link to="/brands" className="text-foreground hover:text-primary transition-colors font-medium">
              Brands
            </Link>
          </nav>

          {/* Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 glass-card border-none cursor-pointer"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search icon for mobile */}
            <Button 
              variant="ghost" 
              size="touch-icon" 
              className="lg:hidden touch-target"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="touch-icon" 
              className="relative touch-target"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping cart with ${state.totalItems} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {state.totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
                >
                  {state.totalItems > 99 ? '99+' : state.totalItems}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="touch-icon"
              className="touch-target"
              onClick={() => setAccountOpen(true)}
              aria-label="User account"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile navigation */}
            <MobileNav />
          </div>
        </div>
      </div>

      {/* Modals and Sidebars */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <AccountSidebar open={accountOpen} onOpenChange={setAccountOpen} />
    </header>
  );
};

export default Header;