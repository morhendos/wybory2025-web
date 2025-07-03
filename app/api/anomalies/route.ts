import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { Anomaly } from '@/types/election'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const voivodeship = searchParams.get('voivodeship')
    const minAnomaly = parseFloat(searchParams.get('minAnomaly') || '0')
    const sortBy = searchParams.get('sortBy') || 'anomalyInVotes'
    const order = searchParams.get('order') === 'asc' ? 1 : -1
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')
    const excludeOverseas = searchParams.get('excludeOverseas') === 'true'

    const db = await getDatabase()
    
    // Build aggregation pipeline
    const pipeline: any[] = [
      // Join with commissions collection using metadata fields
      {
        $lookup: {
          from: 'commissions',
          let: { 
            voivodeship: '$metadata.voivodeship', 
            county: '$metadata.county',
            commune: '$metadata.commune',
            commissionNumber: '$metadata.commissionNumber'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$voivodeship', '$$voivodeship'] },
                    { $eq: ['$county', '$$county'] },
                    { $eq: ['$commune', '$$commune'] },
                    { $eq: ['$commissionNumber', '$$commissionNumber'] }
                  ]
                }
              }
            }
          ],
          as: 'commissionDetails'
        }
      },
      { $unwind: { path: '$commissionDetails', preserveNullAndEmptyArrays: true } },
      // Filter
      {
        $match: {
          ...(voivodeship && { 'metadata.voivodeship': voivodeship }),
          ...(excludeOverseas && { 'metadata.voivodeship': { $ne: null, $exists: true } }),
          anomalyInVotes: { $lte: -minAnomaly }
        }
      },
      // Sort
      { $sort: { [sortBy]: order } },
      // Pagination
      { $skip: skip },
      { $limit: limit }
    ]

    const anomalies = await db
      .collection<Anomaly>('anomalies')
      .aggregate(pipeline)
      .toArray()

    // Get total count
    const countPipeline = pipeline.slice(0, 2) // Only lookup and match stages
    countPipeline.push({ $count: 'total' })
    const countResult = await db
      .collection<Anomaly>('anomalies')
      .aggregate(countPipeline)
      .toArray()
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      data: anomalies,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anomalies' },
      { status: 500 }
    )
  }
}