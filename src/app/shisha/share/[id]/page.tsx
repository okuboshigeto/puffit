import { notFound } from 'next/navigation';
import { getReview } from '@/lib/reviews';
import Link from 'next/link';

// 認証不要のページとして設定
export const dynamic = 'force-dynamic';

type Props = {
  params: {
    id: string;
  };
};

export default async function SharePage({ params }: Props) {
  try {
    console.log('Share page: Starting to fetch review');
    console.log('Share page: Review ID:', params.id);
    
    if (!params.id) {
      console.error('Share page: No review ID provided');
      notFound();
    }
    
    const review = await getReview(params.id);
    console.log('Share page: Review data:', JSON.stringify(review, null, 2));
    
    if (!review) {
      console.log('Share page: Review not found');
      notFound();
    }

    if (!review.flavors || !Array.isArray(review.flavors)) {
      console.error('Share page: Invalid flavors data:', review.flavors);
      throw new Error('Invalid review data: flavors is missing or invalid');
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
                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('ja-JP')}</span>
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

              <div className="pt-4 border-t flex justify-center">
                <Link 
                  href="/"
                  className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Puffitで評価を記録する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Share page: Error loading review:', error);
    throw error; // エラーを上位に伝播させて、Next.jsのエラーページを表示
  }
} 