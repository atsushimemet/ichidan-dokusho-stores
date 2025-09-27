import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// テスト用のモックデータ
const mockCategoryTags = [
  { id: 1, name: 'coffee', display_name: 'コーヒー', is_active: true, created_at: new Date().toISOString() },
  { id: 2, name: 'wine', display_name: 'ワイン', is_active: true, created_at: new Date().toISOString() },
  { id: 3, name: 'art', display_name: 'アート', is_active: true, created_at: new Date().toISOString() },
  { id: 4, name: 'music', display_name: '音楽', is_active: true, created_at: new Date().toISOString() },
  { id: 5, name: 'vintage', display_name: 'ヴィンテージ', is_active: true, created_at: new Date().toISOString() },
  { id: 6, name: 'kids', display_name: 'キッズ', is_active: true, created_at: new Date().toISOString() },
  { id: 7, name: 'manga', display_name: '漫画', is_active: true, created_at: new Date().toISOString() },
  { id: 8, name: 'foreign', display_name: '洋書', is_active: true, created_at: new Date().toISOString() }
]

export async function GET() {
  try {
    // テスト用：モックデータを返す
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      console.log('Using mock category tags data')
      return NextResponse.json({
        success: true,
        data: { category_tags: mockCategoryTags }
      })
    }

    const { data: categoryTags, error } = await supabase
      .from('category_tags')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching category tags:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { category_tags: categoryTags }
    })
  } catch (error) {
    console.error('Unexpected error in GET /api/category-tags:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
