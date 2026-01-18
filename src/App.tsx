import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTopOnRoute from "@/components/ScrollToTopOnRoute";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ShopPage from "./pages/ShopPage";
import MensFashionPage from "./pages/MensFashionPage";
import WomensFashionPage from "./pages/WomensFashionPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import BrandsPage from "./pages/BrandsPage";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import AdminPage from "./pages/AdminPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import SetupProfilePage from "./pages/SetupProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import AdminUsersPage from "./pages/AdminUsersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTopOnRoute />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/mens" element={<MensFashionPage />} />
                <Route path="/womens" element={<WomensFashionPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/setup" element={<SetupProfilePage />} />
                <Route path="/account/settings" element={<AccountPage />} />
                <Route path="/account/orders" element={<OrdersPage />} />
                <Route path="/account/wishlist" element={<WishlistPage />} />
                <Route path="/casual" element={<CategoryPage category="casual" />} />
                <Route path="/formal" element={<CategoryPage category="formal" />} />
                <Route path="/party" element={<CategoryPage category="party" />} />
                <Route path="/gym" element={<CategoryPage category="gym" />} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ProductManagementPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
