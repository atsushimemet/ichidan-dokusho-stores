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

    // エリアを更新
    const { data: area, error } = await supabase
      .from('areas')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating area:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'エリアが正常に更新されました',
      area 
    })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/admin/areas/[id]:', error)
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

    // このエリアを使用している書店があるかチェック
    const { data: storesUsingArea } = await supabase
      .from('stores')
      .select('id')
      .eq('area', id)
      .limit(1)

    if (storesUsingArea && storesUsingArea.length > 0) {
      return NextResponse.json({ 
        error: 'このエリアを使用している書店があるため削除できません' 
      }, { status: 400 })
    }

    // エリアを削除
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting area:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'エリアが正常に削除されました' })
  } catch (error) {
    console.error('Unexpected error in DELETE /api/admin/areas/[id]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
