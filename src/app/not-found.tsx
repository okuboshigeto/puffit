import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - ページが見つかりません</h1>
      <p className="text-gray-600 mb-8">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        トップページに戻る
      </Link>
    </div>
  )
} 