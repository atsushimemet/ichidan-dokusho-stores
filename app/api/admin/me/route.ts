import { getCurrentAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error('Get admin error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
