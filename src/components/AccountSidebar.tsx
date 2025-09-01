import { User, Heart, Package, Settings, LogOut, Gift, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AccountSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AccountSidebar = ({ open, onOpenChange }: AccountSidebarProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const accountMenuItems = [
    { icon: Package, label: "My Orders", count: 3 },
    { icon: Heart, label: "Wishlist", count: 12 },
    { icon: Gift, label: "Rewards & Offers" },
    { icon: Settings, label: "Account Settings" },
  ];

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  const handleAuthAction = (action: 'signin' | 'signup') => {
    navigate('/auth');
    onOpenChange(false);
  };

  if (loading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!user) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center space-y-4">
              <User className="w-16 h-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">Welcome to SHOP.CO</h3>
                <p className="text-muted-foreground">Sign in to access your account</p>
              </div>
            </div>

            <div className="w-full space-y-3">
              <Button 
                className="w-full glass-button" 
                size="lg"
                onClick={() => handleAuthAction('signin')}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => handleAuthAction('signup')}
              >
                Create Account
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Benefits of signing in:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Track your orders</li>
                <li>• Save your wishlist</li>
                <li>• Faster checkout</li>
                <li>• Exclusive offers</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            My Account
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 glass-card rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {user.user_metadata?.first_name && user.user_metadata?.last_name
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                    : user.email?.split('@')[0] || 'User'
                  }
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Menu */}
          <div className="flex-1 space-y-2">
            {accountMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-4"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <Separator />

          {/* Sign Out */}
          <div className="py-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountSidebar;