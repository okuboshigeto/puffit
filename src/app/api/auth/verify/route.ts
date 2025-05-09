import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/utils/email';

// メール認証トークンの生成
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // トークンの生成
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    // ユーザーの更新
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: token,
        verificationTokenExpires: expires,
      },
    });

    // メール送信
    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: '確認メールを送信しました' });
  } catch (error) {
    console.error('メール認証エラー:', error);
    return NextResponse.json(
      { error: 'メール認証の処理に失敗しました' },
      { status: 500 }
    );
  }
}

// メール認証の確認
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'トークンが指定されていません' },
        { status: 400 }
      );
    }

    // トークンの検証
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 400 }
      );
    }

    // ユーザーの更新
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
        status: 'active',
      },
    });

    return NextResponse.json({ message: 'メールアドレスの確認が完了しました' });
  } catch (error) {
    console.error('メール認証確認エラー:', error);
    return NextResponse.json(
      { error: 'メール認証の確認に失敗しました' },
      { status: 500 }
    );
  }
} 