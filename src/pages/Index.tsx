import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import NewArrivals from "@/components/NewArrivals";
import TopSelling from "@/components/TopSelling";
import BrowseByStyle from "@/components/BrowseByStyle";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shop.co",
    "description": "Premium fashion e-commerce store offering the latest trends in men's and women's fashion",
    "url": "https://shop-co-zn5p.lovable.app",
    "logo": "https://shop-co-zn5p.lovable.app/src/assets/shop.png",
    "sameAs": []
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Shop.co - Premium Fashion & Clothing Online Store"
        description="Shop.co brings you the latest fashion trends, premium-quality clothing, and stylish accessories at unbeatable prices. Discover your unique style today!"
        canonical="https://shop-co-zn5p.lovable.app/"
        structuredData={structuredData}
      />
      <Header />
      <main>
        <Hero />
        <BrandLogos />
        <NewArrivals />
        <TopSelling />
        <BrowseByStyle />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
