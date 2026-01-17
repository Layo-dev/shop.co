import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Shield } from "lucide-react";
import CartIcon from "@/assets/cart-Icon.svg";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import CartSidebar from "@/components/CartSidebar";
import SearchModal from "@/components/SearchModal";
import AccountSidebar from "@/components/AccountSidebar";

const Header = () => {
  const { state } = useCart();
  const { isAdmin } = useAdminRole();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  
  const goTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
            <Link to="/#on-sale" onClick={(e) => goTo(e, 'on-sale')} className="text-foreground hover:text-primary transition-colors font-medium">
              On Sale
            </Link>
            <Link to="/#new-arrivals" onClick={(e) => goTo(e, 'new-arrivals')} className="text-foreground hover:text-primary transition-colors font-medium">
              New Arrivals
            </Link>
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
          <div className="flex items-center space-x-4">
            {/* Search icon for mobile */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4"/>
              {state.totalItems > 0 && (
                <Badge 
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {state.totalItems > 99 ? '99+' : state.totalItems}
                </Badge>
              )}
            </Button>
            
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="icon" title="Admin Dashboard">
                  <Shield className="w-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setAccountOpen(true)}
            >
              <User className="w-5 h-5" />
            </Button>
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