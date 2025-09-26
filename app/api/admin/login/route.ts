import { authenticateAdmin, setAdminSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'パスワードが必要です' }, { status: 400 })
    }

    const admin = await authenticateAdmin(password)

    if (!admin) {
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 })
    }

    await setAdminSession(admin)

    return NextResponse.json({ 
      message: 'ログイン成功',
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
