import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// テスト用のモックデータ
const mockAreas = [
  { id: 1, name: '東京', prefecture: '東京都', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: '大阪', prefecture: '大阪府', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: 3, name: '京都', prefecture: '京都府', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: 4, name: '横浜', prefecture: '神奈川県', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
  { id: 5, name: '名古屋', prefecture: '愛知県', sort_order: 5, is_active: true, created_at: new Date().toISOString() }
]

export async function GET() {
  try {
    // テスト用：モックデータを返す
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('Using mock areas data')
      return NextResponse.json({
        success: true,
        data: { areas: mockAreas }
      })
    }

    const { data: areas, error } = await supabase
      .from('areas')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching areas:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { areas }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/areas:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
