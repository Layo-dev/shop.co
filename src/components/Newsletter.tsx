import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 bg-primary/10 backdrop-blur-sm border-primary-foreground/20">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              STAY UPTO DATE ABOUT<br />
              OUR LATEST OFFERS
            </h2>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-primary-foreground text-primary placeholder:text-primary/70 border-none h-12 rounded-full pl-12"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full h-12 rounded-full font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;