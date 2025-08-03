import { useParams, Navigate } from "react-router-dom";
import { products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : null;
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return <Navigate to="/404" replace />;
  }

  // Enhanced product data with additional images and details
  const enhancedProduct = {
    ...product,
    images: [
      product.image,
      "/src/assets/product-tshirt.jpg",
      "/src/assets/product-shirt.jpg",
      "/src/assets/product-jeans.jpg"
    ],
    colors: [
      { name: "Blue", value: "#3B82F6" },
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Gray", value: "#6B7280" }
    ],
    description: "This premium quality garment combines style and comfort. Crafted with attention to detail, it features a modern fit that's perfect for any occasion. The fabric is carefully selected for durability and comfort.",
    material: "100% Premium Cotton",
    care: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat"],
    inStock: true
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb category={product.category.toLowerCase()} />
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ImageGallery images={enhancedProduct.images} title={product.title} />
            <ProductInfo product={enhancedProduct} />
          </div>

          {/* Product Tabs */}
          <ProductTabs product={enhancedProduct} />

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductDetailPage;