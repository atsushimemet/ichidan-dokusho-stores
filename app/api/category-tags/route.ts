import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
