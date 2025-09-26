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

    console.log('Updating category with ID:', categoryId, 'Body:', body)

    // まず、カテゴリが存在するかチェック
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (fetchError) {
      console.error('Error fetching category:', fetchError)
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'カテゴリが見つかりません' }, { status: 404 })
      }
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log('Existing category found:', existingCategory)

    // カテゴリ名の重複チェック（自分以外）
    if (body.name && body.name !== existingCategory.name) {
      const { data: duplicateCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', body.name)
        .neq('id', categoryId)
        .single()

      if (duplicateCategory) {
        return NextResponse.json({ error: 'このカテゴリ名は既に登録されています' }, { status: 400 })
      }
    }

    // カテゴリを更新
    const { data: categories, error, count } = await supabase
      .from('categories')
      .update(body)
      .eq('id', categoryId)
      .select()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Update result:', { categories, count, error })

    // 更新後に必ずデータを再取得して確認
    const { data: updatedCategory, error: fetchUpdatedError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (fetchUpdatedError) {
      console.error('Error fetching updated category:', fetchUpdatedError)
      return NextResponse.json({ error: 'カテゴリの更新に失敗しました' }, { status: 500 })
    }

    console.log('Category updated successfully (fetched separately):', updatedCategory)
    
    // 更新前後のデータを比較
    console.log('Before update:', existingCategory)
    console.log('After update:', updatedCategory)
    
    // 実際に変更があったかチェック
    const hasChanges = Object.keys(body).some(key => 
      existingCategory[key] !== updatedCategory[key]
    )
    
    if (!hasChanges) {
      console.warn('No changes detected in the update')
    }

    return NextResponse.json({ 
      message: 'カテゴリが正常に更新されました',
      category: updatedCategory 
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
