'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

type FlavorItem = {
  flavor: string;
  brand: string;
};

type Review = {
  id: string;
  date: string;
  flavors: FlavorItem[];
  rating: number;
  memo: string;
};

export default function FlavorList() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/shisha/reviews');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レビューの取得に失敗しました');
      }

      setReviews(data.map((review: any) => ({
        id: review.id,
        date: new Date(review.date).toISOString().split('T')[0],
        flavors: review.flavors.map((f: any) => ({
          flavor: f.flavorName,
          brand: f.brand || ''
        })),
        rating: review.rating,
        memo: review.memo || ''
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レビューの取得に失敗しました');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この評価を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/shisha/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '削除に失敗しました');
      }

      setReviews(reviews.filter(review => review.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      console.error(err);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    setTouchStart(e.touches[0].clientX);
    setSwipedId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) < 50) {
      setSwipedId(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      {reviews.length === 0 ? (
        <p>まだ評価がありません。</p>
      ) : (
        reviews.map((review) => (
          <div 
            key={review.id} 
            className="relative border p-4 rounded shadow-sm overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, review.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`transition-transform duration-300 ${swipedId === review.id ? '-translate-x-32' : ''}`}>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">
                  {review.flavors.map(f => 
                    f.brand ? `${f.flavor}（${f.brand}）` : f.flavor
                  ).join(' × ')}
                </h3>
                <span className="text-sm text-gray-500 sm:mr-32">{review.date}</span>
              </div>
              <p>評価: {review.rating}/5</p>
              {review.memo && <p className="text-gray-600">{review.memo}</p>}
            </div>
            <div className={`absolute right-0 top-0 bottom-0 w-32 flex items-center justify-center gap-2 bg-red-100 transition-opacity duration-300 sm:opacity-100 sm:pointer-events-auto ${swipedId === review.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Link
                href={`/shisha/edit/${review.id}`}
                className="p-2 text-blue-500 hover:text-blue-700"
              >
                <FaEdit />
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <button
                onClick={() => handleDelete(review.id)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
      <div className="mt-4 flex gap-2 text-sm sm:text-base">
        <Link href="/" className="flex-1 bg-gray-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-gray-600 text-center whitespace-nowrap">
          トップページへ戻る
        </Link>
        <Link href="/shisha/form" className="flex-1 bg-blue-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-blue-600 text-center whitespace-nowrap">
          新規登録
        </Link>
      </div>
    </div>
  );
}
