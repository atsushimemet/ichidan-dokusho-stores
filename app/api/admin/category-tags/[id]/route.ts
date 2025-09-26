import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// カテゴリタグ詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: categoryTag, error } = await supabase
      .from('category_tags')
      .select('*')
      .eq('id', parseInt(params.id, 10))
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'カテゴリタグが見つかりません'
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

// カテゴリタグ更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, display_name, is_active } = body

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

    // カテゴリタグ名の重複チェック（自分以外）
    const { data: existingTag } = await supabase
      .from('category_tags')
      .select('id, name')
      .eq('id', parseInt(params.id, 10))
      .single()

    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'カテゴリタグが見つかりません'
          }
        },
        { status: 404 }
      )
    }

    if (name !== existingTag.name) {
      const { data: duplicateTag } = await supabase
        .from('category_tags')
        .select('id')
        .eq('name', name)
        .neq('id', parseInt(params.id, 10))
        .single()

      if (duplicateTag) {
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
    }

    // カテゴリタグ更新
    const { data: categoryTag, error } = await supabase
      .from('category_tags')
      .update({
        name,
        display_name,
        is_active: is_active !== undefined ? is_active : true
      })
      .eq('id', parseInt(params.id, 10))
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

// カテゴリタグ削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // カテゴリタグの存在確認
    const { data: existingTag } = await supabase
      .from('category_tags')
      .select('id, name')
      .eq('id', parseInt(params.id, 10))
      .single()

    if (!existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'カテゴリタグが見つかりません'
          }
        },
        { status: 404 }
      )
    }

    // 書店との関連をチェック
    const { data: relatedStores } = await supabase
      .from('store_category_tags')
      .select('id')
      .eq('category_tag_id', parseInt(params.id, 10))
      .limit(1)

    if (relatedStores && relatedStores.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RELATED_DATA_EXISTS',
            message: 'このカテゴリタグは書店で使用されているため削除できません'
          }
        },
        { status: 400 }
      )
    }

    // カテゴリタグ削除
    const { error } = await supabase
      .from('category_tags')
      .delete()
      .eq('id', parseInt(params.id, 10))

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
      message: 'カテゴリタグを削除しました'
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
