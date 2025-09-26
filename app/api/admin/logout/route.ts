import { clearAdminSession } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await clearAdminSession()
    return NextResponse.json({ message: 'ログアウトしました' })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
