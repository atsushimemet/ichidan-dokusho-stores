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

    console.log('Updating area with ID:', areaId, 'Body:', body)

    // まず、エリアが存在するかチェック
    const { data: existingArea, error: fetchError } = await supabase
      .from('areas')
      .select('*')
      .eq('id', areaId)
      .single()

    if (fetchError) {
      console.error('Error fetching area:', fetchError)
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'エリアが見つかりません' }, { status: 404 })
      }
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    console.log('Existing area found:', existingArea)

    // エリア名の重複チェック（自分以外）
    if (body.name && body.name !== existingArea.name) {
      const { data: duplicateArea } = await supabase
        .from('areas')
        .select('id')
        .eq('name', body.name)
        .neq('id', areaId)
        .single()

      if (duplicateArea) {
        return NextResponse.json({ error: 'このエリア名は既に登録されています' }, { status: 400 })
      }
    }

    // エリアを更新
    console.log('Attempting to update area with:', body)
    
    const { data: areas, error, count } = await supabase
      .from('areas')
      .update(body)
      .eq('id', areaId)
      .select()

    if (error) {
      console.error('Error updating area:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Update result:', { areas, count, error })
    
    // 更新が実際に実行されたかチェック
    if (count === 0) {
      console.error('No rows were updated. This might be due to RLS or permissions.')
      return NextResponse.json({ error: 'エリアの更新に失敗しました。権限を確認してください。' }, { status: 500 })
    }

    // 更新後に必ずデータを再取得して確認
    const { data: updatedArea, error: fetchUpdatedError } = await supabase
      .from('areas')
      .select('*')
      .eq('id', areaId)
      .single()

    if (fetchUpdatedError) {
      console.error('Error fetching updated area:', fetchUpdatedError)
      return NextResponse.json({ error: 'エリアの更新に失敗しました' }, { status: 500 })
    }

    console.log('Area updated successfully (fetched separately):', updatedArea)
    
    // 更新前後のデータを比較
    console.log('Before update:', existingArea)
    console.log('After update:', updatedArea)
    
    // 実際に変更があったかチェック
    const hasChanges = Object.keys(body).some(key => 
      existingArea[key] !== updatedArea[key]
    )
    
    if (!hasChanges) {
      console.warn('No changes detected in the update')
    }

    return NextResponse.json({ 
      message: 'エリアが正常に更新されました',
      area: updatedArea 
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
