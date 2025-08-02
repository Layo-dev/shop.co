const Footer = () => {
  const footerSections = [
    {
      title: "COMPANY",
      links: ["About", "Features", "Works", "Career"]
    },
    {
      title: "HELP", 
      links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"]
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"]
    },
    {
      title: "RESOURCES",
      links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"]
    }
  ];

  const paymentMethods = ["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"];

  return (
    <footer className="bg-muted/30 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-gradient mb-4">SHOP.CO</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons */}
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <span className="text-sm font-bold">T</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <span className="text-sm font-bold">F</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <span className="text-sm font-bold">I</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                <span className="text-sm font-bold">G</span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 tracking-wide">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              Shop.co © 2000-2023, All Rights Reserved
            </p>
            
            <div className="flex items-center space-x-3">
              {paymentMethods.map((method, index) => (
                <div key={index} className="glass-card rounded-lg p-2 text-xs font-semibold min-w-[50px] text-center">
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;