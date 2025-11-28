import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const QuickAccessChips = () => {
  const quickLinks = [
    { label: "New Arrivals", link: "/casual", popular: true },
    { label: "Sale Items", link: "/casual", discount: true },
    { label: "Casual Wear", link: "/casual" },
    { label: "Formal Wear", link: "/formal" },
    { label: "Party Outfits", link: "/party" },
    { label: "Gym Wear", link: "/gym" },
    { label: "Accessories", link: "/casual" },
    { label: "Premium Brands", link: "/casual" },
  ];

  return (
    <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
          <p className="text-muted-foreground">Jump directly to what you're looking for</p>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {quickLinks.map((item, index) => (
            <Link key={index} to={item.link}>
              <Button 
                variant="outline" 
                size="sm"
                className={`glass-button relative ${
                  item.popular ? 'border-primary/50 bg-primary/5' : ''
                } ${
                  item.discount ? 'border-destructive/50 bg-destructive/5' : ''
                }`}
              >
                {item.label}
                {item.popular && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
                {item.discount && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessChips;