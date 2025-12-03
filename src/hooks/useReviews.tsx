import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
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

interface UseReviewsReturn {
  reviews: Review[];
  loading: boolean;
  averageRating: number;
  totalReviews: number;
  canReview: boolean;
  hasReviewed: boolean;
  fetchReviews: () => Promise<void>;
  checkCanReview: () => Promise<void>;
}

export const useReviews = (productId: string): UseReviewsReturn => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    
    setLoading(true);
    try {
      // Fetch reviews
      const { data: reviewsData, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        return;
      }

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        return;
      }

      // Fetch profiles for reviewers
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', userIds);

      // Map profiles to reviews
      const profilesMap = new Map(
        profilesData?.map(p => [p.user_id, { first_name: p.first_name, last_name: p.last_name }]) || []
      );

      const reviewsWithProfiles: Review[] = reviewsData.map(review => ({
        ...review,
        profile: profilesMap.get(review.user_id)
      }));

      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const checkCanReview = useCallback(async () => {
    if (!user || !productId) {
      setCanReview(false);
      setHasReviewed(false);
      return;
    }

    try {
      // Check if user has already reviewed
      const { data: existingReview } = await supabase
        .from('product_reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingReview) {
        setHasReviewed(true);
        setCanReview(false);
        return;
      }

      setHasReviewed(false);

      // Check if user has purchased and received this product
      const { data: canReviewResult } = await supabase
        .rpc('can_review_product', {
          _user_id: user.id,
          _product_id: productId
        });

      setCanReview(canReviewResult === true);
    } catch (error) {
      console.error("Error checking review eligibility:", error);
      setCanReview(false);
    }
  }, [user, productId]);

  useEffect(() => {
    fetchReviews();
    checkCanReview();
  }, [fetchReviews, checkCanReview]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  return {
    reviews,
    loading,
    averageRating,
    totalReviews: reviews.length,
    canReview,
    hasReviewed,
    fetchReviews,
    checkCanReview
  };
};
