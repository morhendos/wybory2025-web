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
            affectedCommissions: { 
              $sum: { 
                $cond: [{ $ne: ['$anomalyInVotes', 0] }, 1, 0] 
              } 
            },
            significantAnomalies: {
              $sum: { 
                $cond: [{ $or: [{ $lt: ['$anomalyInVotes', -10] }, { $gt: ['$anomalyInVotes', 10] }] }, 1, 0] 
              } 
            },
            avgSignificantAnomaly: {
              $avg: {
                $cond: [
                  { $ne: ['$anomalyInVotes', 0] },
                  '$anomalyInVotes',
                  null
                ]
              }
            }
          }
        }
      ]).toArray()
    ])

    // Get anomalies by voivodeship using metadata
    const anomaliesByRegion = await db.collection('anomalies').aggregate([
      {
        $match: {
          'metadata.voivodeship': { $ne: null, $exists: true }
        }
      },
      {
        $group: {
          _id: '$metadata.voivodeship',
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
        affectedCommissions: 0,
        significantAnomalies: 0,
        avgSignificantAnomaly: 0
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