"use client";

import { Suspense } from 'react';
import { VerifyEmailPageContent } from './verify-email-page-content';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
        <p>読み込み中...</p>
      </div>
    }>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
