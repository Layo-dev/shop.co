import { Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ProductTabsProps {
  product: {
    id: number;
    title: string;
    description?: string;
    material?: string;
    care?: string[];
  };
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  // Mock reviews data
  const reviews = [
    {
      id: 1,
      userName: "Sarah M.",
      rating: 5,
      comment: "Amazing quality and fits perfectly! The material is so soft and comfortable. Highly recommend!",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      userName: "Mike R.",
      rating: 4,
      comment: "Great product overall. Good value for money. The color is exactly as shown in the pictures.",
      date: "2024-01-10",
      verified: true
    },
    {
      id: 3,
      userName: "Emma L.",
      rating: 5,
      comment: "Love this! Perfect for everyday wear. The fit is true to size and the quality exceeded my expectations.",
      date: "2024-01-08",
      verified: false
    }
  ];

  const faqs = [
    {
      question: "What is the return policy?",
      answer: "We offer a 30-day return policy for all items in original condition with tags attached."
    },
    {
      question: "How do I determine my size?",
      answer: "Please refer to our size guide above the size selector. If you're between sizes, we recommend sizing up."
    },
    {
      question: "Is this item available in other colors?",
      answer: "Yes, this item is available in multiple colors as shown in the color selector above."
    },
    {
      question: "How should I care for this item?",
      answer: "Please follow the care instructions provided in the product details section."
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass-button">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || "This premium quality garment combines style and comfort. Crafted with attention to detail, it features a modern fit that's perfect for any occasion."}
            </p>
          </div>
          
          {product.material && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Material</h3>
              <p className="text-muted-foreground">{product.material}</p>
            </div>
          )}
          
          {product.care && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Care Instructions</h3>
              <ul className="text-muted-foreground space-y-1">
                {product.care.map((instruction, index) => (
                  <li key={index}>• {instruction}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
              <select className="glass-card rounded-lg px-3 py-2 text-sm border-0">
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
            </div>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="glass-card rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? "text-yellow-400 fill-current" 
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="faqs" className="mt-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-lg p-4">
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabs;