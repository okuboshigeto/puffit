export default function TobaccoPage() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center py-8'>
      <div className='max-w-2xl w-full space-y-8 px-4'>
        <div className='text-center space-y-4'>
          <h1 className='text-3xl sm:text-5xl font-bold text-gray-800 mb-1 sm:mb-2'>タバコ</h1>
          <p className='text-base sm:text-lg text-gray-600 max-w-md mx-auto whitespace-pre-line'>
            あなたのタバコ体験を彩る、{'\n'}最高のフレーバーを見つける旅へ
          </p>
        </div>

        <div className='text-center p-8 bg-white rounded-xl shadow-lg'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>現在開発中です</h2>
          <p className='text-gray-600'>しばらくお待ちください</p>
        </div>
      </div>
    </div>
  );
} 