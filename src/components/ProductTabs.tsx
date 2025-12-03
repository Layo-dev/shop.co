import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewSummary from "@/components/reviews/ReviewSummary";
import { useToast } from "@/hooks/use-toast";

interface ProductTabsProps {
  product: {
    id: string;
    title: string;
    description?: string;
    material?: string;
    care?: string[];
    image_url?: string;
  };
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  
  const {
    reviews,
    loading,
    averageRating,
    totalReviews,
    canReview,
    hasReviewed,
    fetchReviews
  } = useReviews(product.id);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleWriteReview = () => {
    if (!user) {
      toast({
        variant: "info",
        title: "Sign In Required",
        description: "Please sign in to write a review."
      });
      return;
    }
    
    if (hasReviewed) {
      toast({
        variant: "info",
        title: "Already Reviewed",
        description: "You have already reviewed this product."
      });
      return;
    }
    
    if (!canReview) {
      toast({
        variant: "info",
        title: "Purchase Required",
        description: "You need to purchase and receive this product before leaving a review."
      });
      return;
    }
    
    setIsReviewFormOpen(true);
  };

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
          <TabsTrigger value="reviews">Reviews ({totalReviews})</TabsTrigger>
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
            {/* Review Summary & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <ReviewSummary averageRating={averageRating} totalReviews={totalReviews} />
              
              <div className="flex items-center gap-3">
                <select 
                  className="glass-card rounded-lg px-3 py-2 text-sm border-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
                
                <Button onClick={handleWriteReview} size="sm">
                  Write a Review
                </Button>
              </div>
            </div>
            
            {/* Reviews List */}
            <ReviewList reviews={sortedReviews} loading={loading} />
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

      {/* Review Form Modal */}
      <ReviewForm
        productId={product.id}
        product={{
          title: product.title,
          image_url: product.image_url || ""
        }}
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        onSuccess={() => {
          fetchReviews();
          toast({
            variant: "success",
            title: "Review Submitted",
            description: "Thank you for your review!"
          });
        }}
      />
    </div>
  );
};

export default ProductTabs;
