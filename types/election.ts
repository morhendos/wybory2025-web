export interface Commission {
  _id?: string
  voivodeship: string
  county: string
  commune: string
  commissionNumber: number
  areaType: 'miasto' | 'wieś'
  location?: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  leaningScore: number
  voters: {
    round1: number
    round2: number
  }
}

export interface ElectionResult {
  _id?: string
  commissionId: string
  round: 1 | 2
  validVotes: number
  candidates: {
    trzaskowski?: number
    nawrocki?: number
    [key: string]: number | undefined
  }
  turnout: number
}

export interface Anomaly {
  _id?: string
  commissionId: string
  commissionDetails?: Commission
  resultDetails?: ElectionResult
  residual: number
  expectedVotes: number
  actualVotes: number
  anomalyInVotes: number
  GAMPrediction: number
  confidenceInterval: {
    lower: number
    upper: number
  }
}

export interface AggregatedAnomaly {
  _id: string // voivodeship or county
  totalAnomalies: number
  averageAnomaly: number
  commissionsAffected: number
  totalVotesLost: number
}

export interface FilterParams {
  voivodeship?: string
  county?: string
  minAnomaly?: number
  maxAnomaly?: number
  areaType?: 'miasto' | 'wieś'
  leaningScoreMin?: number
  leaningScoreMax?: number
}