import Link from 'next/link';
import { FaPlus, FaHistory } from 'react-icons/fa';

export default function ShishaPage() {
  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center py-8'>
      <div className='max-w-2xl w-full space-y-8 px-4'>
        <div className='text-center space-y-4'>
          <h1 className='text-3xl sm:text-5xl font-bold text-gray-800 mb-1 sm:mb-2'>シーシャ</h1>
          <p className='text-base sm:text-lg text-gray-600 max-w-md mx-auto whitespace-pre-line'>
            あなたのシーシャ体験を彩る、{'\n'}最高のフレーバーを見つける旅へ
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
          <Link 
            href='/shisha/form' 
            className='group p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 active:scale-95'
          >
            <div className='flex flex-col items-center space-y-3 sm:space-y-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300'>
                <FaPlus className='text-blue-500 text-xl sm:text-2xl' />
              </div>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>評価を記録する</h2>
              <p className='text-sm sm:text-base text-gray-600 text-center'>
                新しいシーシャの体験を記録しましょう
              </p>
            </div>
          </Link>

          <Link 
            href='/shisha/list' 
            className='group p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 active:scale-95'
          >
            <div className='flex flex-col items-center space-y-3 sm:space-y-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300'>
                <FaHistory className='text-green-500 text-xl sm:text-2xl' />
              </div>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-800'>過去の評価を見る</h2>
              <p className='text-sm sm:text-base text-gray-600 text-center'>
                これまでのシーシャ体験を振り返りましょう
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 