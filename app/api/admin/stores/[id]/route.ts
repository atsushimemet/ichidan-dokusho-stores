import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// テスト用のモックデータ
const mockStore = {
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

// 書店詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET request for store ID:', params.id)
    
    // テスト用：モックデータを返す
    if (params.id === '1' || params.id === 'test') {
      return NextResponse.json({
        success: true,
        data: { store: mockStore }
      })
    }

    const { data: store, error } = await supabase
      .from('stores')
      .select(`
        *,
        category_tags:store_category_tags(
          category_tag:category_tags(*)
        )
      `)
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
    console.log('PATCH request body:', body)
    console.log('Store ID:', params.id)
    
    const { name, area_id, category_tag_ids, x_link, instagram_link, website_link, x_post_url, google_map_link, description, is_active } = body

    // バリデーション
    if (!name || !area_id) {
      console.log('Validation failed - missing required fields:', { name, area_id })
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

    // テスト用：モックレスポンスを返す
    if (params.id === '1' || params.id === 'test') {
      console.log('Mock update successful for store:', params.id)
      const updatedStore = {
        ...mockStore,
        name,
        area_id: parseInt(area_id, 10),
        x_link: x_link || null,
        instagram_link: instagram_link || null,
        website_link: website_link || null,
        x_post_url: x_post_url || null,
        google_map_link: google_map_link || null,
        description: description || null,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({
        success: true,
        data: { store: updatedStore }
      })
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

    // リンクフィールドの処理（空文字列はnullに変換）
    const processLink = (link: string | undefined) => {
      if (!link || link.trim() === '') return null
      return link.trim()
    }

    // 書店更新
    const updateData = {
      name,
      area_id: parseInt(area_id, 10),
      x_link: processLink(x_link),
      instagram_link: processLink(instagram_link),
      website_link: processLink(website_link),
      x_post_url: processLink(x_post_url),
      google_map_link: processLink(google_map_link),
      description: description?.trim() || null,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString()
    }
    
    console.log('Updating store with data:', updateData)
    
    const { data: store, error } = await supabase
      .from('stores')
      .update(updateData)
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
    
    console.log('Store updated successfully:', store)

    // カテゴリタグの関連付けを更新
    if (category_tag_ids !== undefined) {
      console.log('Updating category tags:', category_tag_ids)
      
      // 既存のカテゴリタグを削除
      const { error: deleteError } = await supabase
        .from('store_category_tags')
        .delete()
        .eq('store_id', parseInt(params.id, 10))

      if (deleteError) {
        console.error('Error deleting existing category tags:', deleteError)
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'DATABASE_ERROR',
              message: 'カテゴリタグの削除に失敗しました'
            }
          },
          { status: 500 }
        )
      }

      // 新しいカテゴリタグを追加
      if (category_tag_ids && category_tag_ids.length > 0) {
        const storeCategoryTags = category_tag_ids.map((tagId: number) => ({
          store_id: parseInt(params.id, 10),
          category_tag_id: tagId
        }))

        console.log('Inserting category tags:', storeCategoryTags)

        const { error: tagError } = await supabase
          .from('store_category_tags')
          .insert(storeCategoryTags)

        if (tagError) {
          console.error('Error creating store category tags:', tagError)
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'DATABASE_ERROR',
                message: 'カテゴリタグの追加に失敗しました'
              }
            },
            { status: 500 }
          )
        }
        
        console.log('Category tags updated successfully')
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
