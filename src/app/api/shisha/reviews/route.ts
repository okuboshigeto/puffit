import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const data = await request.json()
    const { date, flavors, rating, memo } = data

    if (!Array.isArray(flavors)) {
      return NextResponse.json(
        { error: 'フレーバー情報が不正です' },
        { status: 400 }
      )
    }

    const review = await prisma.shishaReview.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        rating,
        memo,
        flavors: flavors.map(f => ({
          flavorName: f.flavor,
          brand: f.brand || null
        }))
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('レビュー作成エラー:', error)
    return NextResponse.json(
      { error: 'レビューの作成に失敗しました' },
      { status: 500 }
    )
  }
}

// レビュー一覧の取得
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // 自分の評価のみを取得
    const [reviews, total] = await Promise.all([
      prisma.shishaReview.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          date: 'desc'
        },
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        },
        skip,
        take: limit
      }),
      prisma.shishaReview.count({
        where: {
          userId: session.user.id
        }
      })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('レビュー取得エラー:', error)
    return NextResponse.json(
      { error: 'レビューの取得に失敗しました' },
      { status: 500 }
    )
  }
} 