'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';

type FlavorItem = {
  flavor: string;
  brand: string;
};

type Review = {
  id: number;
  date: string;
  flavors: FlavorItem[];
  rating: number;
  memo: string;
};

// 古い形式のデータを新しい形式に変換する関数
const convertToNewFormat = (data: any[]): Review[] => {
  return data.map(item => {
    // すでに新しい形式のデータの場合
    if (item.flavors) {
      return {
        ...item,
        date: item.date || new Date(item.id).toISOString().split('T')[0] // 日付がない場合はIDから生成
      };
    }
    // 古い形式のデータを新しい形式に変換
    return {
      id: item.id,
      date: new Date(item.id).toISOString().split('T')[0],
      flavors: [{ flavor: item.flavor, brand: item.brand }],
      rating: item.rating,
      memo: item.memo
    };
  });
};

export default function FlavorList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('shishaReviews') || '[]');
    const convertedData = convertToNewFormat(data);
    setReviews(convertedData);
  }, []);

  const handleDelete = (id: number) => {
    const newReviews = reviews.filter(review => review.id !== id);
    setReviews(newReviews);
    localStorage.setItem('shishaReviews', JSON.stringify(newReviews));
  };

  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    let currentX = startX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      currentX = touch.clientX;
      const diff = startX - currentX;
      
      if (diff > 50) {
        setSwipedId(id);
      } else if (diff < -50) {
        setSwipedId(null);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p>まだ評価がありません。</p>
      ) : (
        reviews.map((review) => (
          <div 
            key={review.id} 
            className="relative border p-4 rounded shadow-sm overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, review.id)}
          >
            <div className={`transition-transform duration-300 ${swipedId === review.id ? '-translate-x-16' : ''}`}>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">
                  {review.flavors.map(f => 
                    f.brand ? `${f.flavor}（${f.brand}）` : f.flavor
                  ).join(' × ')}
                </h3>
                <span className="text-sm text-gray-500 sm:mr-16">{review.date}</span>
              </div>
              <p>評価: {review.rating}/5</p>
              {review.memo && <p className="text-gray-600">{review.memo}</p>}
            </div>
            <div className={`absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center bg-red-100 transition-opacity duration-300 sm:opacity-100 sm:pointer-events-auto ${swipedId === review.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
        <Link href="../shisha/form" className="flex-1 bg-blue-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-blue-600 text-center whitespace-nowrap">
          新規登録
        </Link>
      </div>
    </div>
  );
}
