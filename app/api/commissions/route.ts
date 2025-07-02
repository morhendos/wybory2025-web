import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Commission } from '@/types/election'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const voivodeship = searchParams.get('voivodeship')
    const county = searchParams.get('county')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')

    const db = await getDatabase()
    
    // Build filter
    const filter: any = {}
    if (voivodeship) filter.voivodeship = voivodeship
    if (county) filter.county = county

    const commissions = await db
      .collection<Commission>('commissions')
      .find(filter)
      .limit(limit)
      .skip(skip)
      .toArray()

    const total = await db
      .collection<Commission>('commissions')
      .countDocuments(filter)

    return NextResponse.json({
      data: commissions,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching commissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch commissions' },
      { status: 500 }
    )
  }
}