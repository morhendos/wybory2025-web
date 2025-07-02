import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    
    // Get summary statistics
    const [totalCommissions, totalAnomalies, anomalySummary] = await Promise.all([
      db.collection('commissions').countDocuments(),
      db.collection('anomalies').countDocuments(),
      db.collection('anomalies').aggregate([
        {
          $group: {
            _id: null,
            totalEffect: { $sum: '$anomalyInVotes' },
            avgAnomaly: { $avg: '$anomalyInVotes' },
            maxAnomaly: { $min: '$anomalyInVotes' }, // Min because negative values
            affectedCommissions: { $sum: 1 }
          }
        }
      ]).toArray()
    ])

    // Get anomalies by voivodeship
    const anomaliesByRegion = await db.collection('anomalies').aggregate([
      {
        $lookup: {
          from: 'commissions',
          localField: 'commissionId',
          foreignField: '_id',
          as: 'commission'
        }
      },
      { $unwind: '$commission' },
      {
        $group: {
          _id: '$commission.voivodeship',
          totalAnomalies: { $sum: '$anomalyInVotes' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAnomalies: 1 } },
      { $limit: 10 }
    ]).toArray()

    return NextResponse.json({
      totalCommissions,
      totalAnomalies,
      summary: anomalySummary[0] || {
        totalEffect: 0,
        avgAnomaly: 0,
        maxAnomaly: 0,
        affectedCommissions: 0
      },
      topRegions: anomaliesByRegion
    })
  } catch (error) {
    console.error('Error fetching summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
}