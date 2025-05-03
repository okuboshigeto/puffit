// 評価一覧ページ

'use client'
import FlavorList from '@/components/FlavorList';
import { FaHistory } from 'react-icons/fa';

export default function ListPage() {
  return (
   <main className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
          <FaHistory className='text-green-500 text-xl' />
        </div>
        <div className='relative'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight'>過去の評価一覧</h2>
          <div className='absolute -bottom-1 left-0 w-full h-0.5 bg-green-100'></div>
        </div>
      </div>
      <FlavorList />
    </div>
   </main>
  );
}