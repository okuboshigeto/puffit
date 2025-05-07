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
export async function GET() {
  try {
    const reviews = await prisma.shishaReview.findMany({
      include: {
        flavors: true,
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
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
} 