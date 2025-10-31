import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  added_at: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const localStorageKey = 'guest_wishlist_items';

  useEffect(() => {
    const bootstrap = async () => {
      if (user) {
        // If guest items exist, merge into Supabase then clear local
        try {
          const raw = localStorage.getItem(localStorageKey);
          const guestItems: { product_id: string }[] = raw ? JSON.parse(raw) : [];
          if (guestItems.length > 0) {
            const payload = guestItems.map(g => ({ user_id: user.id, product_id: g.product_id }));
            await supabase.from('wishlist_items').upsert(payload, { onConflict: 'user_id,product_id', ignoreDuplicates: true });
            localStorage.removeItem(localStorageKey);
          }
        } catch (e) {
          // ignore merge errors; fetch will still run
        }
        fetchWishlistItems();
      } else {
        // Load guest wishlist from localStorage
        try {
          const raw = localStorage.getItem(localStorageKey);
          const guestItems: { id: string; product_id: string; added_at: string }[] = raw ? JSON.parse(raw) : [];
          setWishlistItems(guestItems);
        } catch (e) {
          setWishlistItems([]);
        }
        setLoading(false);
      }
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to load wishlist items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      // Save to guest wishlist in localStorage
      try {
        const raw = localStorage.getItem(localStorageKey);
        const guestItems: { id: string; product_id: string; added_at: string }[] = raw ? JSON.parse(raw) : [];
        if (!guestItems.some(i => i.product_id === productId)) {
          const newItem = { id: `${productId}`, product_id: productId, added_at: new Date().toISOString() };
          const next = [...guestItems, newItem];
          localStorage.setItem(localStorageKey, JSON.stringify(next));
          setWishlistItems(next);
          toast({ title: 'Saved', description: 'Item saved to wishlist' });
        } else {
          toast({ title: 'Already saved', description: 'This item is already in your wishlist' });
        }
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to save wishlist', variant: 'destructive' });
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
        }, { onConflict: 'user_id,product_id', ignoreDuplicates: true })
        .select()
        .maybeSingle();

      // data may be null if ignored as duplicate
      if (error) throw error;

      if (data) {
        setWishlistItems(prev => prev.some(i => i.product_id === productId) ? prev : [...prev, data]);
      }
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      try {
        const raw = localStorage.getItem(localStorageKey);
        const guestItems: { id: string; product_id: string; added_at: string }[] = raw ? JSON.parse(raw) : [];
        const next = guestItems.filter(i => i.product_id !== productId);
        localStorage.setItem(localStorageKey, JSON.stringify(next));
        setWishlistItems(next);
        toast({ title: 'Removed', description: 'Item removed from wishlist' });
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to update wishlist', variant: 'destructive' });
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};