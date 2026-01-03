import Header from "@/components/TopNav";
import Hero from "@/components/Hero";
import BrandLogos from "@/components/BrandLogos";
import NewArrivals from "@/components/NewArrivals";
import TopSelling from "@/components/TopSelling";
import BrowseByStyle from "@/components/BrowseByStyle";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
