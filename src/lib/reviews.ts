import { db } from './db';

type Flavor = {
  flavor: string;
  brand?: string;
};

type Review = {
  id: string;
  reviewId: number;
  flavors: Flavor[];
  rating: number;
  memo?: string;
  date: string;
  userId: string;
};

export async function getReview(id: string): Promise<Review | null> {
  try {
    console.log('Fetching review with ID:', id);
    const review = await db.shishaReview.findUnique({
      where: { id: id },
    });
    console.log('Found review:', review);

    if (!review) {
      console.log('No review found');
      return null;
    }

    const flavors = Array.isArray(review.flavors) 
      ? review.flavors 
      : JSON.parse(review.flavors as string);

    console.log('Parsed flavors:', flavors);

    return {
      id: review.id,
      reviewId: review.reviewId,
      flavors: flavors.map((f: any) => ({
        flavor: f.flavorName || f.flavor,
        brand: f.brand || undefined,
      })),
      rating: review.rating,
      memo: review.memo || undefined,
      date: review.date.toISOString(),
      userId: review.userId,
    };
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
} 