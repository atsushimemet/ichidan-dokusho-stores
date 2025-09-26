import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// カテゴリタグ一覧取得
export async function GET() {
  try {
    const { data: categoryTags, error } = await supabase
      .from('category_tags')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching category tags:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { category_tags: categoryTags }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/category-tags:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// カテゴリタグ作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, display_name } = body

    // バリデーション
    if (!name || !display_name) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '必須項目が不足しています'
          }
        },
        { status: 400 }
      )
    }

    // カテゴリタグ名の重複チェック
    const { data: existingTag } = await supabase
      .from('category_tags')
      .select('id')
      .eq('name', name)
      .single()

    if (existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_ERROR',
            message: 'このカテゴリタグ名は既に登録されています'
          }
        },
        { status: 400 }
      )
    }

    // カテゴリタグ作成
    const { data: categoryTag, error } = await supabase
      .from('category_tags')
      .insert({
        name,
        display_name,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'データベースエラーが発生しました'
          }
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { category_tag: categoryTag }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '内部サーバーエラーが発生しました'
        }
      },
      { status: 500 }
    )
  }
}
