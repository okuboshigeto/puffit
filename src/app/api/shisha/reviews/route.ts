import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, rating, memo, flavors, date } = body

    // レビューの作成
    const review = await prisma.shishaReview.create({
      data: {
        userId,
        rating,
        memo,
        date: new Date(date),
        flavors: flavors.map((flavor: { brand?: string; flavorName: string }) => ({
          brand: flavor.brand || null,
          flavorName: flavor.flavorName,
        })),
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// レビュー一覧の取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const timestamp = searchParams.get('t');

    const [reviews, total] = await Promise.all([
      prisma.shishaReview.findMany({
        select: {
          id: true,
          reviewId: true,
          rating: true,
          memo: true,
          date: true,
          createdAt: true,
          updatedAt: true,
          flavors: true,
          isPublic: true,
          shareCount: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.shishaReview.count()
    ]);

    const response = NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

    // タイムスタンプがある場合はキャッシュを無効化
    if (timestamp) {
      response.headers.set('Cache-Control', 'no-store');
    } else {
      response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 