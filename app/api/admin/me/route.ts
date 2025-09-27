import { getCurrentAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // テスト用：モック管理者を返す
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('Using mock admin data')
      return NextResponse.json({ 
        admin: {
          id: 'admin-1',
          name: 'テスト管理者',
          role: 'admin'
        }
      })
    }

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
