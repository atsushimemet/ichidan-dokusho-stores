import { getCurrentAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 管理者認証チェック
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { data: areas, error } = await supabase
      .from('areas')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching areas:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(areas)
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/areas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者認証チェック
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const body = await request.json()
    const { name, prefecture, sort_order, is_active } = body

    // バリデーション
    if (!name || !prefecture) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    // エリア名の重複チェック
    const { data: existingArea } = await supabase
      .from('areas')
      .select('id')
      .eq('name', name)
      .single()

    if (existingArea) {
      return NextResponse.json({ error: 'このエリア名は既に登録されています' }, { status: 400 })
    }

    // エリアを登録
    const { data: area, error } = await supabase
      .from('areas')
      .insert({
        name,
        prefecture,
        sort_order: sort_order || 0,
        is_active: is_active !== false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating area:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'エリアが正常に登録されました',
      area 
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/areas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
