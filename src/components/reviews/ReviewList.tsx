import { Badge } from "@/components/ui/badge";
import RatingStars from "./RatingStars";
import { format } from "date-fns";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  images: string[];
  verified_purchase: boolean;
  created_at: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

const ReviewList = ({ reviews, loading }: ReviewListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
              </div>
            </div>
            <div className="h-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  const getInitials = (review: Review) => {
    if (review.profile?.first_name) {
      return review.profile.first_name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (review: Review) => {
    if (review.profile?.first_name) {
      const lastName = review.profile.last_name 
        ? ` ${review.profile.last_name.charAt(0)}.` 
        : "";
      return `${review.profile.first_name}${lastName}`;
    }
    return "Anonymous";
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="glass-card rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {getInitials(review)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{getDisplayName(review)}</span>
                  {review.verified_purchase && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars rating={review.rating} size="sm" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {review.review_text && (
            <p className="text-muted-foreground mt-3">{review.review_text}</p>
          )}
          
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
