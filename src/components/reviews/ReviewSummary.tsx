import RatingStars from "./RatingStars";

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  className?: string;
}

const ReviewSummary = ({ averageRating, totalReviews, className }: ReviewSummaryProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
        <div>
          <RatingStars rating={Math.round(averageRating)} size="md" />
          <p className="text-sm text-muted-foreground mt-1">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
