'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCalendar } from 'react-icons/fa';
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

interface FlavorFormProps {
  reviewId?: string;
}

export default function FlavorForm({ reviewId }: FlavorFormProps) {
  const { data: session } = useSession();
  const [flavors, setFlavors] = useState<FlavorItem[]>([{ flavor: '', brand: '' }]);
  const [rating, setRating] = useState(3);
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (reviewId) {
      // レビューの取得
      fetch(`/api/shisha/reviews/${reviewId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setFlavors(data.flavors.map((f: any) => ({
            flavor: f.flavorName,
            brand: f.brand || ''
          })));
          setRating(data.rating);
          setMemo(data.memo || '');
          setDate(new Date(data.date).toISOString().split('T')[0]);
        })
        .catch(err => {
          setError('レビューの取得に失敗しました');
          console.error(err);
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user?.id) {
      setError('ログインが必要です');
      return;
    }

    const reviewData = {
      userId: session.user.id,
      date,
      flavors: flavors.filter(f => f.flavor.trim() !== '').map(f => ({
        flavorName: f.flavor,
        brand: f.brand || undefined
      })),
      rating,
      memo
    };

    try {
      const url = reviewId ? `/api/shisha/reviews/${reviewId}` : '/api/shisha/reviews';
      const method = reviewId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '保存に失敗しました');
      }

      router.push('/shisha/list');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
      console.error(err);
    }
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
                required={index === 0}
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

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <div className="space-y-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
          保存する
        </button>
        <div className="flex gap-2 text-sm sm:text-base">
          <Link href="/" className="flex-1 bg-gray-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-gray-600 text-center whitespace-nowrap">
            トップページへ戻る
          </Link>
          <Link href="/shisha/list" className="flex-1 bg-green-500 text-white px-2 sm:px-4 py-2 rounded hover:bg-green-600 text-center whitespace-nowrap">
            一覧を見る
          </Link>
        </div>
      </div>
    </form>
  );
}
