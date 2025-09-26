import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 書店一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    // クエリ構築
    let query = supabase
      .from('stores')
      .select(`
        *,
        category_tags:store_category_tags(
          category_tag:category_tags(*)
        )
      `, { count: 'exact' })

    // 検索フィルター
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    // ページネーション
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // ソート
    query = query.order('created_at', { ascending: false })

    const { data: stores, error, count } = await query

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

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        stores: stores || [],
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      }
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

// 書店作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, area_id, category_tag_ids, x_link, instagram_link, website_link, x_post_url, google_map_link, description } = body

    // バリデーション
    if (!name || !area_id) {
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

    // 書店名の重複チェック
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id')
      .eq('name', name)
      .single()

    if (existingStore) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_ERROR',
            message: 'この書店名は既に登録されています'
          }
        },
        { status: 400 }
      )
    }

    // 書店作成
    const { data: store, error } = await supabase
      .from('stores')
      .insert({
        name,
        area_id: parseInt(area_id, 10),
        x_link,
        instagram_link,
        website_link,
        x_post_url,
        google_map_link,
        description,
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

    // カテゴリタグの関連付け
    if (category_tag_ids && category_tag_ids.length > 0) {
      const storeCategoryTags = category_tag_ids.map((tagId: number) => ({
        store_id: store.id,
        category_tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from('store_category_tags')
        .insert(storeCategoryTags)

      if (tagError) {
        console.error('Error creating store category tags:', tagError)
        // 書店は作成済みなので、エラーをログに記録するが処理は続行
      }
    }

    return NextResponse.json({
      success: true,
      data: { store }
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