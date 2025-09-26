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

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/categories:', error)
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
    const { name, display_name, description, sort_order, is_active } = body

    // バリデーション
    if (!name || !display_name) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 })
    }

    // カテゴリ名の重複チェック
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name)
      .single()

    if (existingCategory) {
      return NextResponse.json({ error: 'このカテゴリ名は既に登録されています' }, { status: 400 })
    }

    // カテゴリを登録
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        display_name,
        description: description || null,
        sort_order: sort_order || 0,
        is_active: is_active !== false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'カテゴリが正常に登録されました',
      category 
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/admin/categories:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
