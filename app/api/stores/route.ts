import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// テスト用のモックデータ
const mockStores = [
  {
    id: '1',
    name: 'テスト書店',
    area_id: 1,
    x_link: 'https://x.com/test',
    instagram_link: 'https://instagram.com/test',
    website_link: 'https://test.com',
    x_post_url: 'https://x.com/test/status/123',
    google_map_link: 'https://maps.google.com/?q=test',
    description: 'テスト用の書店です',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_tags: [
      {
        category_tag: {
          id: 1,
          name: 'coffee',
          display_name: 'コーヒー',
          is_active: true,
          created_at: new Date().toISOString()
        }
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const area_id = searchParams.get('area_id')
    const area_ids = searchParams.get('area_ids')
    const category_id = searchParams.get('category_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // テスト用：モックデータを返す
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('Using mock stores data')
      return NextResponse.json({
        success: true,
        data: {
          stores: mockStores,
          pagination: {
            page,
            limit,
            total: mockStores.length,
            totalPages: 1
          }
        }
      })
    }

    // クエリ構築
    let query = supabase
      .from('stores')
      .select(`
        *,
        category_tags:store_category_tags(
          category_tag:category_tags(*)
        )
      `, { count: 'exact' })
      .eq('is_active', true)

    // フィルター適用
    console.log('API params:', { area_id, area_ids, category_id, search })
    
    if (area_id) {
      query = query.eq('area_id', parseInt(area_id, 10))
    }
    if (area_ids) {
      // 複数のエリアIDで検索（都道府県検索用）
      const areaIdArray = area_ids.split(',').map(id => parseInt(id.trim(), 10))
      console.log('Area IDs array:', areaIdArray)
      query = query.in('area_id', areaIdArray)
    }
    if (category_id) {
      query = query.eq('category_id', parseInt(category_id, 10))
    }
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

    console.log('Query result:', { stores, error, count })

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
