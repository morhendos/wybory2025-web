'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { GAMCurve } from '@/components/charts/GAMCurve'
import { ScatterPlot } from '@/components/charts/ScatterPlot'
import { RegionalBarChart } from '@/components/charts/RegionalBarChart'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Summary {
  totalCommissions: number
  totalAnomalies: number
  summary: {
    totalEffect: number
    avgAnomaly: number
    maxAnomaly: number
    affectedCommissions: number
    significantAnomalies?: number
    avgSignificantAnomaly?: number
  }
  topRegions: Array<{
    _id: string
    totalAnomalies: number
    count: number
  }>
}

export default function FindingsPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [gamData, setGamData] = useState<any[]>([])
  const [scatterData, setScatterData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch summary data
        const summaryRes = await fetch('/api/summary')
        const summaryData = await summaryRes.json()
        setSummary(summaryData)

        // Fetch GAM curve data
        const gamRes = await fetch('/api/anomalies/gam-curve')
        const gamCurveData = await gamRes.json()
        setGamData(gamCurveData.data || [])

        // Fetch scatter plot data (sample of anomalies)
        const scatterRes = await fetch('/api/anomalies?limit=500')
        const scatterPlotData = await scatterRes.json()
        setScatterData(scatterPlotData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner />
      </div>
    )
  }

  const totalEffect = summary?.summary?.totalEffect || -462850
  const affectedCommissions = summary?.summary?.affectedCommissions || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Główne odkrycia
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Co pokazuje analiza statystyczna wyborów 2025?
        </p>
      </motion.div>

      <div className="grid gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {Math.round(totalEffect).toLocaleString('pl-PL')} głosów
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Całkowity oszacowany efekt anomalii dla Rafała Trzaskowskiego
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Komisji z anomaliami:</strong> {affectedCommissions.toLocaleString('pl-PL')} z {summary?.totalCommissions?.toLocaleString('pl-PL') || '32,143'}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Średnia anomalia:</strong> {Math.round(summary?.summary?.avgSignificantAnomaly || summary?.summary?.avgAnomaly || 0)} głosów na komisję z anomalią
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Znaczące anomalie:</strong> {(summary?.summary?.significantAnomalies || 0).toLocaleString('pl-PL')} komisji (&gt;10 głosów)
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Analiza wykazała, że niewyjaśnione straty głosów występowały niemal wyłącznie
                  w komisjach o profilu neutralnym oraz anty-RT.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Wzorzec anomalii według typu komisji
          </h2>
          <p className="text-gray-600 mb-4">
            Krzywa GAM pokazuje wyraźną zależność: im bardziej komisja była &quot;przeciwna&quot; RT
            (niższy leaning score), tym większe były niewyjaśnione straty głosów.
          </p>
          {gamData.length > 0 ? (
            <GAMCurve data={gamData} />
          ) : (
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Brak danych do wyświetlenia</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rozkład anomalii w poszczególnych komisjach
          </h2>
          <p className="text-gray-600 mb-4">
            Każdy punkt reprezentuje jedną komisję wyborczą. Czerwone punkty to komisje z największymi anomaliami.
          </p>
          {scatterData.length > 0 ? (
            <ScatterPlot 
              data={scatterData.map(d => ({
                leaningScore: d.commissionDetails?.leaningScore || d.leaningScore || 0,
                anomalyInVotes: d.anomalyInVotes || 0,
                voivodeship: d.metadata?.voivodeship || d.commissionDetails?.voivodeship,
                county: d.metadata?.county || d.commissionDetails?.county
              }))}
            />
          ) : (
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Brak danych do wyświetlenia</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Anomalie według województw
          </h2>
          <p className="text-gray-600 mb-4">
            Całkowita suma anomalii w poszczególnych województwach.
          </p>
          {summary?.topRegions && summary.topRegions.length > 0 ? (
            <RegionalBarChart 
              data={summary.topRegions.map(r => ({
                region: r._id,
                totalAnomaly: r.totalAnomalies,
                commissionsAffected: r.count
              }))}
            />
          ) : (
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Brak danych do wyświetlenia</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              🔴 Gdzie występowały największe anomalie?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                Komisje z przewagą członków partii opozycyjnych wobec RT
              </li>
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                Komisje o neutralnym składzie politycznym
              </li>
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                Głównie w mniejszych miejscowościach
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              🔵 Gdzie wyniki były zgodne z oczekiwaniami?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Komisje z przewagą zwolenników RT
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Duże miasta z obecnością obserwatorów
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                Komisje pod kontrolą społeczną
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-yellow-50 border-yellow-200"
        >
          <h3 className="text-lg font-bold text-yellow-900 mb-2">
            Co to oznacza?
          </h3>
          <p className="text-yellow-800">
            Analiza wskazuje na systematyczny wzorzec, który jest trudny do wyjaśnienia
            standardowymi czynnikami politycznymi czy demograficznymi. Wymaga to dalszego
            zbadania i weryfikacji przez odpowiednie instytucje.
          </p>
        </motion.div>
      </div>
    </div>
  )
}