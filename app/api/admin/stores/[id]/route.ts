import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 書店詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: '書店が見つかりません'
            }
          },
          { status: 404 }
        )
      }
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

// 書店更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, area_id, category_id, x_link, instagram_link, website_link, x_post_url, google_map_link, description, is_active } = body

    // バリデーション
    if (!name || !area_id || !category_id) {
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

    // 書店名の重複チェック（自分以外）
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id, name')
      .eq('id', params.id)
      .single()

    if (!existingStore) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '書店が見つかりません'
          }
        },
        { status: 404 }
      )
    }

    if (name !== existingStore.name) {
      const { data: duplicateStore } = await supabase
        .from('stores')
        .select('id')
        .eq('name', name)
        .neq('id', params.id)
        .single()

      if (duplicateStore) {
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
    }

    // 書店更新
    const { data: store, error } = await supabase
      .from('stores')
      .update({
        name,
        area_id: parseInt(area_id, 10),
        category_id: parseInt(category_id, 10),
        x_link,
        instagram_link,
        website_link,
        x_post_url,
        google_map_link,
        description,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
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

// 書店削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 書店の存在確認
    const { data: existingStore } = await supabase
      .from('stores')
      .select('id, name')
      .eq('id', params.id)
      .single()

    if (!existingStore) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '書店が見つかりません'
          }
        },
        { status: 404 }
      )
    }

    // 書店削除
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', params.id)

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
      message: '書店を削除しました'
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
