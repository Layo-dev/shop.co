import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Breadcrumb from "@/components/Breadcrumb";
import ImageGallery from "@/components/ImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/SEO";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (productData) {
        setProduct(productData);
        
        // Fetch related products
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', id)
          .limit(4);
        
        if (related) {
          setRelatedProducts(related);
        }
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  // Enhanced product data
  const enhancedProduct = {
    ...product,
    price: Number(product.price),
    originalPrice: product.original_price ? Number(product.original_price) : undefined,
    rating: Number(product.rating),
    images: (product.images && product.images.length > 0) ? product.images : [product.image_url],
    colors: product.colors || [],
    sizes: product.sizes || [],
    inStock: product.in_stock,
    care: product.care ? (typeof product.care === 'string' ? [product.care] : product.care) : []
  };

  // Product structured data for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": enhancedProduct.images,
    "description": product.description || `${product.title} - Premium quality fashion item from Shop.co`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Shop.co"
    },
    "offers": {
      "@type": "Offer",
      "price": enhancedProduct.price,
      "priceCurrency": "NGN",
      "availability": enhancedProduct.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://shop-co-zn5p.lovable.app/product/${product.id}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": enhancedProduct.rating || 4.5,
      "reviewCount": product.reviews_count || 0
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shop-co-zn5p.lovable.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category,
        "item": `https://shop-co-zn5p.lovable.app/${product.category.toLowerCase()}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://shop-co-zn5p.lovable.app/product/${product.id}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={product.title}
        description={product.description || `${product.title} - Premium quality fashion item from Shop.co. Available now at ₦${enhancedProduct.price.toLocaleString()}`}
        canonical={`https://shop-co-zn5p.lovable.app/product/${product.id}`}
        image={enhancedProduct.images[0]}
        type="product"
        keywords={`${product.title}, ${product.category}, fashion, clothing, ${product.brand || 'Shop.co'}, buy online`}
        structuredData={[productSchema, breadcrumbSchema]}
      />
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