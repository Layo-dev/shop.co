import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, ImagePlus, PartyPopper } from "lucide-react";
import RatingStars from "./RatingStars";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  productId: string;
  product: {
    title: string;
    image_url: string;
    size?: string;
    color?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'rating' | 'confirm' | 'success';

const ReviewForm = ({ productId, product, isOpen, onClose, onSuccess }: ReviewFormProps) => {
  const [step, setStep] = useState<Step>('rating');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `reviews/${user.id}/${productId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('cloth')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cloth')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload images. Please try again."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('product_reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          review_text: reviewText || null,
          images,
          verified_purchase: true
        });

      if (error) throw error;

      setStep('success');
      
      // Update product reviews count and rating
      await updateProductRating();
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit review. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateProductRating = async () => {
    try {
      // Fetch all reviews for this product to recalculate average
      const { data: reviews } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_id', productId);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        
        await supabase
          .from('products')
          .update({ 
            rating: Math.round(avgRating * 10) / 10,
            reviews: reviews.length 
          })
          .eq('id', productId);
      }
    } catch (error) {
      console.error("Error updating product rating:", error);
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onSuccess();
    }
    // Reset form state
    setStep('rating');
    setRating(0);
    setReviewText("");
    setImages([]);
    onClose();
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {step === 'rating' && (
          <div className="p-6 pt-8">
            {/* Product info */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-muted/50 rounded-lg">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{product.title}</h3>
                {(product.size || product.color) && (
                  <p className="text-xs text-muted-foreground">
                    {product.size && `Size: ${product.size}`}
                    {product.size && product.color && " | "}
                    {product.color && `Color: ${product.color}`}
                  </p>
                )}
              </div>
            </div>

            {/* Rating section */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-3">
                It won't take long, we promise
              </p>
              <RatingStars
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
                showLabel
                className="items-center"
              />
            </div>

            {/* Review text */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Write Your Review
              </label>
              <Textarea
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Image upload */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">
                Add Photos (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="w-16 h-16 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                  )}
                </label>
              </div>
            </div>

            <Button
              onClick={() => setStep('confirm')}
              disabled={rating === 0}
              className="w-full"
            >
              Next
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="p-6 pt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirm Your Review</h2>
            
            {/* Review summary */}
            <div className="glass-card rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.title}</p>
                  <RatingStars rating={rating} size="sm" />
                </div>
              </div>
              {reviewText && (
                <p className="text-sm text-muted-foreground">{reviewText}</p>
              )}
              {images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Upload ${index + 1}`}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('rating')}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 pt-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <PartyPopper className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">THANK YOU!</h2>
              <p className="text-muted-foreground">
                Your review has been submitted successfully.
              </p>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
