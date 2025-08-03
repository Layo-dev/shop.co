import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import ShopCategoryCard from "@/components/ShopCategoryCard";
import FeaturedSection from "@/components/FeaturedSection";
import QuickAccessChips from "@/components/QuickAccessChips";

const ShopPage = () => {
  const mainCategories = [
    {
      id: "mens",
      title: "MEN'S FASHION",
      subtitle: "Suits, Casual Wear, Sportswear, Accessories",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face",
      link: "/casual",
      bgGradient: "from-blue-600/20 to-blue-800/20"
    },
    {
      id: "womens", 
      title: "WOMEN'S FASHION",
      subtitle: "Dresses, Casual Wear, Professional, Accessories",
      image: "https://images.unsplash.com/photo-1494790108755-2616c9a93800?w=500&h=600&fit=crop&crop=face",
      link: "/casual",
      bgGradient: "from-pink-600/20 to-purple-800/20"
    },
    {
      id: "brands",
      title: "PREMIUM BRANDS", 
      subtitle: "Versace, Gucci, Prada, Calvin Klein, Zara",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop",
      link: "/casual",
      bgGradient: "from-amber-600/20 to-orange-800/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="hero-gradient py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              DISCOVER YOUR
              <br />
              <span className="text-gradient">PERFECT STYLE</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Explore our carefully curated collections across men's fashion, women's fashion, 
              and premium brands to find exactly what you're looking for.
            </p>
          </div>
        </section>

        {/* Quick Access Chips */}
        <QuickAccessChips />

        {/* Main Category Cards */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">SHOP BY CATEGORY</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse through our main collections and discover your next favorite outfit
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainCategories.map((category) => (
                <ShopCategoryCard key={category.id} {...category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Sections */}
        <FeaturedSection />
        
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopPage;