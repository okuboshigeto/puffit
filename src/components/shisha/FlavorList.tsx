'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { FaTrash, FaEdit, FaShare } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';

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

type PaginationInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type FilterState = {
  startDate: string;
  endDate: string;
  minRating: string;
  maxRating: string;
  searchFlavor: string;
  sortBy: 'date' | 'rating';
  sortOrder: 'asc' | 'desc';
};

function FlavorListContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    minRating: '',
    maxRating: '',
    searchFlavor: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, searchParams.get('t'), filters]);

  const fetchReviews = async (page: number) => {
    try {
      setIsLoading(true);
      const timestamp = searchParams.get('t');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(timestamp && { t: timestamp }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.minRating && { minRating: filters.minRating }),
        ...(filters.maxRating && { maxRating: filters.maxRating }),
        ...(filters.searchFlavor && { searchFlavor: filters.searchFlavor }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await fetch(`/api/shisha/reviews?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'レビューの取得に失敗しました');
      }

      setReviews(data.reviews.map((review: any) => ({
        id: review.id,
        date: new Date(review.date).toISOString().split('T')[0],
        flavors: review.flavors.map((f: any) => ({
          flavor: f.flavorName,
          brand: f.brand || ''
        })),
        rating: review.rating,
        memo: review.memo || ''
      })));
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レビューの取得に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // フィルター変更時は1ページ目に戻す
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      minRating: '',
      maxRating: '',
      searchFlavor: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
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

      const currentReviews = reviews.filter(review => review.id !== id);
      
      if (currentReviews.length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchReviews(currentPage);
      }
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

  const handleShare = async (id: string) => {
    try {
      await fetch(`/api/shisha/reviews/${id}/share`, {
        method: 'POST',
      });

      const review = reviews.find(r => r.id === id);
      if (!review) {
        throw new Error('Review not found');
      }

      const flavorText = review.flavors.map(f => 
        f.brand ? `${f.flavor}（${f.brand}）` : f.flavor
      ).join(' × ');

      const shareUrl = `${window.location.origin}/shisha/share/${id}`;
      const shareData = {
        title: 'シーシャのレビュー',
        text: `${flavorText}\n\nPuffitでシーシャの評価を確認しましょう！`,
        url: shareUrl
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Web Share APIがサポートされていない場合
        await navigator.clipboard.writeText(`${shareData.text}\n${shareUrl}`);
        alert('フレーバー名とURLをクリップボードにコピーしました。\nPuffitでシーシャの評価を記録しましょう！');
      }
    } catch (err) {
      console.error('Error sharing review:', err);
      alert('共有に失敗しました。');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between text-gray-700 font-medium"
        >
          <span>絞り込み・ソート</span>
          <span className="transform transition-transform duration-200">
            {isFilterOpen ? '▲' : '▼'}
          </span>
        </button>

        {isFilterOpen && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">開始日</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">終了日</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">最小評価</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">選択なし</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}点以上</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">最大評価</label>
                <select
                  value={filters.maxRating}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">選択なし</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}点以下</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">フレーバー検索</label>
              <input
                type="text"
                value={filters.searchFlavor}
                onChange={(e) => handleFilterChange('searchFlavor', e.target.value)}
                placeholder="フレーバー名で検索"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">並び順</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as 'date' | 'rating')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="date">日付</option>
                  <option value="rating">評価</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">順序</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="desc">降順（新しい順/高い順）</option>
                  <option value="asc">昇順（古い順/低い順）</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p>条件に一致する評価がありません。</p>
      ) : (
        <>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="border p-4 rounded shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold">
                    {review.flavors.map(f => 
                      f.brand ? `${f.flavor}（${f.brand}）` : f.flavor
                    ).join(' × ')}
                  </h3>
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
                {review.memo && <p className="text-gray-600">{review.memo}</p>}
                <div className="flex justify-center sm:justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => handleShare(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    <FaShare className="text-sm" />
                    <span>共有</span>
                  </button>
                  <Link
                    href={`/shisha/edit/${review.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    <FaEdit className="text-sm" />
                    <span>編集</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    <FaTrash className="text-sm" />
                    <span>削除</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pagination && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-4 py-2">
                {currentPage} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </>
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

export default function FlavorList() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    }>
      <FlavorListContent />
    </Suspense>
  );
}
