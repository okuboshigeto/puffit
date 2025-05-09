"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifySuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', textAlign: 'center' }}>
      <h1>メール認証が完了しました</h1>
      <p>アカウントが有効化されました。<br />3秒後にログイン画面へ移動します。</p>
      <a href="/auth/signin" style={{
        display: 'inline-block',
        marginTop: 24,
        padding: '12px 24px',
        background: '#4CAF50',
        color: '#fff',
        borderRadius: 4,
        textDecoration: 'none'
      }}>
        ログイン画面へ
      </a>
    </div>
  );
}
