import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, Store, Tag, Users } from "lucide-react";

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: Store },
    { label: "Brands", href: "/brands", icon: Users },
    { label: "On Sale", href: "/shop", icon: Tag },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="touch-icon" 
          className="md:hidden touch-target"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left mobile-subtitle">
            Navigation
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors touch-feedback"
              >
                <Icon className="w-5 h-5" />
                <span className="mobile-text font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-border">
          <div className="space-y-4">
            <Button 
              variant="outline" 
              size="touch" 
              className="w-full justify-start"
              onClick={() => setOpen(false)}
            >
              New Arrivals
            </Button>
            <Button 
              variant="outline" 
              size="touch" 
              className="w-full justify-start"
              onClick={() => setOpen(false)}
            >
              Customer Support
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;