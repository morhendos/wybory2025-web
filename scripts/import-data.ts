import { MongoClient } from 'mongodb'
import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'

// Define the expected CSV structure
interface CSVRow {
  'Województwo': string
  'Powiat': string
  'Gmina': string
  'Nr komisji': string
  'Typ obszaru': string
  'Liczba kart ważnych_r1': string
  'Liczba kart ważnych_r2': string
  'TRZASKOWSKI Rafał Kazimierz_r1': string
  'TRZASKOWSKI Rafał Kazimierz_r2': string
  'NAWROCKI Karol Tadeusz_r2': string
  'leaning_score': string
  // Add other fields as needed
}

async function importData() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wybory2025'
  const CSV_PATH = process.env.CSV_PATH || '../wybory2025/dane/przeliczone.csv'

  console.log('🚀 Starting data import...')
  console.log(`MongoDB URI: ${MONGODB_URI}`)
  console.log(`CSV Path: ${CSV_PATH}`)

  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('wybory2025')
    
    // Clear existing collections
    console.log('🗑️  Clearing existing data...')
    await db.collection('commissions').deleteMany({})
    await db.collection('results').deleteMany({})
    await db.collection('anomalies').deleteMany({})

    // Read and parse CSV
    console.log('📄 Reading CSV file...')
    const csvContent = fs.readFileSync(path.resolve(CSV_PATH), 'utf8')
    
    const { data, errors } = Papa.parse<CSVRow>(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      delimitersToGuess: [',', '\t', '|', ';']
    })

    if (errors.length > 0) {
      console.error('⚠️  CSV parsing errors:', errors)
    }

    console.log(`📊 Parsed ${data.length} rows`)

    // Process data in batches
    const BATCH_SIZE = 1000
    const commissions = []
    const results = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      // Create commission document
      const commission = {
        voivodeship: row['Województwo'],
        county: row['Powiat'],
        commune: row['Gmina'],
        commissionNumber: parseInt(row['Nr komisji']),
        areaType: row['Typ obszaru'] as 'miasto' | 'wieś',
        leaningScore: parseFloat(row['leaning_score']),
        voters: {
          round1: parseInt(row['Liczba kart ważnych_r1']),
          round2: parseInt(row['Liczba kart ważnych_r2'])
        }
      }
      commissions.push(commission)

      // Create result documents for round 2
      const resultR2 = {
        commissionId: `${row['Województwo']}_${row['Powiat']}_${row['Gmina']}_${row['Nr komisji']}`,
        round: 2 as const,
        validVotes: parseInt(row['Liczba kart ważnych_r2']),
        candidates: {
          trzaskowski: parseInt(row['TRZASKOWSKI Rafał Kazimierz_r2']),
          nawrocki: parseInt(row['NAWROCKI Karol Tadeusz_r2'])
        },
        turnout: parseInt(row['Liczba kart ważnych_r2']) // Will need to calculate properly
      }
      results.push(resultR2)

      // Insert in batches
      if (commissions.length >= BATCH_SIZE) {
        console.log(`📦 Inserting batch ${Math.floor(i / BATCH_SIZE) + 1}...`)
        await db.collection('commissions').insertMany(commissions)
        await db.collection('results').insertMany(results)
        commissions.length = 0
        results.length = 0
      }
    }

    // Insert remaining documents
    if (commissions.length > 0) {
      console.log('📦 Inserting final batch...')
      await db.collection('commissions').insertMany(commissions)
      await db.collection('results').insertMany(results)
    }

    // Create indexes
    console.log('🗝️  Creating indexes...')
    await db.collection('commissions').createIndex({ voivodeship: 1, county: 1 })
    await db.collection('commissions').createIndex({ leaningScore: 1 })
    await db.collection('results').createIndex({ commissionId: 1, round: 1 })
    await db.collection('anomalies').createIndex({ anomalyInVotes: -1 })

    console.log('✅ Data import completed successfully!')
    
    // Show summary
    const commissionCount = await db.collection('commissions').countDocuments()
    const resultCount = await db.collection('results').countDocuments()
    console.log(`\n📋 Summary:`)
    console.log(`  - Commissions: ${commissionCount}`)
    console.log(`  - Results: ${resultCount}`)

    await client.close()
  } catch (error) {
    console.error('❌ Error during import:', error)
    process.exit(1)
  }
}

// Run the import
importData()