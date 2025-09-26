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
    const areaId = parseInt(id, 10)
    if (isNaN(areaId)) {
      return NextResponse.json({ error: 'Invalid area ID' }, { status: 400 })
    }

    const { data: area, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', areaId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Area not found' }, { status: 404 })
      }
      console.error('Error fetching area:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(area)
  } catch (error) {
    console.error('Unexpected error in GET /api/admin/areas/[id]:', error)
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
    const areaId = parseInt(id, 10)
    if (isNaN(areaId)) {
      return NextResponse.json({ error: 'Invalid area ID' }, { status: 400 })
    }

    // エリア名の重複チェック（自分以外）
    if (body.name) {
      const { data: existingArea } = await supabase
        .from('areas')
        .select('id')
        .eq('name', body.name)
        .neq('id', areaId)
        .single()

      if (existingArea) {
        return NextResponse.json({ error: 'このエリア名は既に登録されています' }, { status: 400 })
      }
    }

    // エリアを更新
    const { data: area, error } = await supabase
      .from('areas')
      .update(body)
      .eq('id', areaId)
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

    // IDを数値に変換
    const areaId = parseInt(id, 10)
    if (isNaN(areaId)) {
      return NextResponse.json({ error: 'Invalid area ID' }, { status: 400 })
    }

    // このエリアを使用している書店があるかチェック
    const { data: storesUsingArea } = await supabase
      .from('stores')
      .select('id')
      .eq('area_id', areaId)
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
      .eq('id', areaId)

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
