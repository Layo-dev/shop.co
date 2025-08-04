import { Shield, Award, Users, Clock } from "lucide-react";

const TrustIndicators = () => {
  const indicators = [
    {
      icon: Shield,
      title: "100% Authentic",
      description: "All products are guaranteed authentic from official brand partners",
      value: "Verified"
    },
    {
      icon: Award,
      title: "Premium Curation",
      description: "Carefully selected brands known for quality and craftsmanship",
      value: "50+ Brands"
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join our community of satisfied customers worldwide",
      value: "100K+ Customers"
    },
    {
      icon: Clock,
      title: "Years of Excellence",
      description: "Decades of experience in luxury fashion retail",
      value: "Since 2010"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Trust Our Brand Selection</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We partner only with the most prestigious brands to ensure you receive authentic, 
            high-quality products backed by our guarantee.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <div key={index} className="glass-card p-6 text-center rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-primary">{indicator.value}</div>
                  <h3 className="font-semibold text-foreground">{indicator.title}</h3>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;