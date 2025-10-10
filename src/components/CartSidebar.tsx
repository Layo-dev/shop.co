import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import PaystackButton from "@/components/PaystackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSidebar = ({ open, onOpenChange }: CartSidebarProps) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const subtotal = state.totalPrice;
  const shipping = state.totalShippingFee;
  const total = state.grandTotal;

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined;
  const customerEmail = user?.email || "";

  // Remove USD/NGN conversion logic and Paystack amount calculation if not needed for display
  const checkoutDisabled = state.items.length === 0 || !publicKey || !customerEmail;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
            {state.totalItems > 0 && (
              <Badge variant="secondary" className="ml-2">
                {state.totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Your cart is empty</h3>
                  <p className="text-muted-foreground">Add some items to get started</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 glass-card rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.title}</h4>
                      
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        {item.selectedColor && (
                          <span>Color: {item.selectedColor.name}</span>
                        )}
                        {item.selectedSize && (
                          <span>Size: {item.selectedSize}</span>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">₦{item.product.price}</span>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Shipping: {item.product.shippingFee ? `₦${item.product.shippingFee.toLocaleString()}` : 'Free'}</span>
                          <span>Total: ₦{((item.product.price + (item.product.shippingFee || 0)) * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({state.totalItems} items)</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span>
                  </div>
                  
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">All items have free shipping!</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                
                <PaystackButton
                  className="w-full glass-button"
                  amount={total} // Paystack amount is in Naira
                  email={customerEmail}
                  publicKey={publicKey || ""}
                  currency="NGN"
                  metadata={{
                    items: state.items.map((i) => ({
                      id: i.id,
                      productId: i.productId,
                      name: i.product.title,
                      price: i.product.price,
                      shippingFee: i.product.shippingFee || 0,
                      quantity: i.quantity,
                      color: i.selectedColor?.name,
                      size: i.selectedSize,
                    })),
                    totals: { subtotal: subtotal, shipping: shipping, total: total },
                  }}
                  onSuccess={async () => {
                    await createOrder({
                      total_amount: total,
                      items: state.items.map((i) => ({
                        product_id: String(i.productId),
                        quantity: i.quantity,
                        price_at_time: i.product.price,
                        size: i.selectedSize,
                        color: i.selectedColor?.name,
                      })),
                    });
                    clearCart();
                    onOpenChange(false);
                  }}
                  onClose={() => {}
                  }
                  disabled={checkoutDisabled}
                >
                  Proceed to Checkout
                </PaystackButton>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;