'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCalendar } from 'react-icons/fa';

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

interface FlavorFormProps {
  reviewId?: number;
}

export default function FlavorForm({ reviewId }: FlavorFormProps) {
  const [flavors, setFlavors] = useState<FlavorItem[]>([{ flavor: '', brand: '' }]);
  const [rating, setRating] = useState(3);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    if (reviewId) {
      const reviews = JSON.parse(localStorage.getItem('shishaReviews') || '[]');
      const review = reviews.find((r: Review) => r.id === reviewId);
      if (review) {
        setFlavors(review.flavors);
        setRating(review.rating);
        setMemo(review.memo);
        setDate(review.date);
      }
    }
  }, [reviewId]);

  const handleFlavorChange = (index: number, field: keyof FlavorItem, value: string) => {
    const newFlavors = [...flavors];
    newFlavors[index] = { ...newFlavors[index], [field]: value };
    setFlavors(newFlavors);
  };

  const addFlavor = () => {
    setFlavors([...flavors, { flavor: '', brand: '' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: reviewId || Date.now(),
      date,
      flavors: flavors.filter(f => f.flavor.trim() !== ''),
      rating,
      memo
    };
    const existing = JSON.parse(localStorage.getItem('shishaReviews') || '[]');
    
    if (reviewId) {
      // 編集の場合
      const updatedReviews = existing.map((review: Review) => 
        review.id === reviewId ? newEntry : review
      );
      localStorage.setItem('shishaReviews', JSON.stringify(updatedReviews));
    } else {
      // 新規作成の場合
      localStorage.setItem('shishaReviews', JSON.stringify([...existing, newEntry]));
    }
    
    router.push('/shisha/list');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold">フレーバー</h3>
        {flavors.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={item.brand}
                onChange={(e) => handleFlavorChange(index, 'brand', e.target.value)}
                className="border p-2 flex-1 rounded"
                placeholder="ブランド（任意）"
              />
              <input
                type="text"
                value={item.flavor}
                onChange={(e) => handleFlavorChange(index, 'flavor', e.target.value)}
                className="border p-2 flex-1 rounded"
                placeholder="フレーバー名"
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addFlavor}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
        >
          フレーバーを追加
        </button>
      </div>

      <div>
        <label className="block font-semibold">記録日</label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full rounded appearance-none bg-white"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <FaCalendar className="text-gray-400" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">今日の日付が自動的に設定されます</p>
      </div>

      <div>
        <label className="block font-semibold">評価（1〜5点）</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="flex-1"
            min={1}
            max={5}
            step={1}
            required
          />
          <span className="text-xl font-bold min-w-[2rem] text-center">{rating}</span>
        </div>
      </div>
      <div>
        <label className="block font-semibold">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="space-y-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
          保存する
        </button>
        <div className="flex gap-2 text-sm sm:text-base">
          <Link href="/" className="flex-1 bg-gray-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-gray-600 text-center whitespace-nowrap">
            トップページへ戻る
          </Link>
          <Link href="../shisha/list" className="flex-1 bg-green-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-green-600 text-center whitespace-nowrap">
            一覧を見る
          </Link>
        </div>
      </div>
    </form>
  );
}
