import { MongoClient } from 'mongodb'
import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'

// Define the structure of the anomaly CSV
interface AnomalyRow {
  'Województwo': string
  'Powiat': string
  'Gmina': string
  'Nr komisji': string
  'residual': string
  'anomalia_w_glosach': string
  'leaning_score': string
  'GAM_prediction': string
  'confidence_lower': string
  'confidence_upper': string
}

async function importAnomalies() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wybory2025'
  const ANOMALY_CSV_PATH = process.env.ANOMALY_CSV_PATH || '../wybory2025/anomalie_rt_uszeregowane.csv'

  console.log('🔍 Starting anomaly data import...')
  console.log(`MongoDB URI: ${MONGODB_URI}`)
  console.log(`Anomaly CSV Path: ${ANOMALY_CSV_PATH}`)

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('wybory2025')
    
    // Clear existing anomalies
    console.log('🗑️  Clearing existing anomaly data...')
    await db.collection('anomalies').deleteMany({})

    // Check if file exists
    if (!fs.existsSync(ANOMALY_CSV_PATH)) {
      console.log('⚠️  Anomaly file not found, generating mock data for development...')
      await generateMockAnomalies(db)
      await client.close()
      return
    }

    // Read and parse CSV
    console.log('📄 Reading anomaly CSV file...')
    const csvContent = fs.readFileSync(path.resolve(ANOMALY_CSV_PATH), 'utf8')
    
    const { data, errors } = Papa.parse<AnomalyRow>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    })

    if (errors.length > 0) {
      console.error('⚠️  CSV parsing errors:', errors)
    }

    console.log(`📊 Parsed ${data.length} anomaly records`)

    // Process and insert anomalies
    const anomalies = []
    for (const row of data) {
      const anomaly = {
        commissionId: `${row['Województwo']}_${row['Powiat']}_${row['Gmina']}_${row['Nr komisji']}`,
        residual: parseFloat(row['residual'] || '0'),
        anomalyInVotes: parseFloat(row['anomalia_w_glosach'] || '0'),
        GAMPrediction: parseFloat(row['GAM_prediction'] || '0'),
        leaningScore: parseFloat(row['leaning_score'] || '0'),
        confidenceInterval: {
          lower: parseFloat(row['confidence_lower'] || '0'),
          upper: parseFloat(row['confidence_upper'] || '0')
        },
        metadata: {
          voivodeship: row['Województwo'],
          county: row['Powiat'],
          commune: row['Gmina'],
          commissionNumber: parseInt(row['Nr komisji'])
        }
      }
      anomalies.push(anomaly)
    }

    // Insert in batches
    const BATCH_SIZE = 1000
    for (let i = 0; i < anomalies.length; i += BATCH_SIZE) {
      const batch = anomalies.slice(i, i + BATCH_SIZE)
      console.log(`📦 Inserting batch ${Math.floor(i / BATCH_SIZE) + 1}...`)
      await db.collection('anomalies').insertMany(batch)
    }

    // Create indexes
    console.log('🔑 Creating indexes...')
    await db.collection('anomalies').createIndex({ anomalyInVotes: -1 })
    await db.collection('anomalies').createIndex({ leaningScore: 1 })
    await db.collection('anomalies').createIndex({ 'metadata.voivodeship': 1 })

    // Calculate and show summary
    const summary = await db.collection('anomalies').aggregate([
      {
        $group: {
          _id: null,
          totalEffect: { $sum: '$anomalyInVotes' },
          avgAnomaly: { $avg: '$anomalyInVotes' },
          minAnomaly: { $min: '$anomalyInVotes' },
          maxAnomaly: { $max: '$anomalyInVotes' },
          count: { $sum: 1 }
        }
      }
    ]).toArray()

    console.log('\n✅ Anomaly import completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - Total anomalies: ${summary[0].count}`)
    console.log(`  - Total effect: ${Math.round(summary[0].totalEffect).toLocaleString()} votes`)
    console.log(`  - Average anomaly: ${Math.round(summary[0].avgAnomaly)} votes`)
    console.log(`  - Largest single anomaly: ${Math.round(summary[0].minAnomaly)} votes`)

    await client.close()
  } catch (error) {
    console.error('❌ Error during anomaly import:', error)
    process.exit(1)
  }
}

// Generate mock anomalies for development
async function generateMockAnomalies(db: any) {
  console.log('🎲 Generating mock anomaly data...')
  
  const commissions = await db.collection('commissions').find().limit(1000).toArray()
  const mockAnomalies = []
  
  for (const commission of commissions) {
    // Create realistic-looking anomaly pattern
    const leaningScore = commission.leaningScore || 0.5
    
    // Simulate the GAM curve shape from the analysis
    let baseAnomaly = 0
    if (leaningScore < 0.3) {
      baseAnomaly = -50 * (0.3 - leaningScore) // Negative anomalies for low leaning scores
    } else if (leaningScore > 0.7) {
      baseAnomaly = 10 * (leaningScore - 0.7) // Small positive for high leaning scores
    }
    
    // Add some random variation
    const randomFactor = (Math.random() - 0.5) * 20
    const anomalyInVotes = Math.round(baseAnomaly + randomFactor)
    
    mockAnomalies.push({
      commissionId: `${commission.voivodeship}_${commission.county}_${commission.commune}_${commission.commissionNumber}`,
      residual: anomalyInVotes / 100,
      anomalyInVotes,
      GAMPrediction: baseAnomaly,
      leaningScore,
      confidenceInterval: {
        lower: anomalyInVotes - 10,
        upper: anomalyInVotes + 10
      },
      metadata: {
        voivodeship: commission.voivodeship,
        county: commission.county,
        commune: commission.commune,
        commissionNumber: commission.commissionNumber
      }
    })
  }
  
  // Insert mock data
  await db.collection('anomalies').insertMany(mockAnomalies)
  console.log(`✅ Generated ${mockAnomalies.length} mock anomalies`)
  
  // Create a few extreme cases to make it interesting
  const extremeCases = [
    { ...mockAnomalies[0], anomalyInVotes: -450, metadata: { ...mockAnomalies[0].metadata, voivodeship: 'Mazowieckie' } },
    { ...mockAnomalies[1], anomalyInVotes: -380, metadata: { ...mockAnomalies[1].metadata, voivodeship: 'Małopolskie' } },
    { ...mockAnomalies[2], anomalyInVotes: -320, metadata: { ...mockAnomalies[2].metadata, voivodeship: 'Wielkopolskie' } },
  ]
  await db.collection('anomalies').insertMany(extremeCases)
}

// Run the import
importAnomalies()