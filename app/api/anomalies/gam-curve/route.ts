import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    
    // Generate GAM curve data points
    // In production, this would come from the actual GAM model
    // For now, we'll aggregate data to approximate the curve
    
    const pipeline = [
      // Use all data, including zero leaning scores
      { $match: { leaningScore: { $exists: true, $ne: null } } },
      // Group by leaning score buckets (expanded range)
      {
        $bucket: {
          groupBy: '$leaningScore',
          boundaries: [
            -1.0, -0.5, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0
          ],
          default: 'other',
          output: {
            avgResidual: { $avg: '$residual' },
            avgGAMPrediction: { $avg: '$anomalyInVotes' }, // Use actual anomaly data
            avgAnomaly: { $avg: '$anomalyInVotes' },
            count: { $sum: 1 },
            stdDev: { $stdDevPop: '$anomalyInVotes' } // Use anomaly for std dev
          }
        }
      },
      // Calculate confidence intervals
      {
        $project: {
          leaningScore: { $add: ['$_id', 0.05] }, // Center of bucket
          residual: '$avgAnomaly', // Use avgAnomaly as residual for display
          GAMPrediction: '$avgGAMPrediction',
          count: 1,
          confidenceInterval: {
            lower: { $subtract: ['$avgGAMPrediction', { $multiply: ['$stdDev', 1.96] }] },
            upper: { $add: ['$avgGAMPrediction', { $multiply: ['$stdDev', 1.96] }] }
          }
        }
      },
      { $match: { _id: { $ne: 'other' } } },
      { $sort: { leaningScore: 1 } }
    ]

    const gamData = await db
      .collection('anomalies')
      .aggregate(pipeline)
      .toArray()

    // If no real data, generate mock GAM curve
    if (gamData.length === 0) {
      const mockData = []
      for (let i = 0; i <= 10; i++) {
        const x = i / 10
        // Simulate the curve shape from the analysis
        let y = 0
        if (x < 0.3) {
          y = -150 * (0.3 - x) // Strong negative for low leaning scores
        } else if (x > 0.7) {
          y = 20 * (x - 0.7) // Small positive for high leaning scores
        } else {
          y = -10 * Math.sin((x - 0.3) * Math.PI / 0.4) // Smooth transition
        }
        
        mockData.push({
          leaningScore: x,
          residual: y / 100,
          GAMPrediction: y,
          confidenceInterval: {
            lower: y - 15,
            upper: y + 15
          }
        })
      }
      return NextResponse.json({ data: mockData })
    }

    return NextResponse.json({ data: gamData })
  } catch (error) {
    console.error('Error fetching GAM curve data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GAM curve data' },
      { status: 500 }
    )
  }
}