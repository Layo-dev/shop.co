import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
  className?: string;
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent"
};

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};

const RatingStars = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showLabel = false,
  className
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
  
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starIndex = index + 1;
          const isFilled = starIndex <= displayRating;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starIndex)}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
              className={cn(
                "transition-transform duration-150",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors duration-150",
                  isFilled 
                    ? "text-amber-400 fill-amber-400" 
                    : "text-muted-foreground/30"
                )}
              />
            </button>
          );
        })}
      </div>
      
      {showLabel && displayRating > 0 && (
        <span className="text-sm font-medium text-amber-600">
          {ratingLabels[displayRating]}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
