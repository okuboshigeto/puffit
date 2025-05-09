import { notFound } from 'next/navigation';
import { getReview } from '@/lib/reviews';

// 認証不要のページとして設定
export const dynamic = 'force-dynamic';

type Props = {
  params: {
    id: string;
  };
};

export default async function ReviewPage({ params }: Props) {
  try {
    const review = await getReview(params.id);
    
    if (!review) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">
                  {review.flavors.map(f => f.brand ? `${f.flavor}（${f.brand}）` : f.flavor).join(' × ')}
                </h1>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold">評価:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
              </div>

              {review.memo && (
                <p className="text-gray-600 whitespace-pre-wrap">{review.memo}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading review:', error);
    notFound();
  }
} 