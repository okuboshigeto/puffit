import { FaShare } from 'react-icons/fa';

type ShareReviewProps = {
  reviewId: string;
  flavors: { flavor: string; brand?: string }[];
  rating: number;
  memo?: string;
  date: string;
  onShare: () => void;
};

export default function ShareReview({ reviewId, flavors, rating, memo, date, onShare }: ShareReviewProps) {
  // 共有ボタンを押したときの処理
  const handleShare = async () => {
    console.log('Sharing review with ID:', reviewId);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const flavorText = flavors.map(f => f.brand ? `${f.flavor}（${f.brand}）` : f.flavor).join(' × ');
    const shareData = {
      title: 'シーシャのレビュー',
      text: `${flavorText}\n\nPuffitでシーシャの評価を記録しましょう！\n${baseUrl}/shisha/share/${reviewId}`,
      url: `${baseUrl}/shisha/share/${reviewId}`,
    };
    console.log('Share data:', shareData);

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShare();
      } catch (error) {
        console.error('Share error:', error);
        alert('共有に失敗しました。');
      }
    } else {
      // Web Share API非対応の場合はURLをコピー
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert('フレーバー名とURLをクリップボードにコピーしました。\nPuffitでシーシャの評価を記録しましょう！');
      } catch (error) {
        console.error('Copy error:', error);
        alert('共有できませんでした。');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">
              {flavors.map(f => f.brand ? `${f.flavor}（${f.brand}）` : f.flavor).join(' × ')}
            </h3>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">評価:</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
          </div>
          {memo && (
            <p className="text-gray-600 whitespace-pre-wrap">{memo}</p>
          )}
          <div className="text-center text-sm text-gray-500">
            Puffitで共有
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
        >
          <FaShare />
          <span>共有する</span>
        </button>
      </div>
    </div>
  );
} 