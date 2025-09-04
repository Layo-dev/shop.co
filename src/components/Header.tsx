import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";
import SearchModal from "@/components/SearchModal";
import AccountSidebar from "@/components/AccountSidebar";

const Header = () => {
  const { state } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="transition-transform hover:scale-105 focus:outline-none" aria-label="Go to homepage">
              <h1 className="text-xl sm:text-2xl font-bold text-gradient cursor-pointer">SHOP.CO</h1>
            </Link>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link to="/shop?category=on-sale" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              On Sale
            </Link>
            <Link to="/shop?category=new-arrivals" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              New Arrivals
            </Link>
            <Link to="/brands" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Brands
            </Link>
          </nav>

          {/* Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10 glass-card border-none cursor-pointer text-sm"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search icon for mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping cart with ${state.totalItems} items`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {state.totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs min-w-[16px] sm:min-w-[20px]"
                >
                  {state.totalItems > 99 ? '99+' : state.totalItems}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setAccountOpen(true)}
              aria-label="User account"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Mobile menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
            <nav className="px-4 py-6 space-y-4">
              <Link 
                to="/shop" 
                className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                to="/shop?category=on-sale" 
                className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                On Sale
              </Link>
              <Link 
                to="/shop?category=new-arrivals" 
                className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link 
                to="/brands" 
                className="block text-base font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Modals and Sidebars */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      <AccountSidebar open={accountOpen} onOpenChange={setAccountOpen} />
    </header>
  );
};

export default Header;