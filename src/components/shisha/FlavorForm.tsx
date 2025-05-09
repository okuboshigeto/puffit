'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCalendar } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type { User } from '@/types/common';

interface FlavorItem {
  flavor: string;
  brand: string;
}

interface ReviewData {
  id: string;
  date: string;
  flavors: FlavorItem[];
  rating: number;
  memo: string;
}

interface FlavorFormProps {
  reviewId?: string;
}

export default function FlavorForm({ reviewId }: FlavorFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<ReviewData>({
    id: reviewId || '',
    date: new Date().toISOString().split('T')[0],
    flavors: [{ flavor: '', brand: '' }],
    rating: 3,
    memo: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reviewId) {
      fetchReviewData(reviewId);
    }
  }, [reviewId]);

  const fetchReviewData = async (id: string) => {
    try {
      if (!session?.user?.id) {
        throw new Error('ログインが必要です');
      }

      const response = await fetch(`/api/shisha/reviews/${id}?userId=${session.user.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レビューの取得に失敗しました');
      }

      if (data.userId !== session.user.id) {
        throw new Error('このレビューにアクセスする権限がありません');
      }

      setFormData({
        id: data.id,
        date: new Date(data.date).toISOString().split('T')[0],
        flavors: data.flavors.map((f: any) => ({
          flavor: f.flavorName,
          brand: f.brand || ''
        })),
        rating: data.rating,
        memo: data.memo || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レビューの取得に失敗しました');
    }
  };

  const handleFlavorChange = (index: number, field: keyof FlavorItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      flavors: prev.flavors.map((f, i) =>
        i === index ? { ...f, [field]: value } : f
      ),
    }));
  };

  const addFlavor = () => {
    setFormData(prev => ({
      ...prev,
      flavors: [...prev.flavors, { flavor: '', brand: '' }],
    }));
  };

  const validateForm = (): boolean => {
    if (!session?.user?.id) {
      setError('ログインが必要です');
      return false;
    }

    if (formData.flavors.some(f => !f.flavor.trim())) {
      setError('フレーバー名は必須です');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error('ログインが必要です');
      }

      const url = reviewId ? `/api/shisha/reviews/${reviewId}` : '/api/shisha/reviews';
      const method = reviewId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          date: formData.date,
          flavors: formData.flavors
            .filter(f => f.flavor.trim() !== '')
            .map(f => ({
              flavorName: f.flavor,
              brand: f.brand || undefined
            })),
          rating: formData.rating,
          memo: formData.memo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '保存に失敗しました');
      }

      const timestamp = new Date().getTime();
      router.push(`/shisha/list?t=${timestamp}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold">フレーバー</h3>
        {formData.flavors.map((item, index) => (
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
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
            className="flex-1"
            min={1}
            max={5}
            step={1}
            required
          />
          <span className="text-xl font-bold min-w-[2rem] text-center">{formData.rating}</span>
        </div>
      </div>
      <div>
        <label className="block font-semibold">メモ</label>
        <textarea
          value={formData.memo}
          onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
          className="border p-2 w-full rounded"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <div className="space-y-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '保存中...' : '保存する'}
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
