import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// レビューの取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const review = await prisma.shishaReview.findUnique({
      where: {
        id: params.id,
      },
      include: {
        flavors: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review' },
      { status: 500 }
    )
  }
}

// レビューの更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { rating, memo, flavors, date } = body

    // 既存のフレーバーを削除
    await prisma.shishaFlavor.deleteMany({
      where: {
        reviewId: params.id,
      },
    })

    // レビューを更新
    const review = await prisma.shishaReview.update({
      where: {
        id: params.id,
      },
      data: {
        rating,
        memo,
        date: new Date(date),
        flavors: {
          create: flavors.map((flavor: { brand?: string; flavorName: string }) => ({
            brand: flavor.brand,
            flavorName: flavor.flavorName,
          })),
        },
      },
      include: {
        flavors: true,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// レビューの削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.shishaReview.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
} 