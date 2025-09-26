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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit - 1

    const { data: stores, error, count } = await supabase
      .from('stores')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex)

    if (error) {
      console.error('Error fetching stores:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalPages = count ? Math.ceil(count / limit) : 0

    return NextResponse.json({
      stores,
      page,
      limit,
      total: count,
      totalPages,
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/stores:', error)
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
    const { name, area_id, category_id, x_link, instagram_link, website_link, x_post_url, google_map_link, description, is_active } = body

    // バリデーション
    if (!name || !area_id || !category_id) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    // 書店名の重複チェック
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('name', name)
      .single()

    if (existingStore) {
      return NextResponse.json({ error: 'この書店名は既に登録されています' }, { status: 400 })
    }

    // 書店を登録
    const { data: store, error } = await supabase
      .from('stores')
      .insert({
        name,
        area_id: parseInt(area_id, 10),
        category_id: parseInt(category_id, 10),
        x_link: x_link || null,
        instagram_link: instagram_link || null,
        website_link: website_link || null,
        x_post_url: x_post_url || null,
        google_map_link: google_map_link || null,
        description: description || null,
        is_active: is_active !== false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating store:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: '書店が正常に登録されました',
      store 
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/stores:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
