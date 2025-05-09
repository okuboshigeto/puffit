'use client';

import { useSearchParams } from 'next/navigation';

export function VerifyEmailPageContent() {
  const params = useSearchParams();
  const error = params.get('error');

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
      <h1>メール認証</h1>
      {error === 'missing_token' && <p style={{ color: 'red' }}>トークンがありません。</p>}
      {error === 'invalid_or_expired' && <p style={{ color: 'red' }}>無効または期限切れのトークンです。</p>}
      {!error && <p>メールの認証リンクをクリックしてください。</p>}
    </div>
  );
} 