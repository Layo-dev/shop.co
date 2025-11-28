import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import PaystackButton from "@/components/PaystackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Address = {
  id: string;
  user_id: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string | null;
  country: string;
  is_default: boolean | null;
};

const CartSidebar = ({ open, onOpenChange }: CartSidebarProps) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

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

  // Addresses loading and selection
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setAddressesLoading(true);
      const { data } = await (supabase as any)
        .from("addresses")
        .select("id, user_id, address_line, city, state, postal_code, country, is_default")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const rows = (data as Address[]) || [];
      setAddresses(rows);
      const def = rows.find(a => a.is_default) || rows[0] || null;
      setSelectedAddressId(def ? (def.id as string) : null);
      setAddingAddress(rows.length === 0);
      setAddressesLoading(false);
    };
    load();
  }, [user]);

  const hasAddress = !!selectedAddressId;
  const checkoutDisabled = state.items.length === 0 || !publicKey || !customerEmail || !hasAddress;

  const handleSaveAddress = async () => {
    if (!user) return;
    const isFirst = addresses.length === 0;
    const payload = {
      user_id: user.id,
      address_line: newAddress.address_line.trim(),
      city: newAddress.city.trim(),
      state: newAddress.state.trim(),
      postal_code: newAddress.postal_code?.trim() || null,
      country: newAddress.country.trim(),
      is_default: isFirst ? true : newAddress.is_default,
    };
    const { data, error } = await (supabase as any).from("addresses").insert([payload]).select().single();
    if (!error && data) {
      const refreshed = await (supabase as any)
        .from("addresses")
        .select("id, user_id, address_line, city, state, postal_code, country, is_default")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setAddresses((refreshed.data as Address[]) || []);
      setSelectedAddressId((data as Address).id as string);
      setAddingAddress(false);
      toast({ title: "Address saved", description: "Your address was added successfully." });
    } else {
      console.error('Failed to save address:', error);
      toast({ title: "Could not save address", description: error?.message || "Unknown error", variant: "destructive" });
    }
  };

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

                {/* Shipping Address selection/add */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Shipping Address</span>
                    {addresses.length > 0 && (
                      <Button variant="outline" size="sm" onClick={() => setAddingAddress(!addingAddress)}>
                        {addingAddress ? 'Cancel' : 'Add New'}
                      </Button>
                    )}
                  </div>

                  {addressesLoading ? (
                    <div className="text-sm text-muted-foreground">Loading addresses...</div>
                  ) : addresses.length > 0 && !addingAddress ? (
                    <div className="space-y-2">
                      {addresses.map(addr => (
                        <label key={addr.id} className="flex items-start gap-3 p-3 rounded-md border cursor-pointer">
                          <input
                            type="radio"
                            name="shipping_address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{addr.address_line}</div>
                            <div className="text-sm text-muted-foreground">{addr.city}, {addr.state}{addr.postal_code ? `, ${addr.postal_code}` : ''}, {addr.country}</div>
                            {addr.is_default ? (
                              <div className="text-xs text-green-600 mt-1">Default</div>
                            ) : null}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 p-3 rounded-md border">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label>Address Line</Label>
                          <Input value={newAddress.address_line} onChange={e => setNewAddress({ ...newAddress, address_line: e.target.value })} placeholder="123 Main St" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>City</Label>
                            <Input value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="City" />
                          </div>
                          <div>
                            <Label>State</Label>
                            <Input value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} placeholder="State" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Postal Code</Label>
                            <Input value={newAddress.postal_code} onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })} placeholder="Postal Code" />
                          </div>
                          <div>
                            <Label>Country</Label>
                            <Input value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} placeholder="Country" />
                          </div>
                        </div>
                        {addresses.length > 0 && (
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={newAddress.is_default} onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })} />
                            Set as default
                          </label>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveAddress} disabled={!newAddress.address_line || !newAddress.city || !newAddress.state || !newAddress.country}>Save Address</Button>
                      </div>
                    </div>
                  )}
                </div>
                
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
                  onBeforeOpen={() => onOpenChange(false)}
                  onSuccess={async (reference: string) => {
                    try {
                      if (!selectedAddressId) {
                        console.error('No address selected');
                        toast({ 
                          title: "Order creation failed", 
                          description: "No shipping address selected. Please select an address and try again.", 
                          variant: "destructive" 
                        });
                        return;
                      }
                      // Call edge function to create order with address_id
                      const payload = {
                        address_id: selectedAddressId,
                        total_amount: total,
                        items: state.items.map((i) => ({
                          product_id: String(i.productId),
                          quantity: i.quantity,
                          price_at_time: i.product.price,
                          size: i.selectedSize,
                          color: i.selectedColor?.name,
                        })),
                      };
                      const { data, error } = await supabase.functions.invoke('create-order', { body: payload });
                      if (error) {
                        console.error('Edge function error:', error);
                        toast({ 
                          title: "Order creation failed", 
                          description: `Payment received but order creation failed. Transaction reference: ${reference}. Please contact support.`, 
                          variant: "destructive" 
                        });
                        return;
                      }
                      console.log('Order created successfully:', data);
                      clearCart();
                      onOpenChange(false);
                      toast({ 
                        title: "Order placed successfully!", 
                        description: `Your order #${data.order_id.slice(0, 8)} has been created.` 
                      });
                    } catch (err: unknown) {
                      console.error('Order creation failed:', err);
                      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
                      const isNetwork = err instanceof TypeError && err.message.includes('fetch');
                      
                      toast({ 
                        title: isNetwork ? "Connection Error" : "Order failed", 
                        description: isNetwork 
                          ? "Unable to connect. Please check your internet connection and contact support with your payment reference."
                          : `${message}. Please contact support if you were charged.`, 
                        variant: "destructive" 
                      });
                    }
                  }}
                  onClose={() => {}}
                  disabled={checkoutDisabled}
                >
                  Pay Now
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