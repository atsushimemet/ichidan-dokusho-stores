import { getCurrentAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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

    // カテゴリを更新
    const { data: category, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
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

    // このカテゴリを使用している書店があるかチェック
    const { data: storesUsingCategory } = await supabase
      .from('stores')
      .select('id')
      .eq('category', id)
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
      .eq('id', id)

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
