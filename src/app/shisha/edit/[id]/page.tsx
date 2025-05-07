'use client';
import FlavorForm from '@/components/shisha/FlavorForm';
import { FaEdit } from 'react-icons/fa';

export default function EditPage({ params }: { params: { id: string } }) {
  const reviewId = parseInt(params.id);

  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-white p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
            <FaEdit className='text-blue-500 text-xl' />
          </div>
          <div className='relative'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight'>評価を編集する</h2>
            <div className='absolute -bottom-1 left-0 w-full h-0.5 bg-blue-100'></div>
          </div>
        </div>
        <FlavorForm reviewId={reviewId} />
      </div>
    </main>
  );
} 