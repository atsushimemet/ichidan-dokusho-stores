import { getCurrentAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者認証チェック
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { id } = params

    // IDを数値に変換
    const categoryId = parseInt(id, 10)
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      console.error('Error fetching category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/categories/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者認証チェック
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // IDを数値に変換
    const categoryId = parseInt(id, 10)
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    // カテゴリ名の重複チェック（自分以外）
    if (body.name) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', body.name)
        .neq('id', categoryId)
        .single()

      if (existingCategory) {
        return NextResponse.json({ error: 'このカテゴリ名は既に登録されています' }, { status: 400 })
      }
    }

    // カテゴリを更新
    const { data: category, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'カテゴリが正常に更新されました',
      category 
    })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/categories/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者認証チェック
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { id } = params

    // IDを数値に変換
    const categoryId = parseInt(id, 10)
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    // このカテゴリを使用している書店があるかチェック
    const { data: storesUsingCategory } = await supabase
      .from('stores')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1)

    if (storesUsingCategory && storesUsingCategory.length > 0) {
      return NextResponse.json({ 
        error: 'このカテゴリを使用している書店があるため削除できません' 
      }, { status: 400 })
    }

    // カテゴリを削除
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'カテゴリが正常に削除されました' })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/categories/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
