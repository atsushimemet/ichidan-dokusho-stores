import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const area_id = searchParams.get('area_id')
    const area_ids = searchParams.get('area_ids')
    const category_id = searchParams.get('category_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

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
