import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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
