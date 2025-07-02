'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function ExplorePage() {
  const [selectedVoivodeship, setSelectedVoivodeship] = useState('')
  const [minAnomaly, setMinAnomaly] = useState(50)
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<any>(null)

  // Placeholder - will be replaced with actual data from MongoDB
  const voivodeships = [
    'Dolnośląskie',
    'Kujawsko-Pomorskie',
    'Lubelskie',
    'Lubuskie',
    'Łódzkie',
    'Małopolskie',
    'Mazowieckie',
    'Opolskie',
    'Podkarpackie',
    'Podlaskie',
    'Pomorskie',
    'Śląskie',
    'Świętokrzyskie',
    'Warmińsko-Mazurskie',
    'Wielkopolskie',
    'Zachodniopomorskie'
  ]

  // Fetch summary on mount
  useEffect(() => {
    fetch('/api/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(console.error)
  }, [])

  // Fetch anomalies when filters change
  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          ...(selectedVoivodeship && { voivodeship: selectedVoivodeship }),
          minAnomaly: minAnomaly.toString(),
          limit: '100',
          sortBy: 'anomalyInVotes',
          order: 'asc'
        })
        
        const response = await fetch(`/api/anomalies?${params}`)
        const data = await response.json()
        setAnomalies(data.data || [])
      } catch (error) {
        console.error('Error fetching anomalies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalies()
  }, [selectedVoivodeship, minAnomaly])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Eksploruj dane
        </h1>
        <p className="text-xl text-gray-600">
          Przeglądaj anomalie według regionów i typów komisji
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtry</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Województwo
                </label>
                <select
                  value={selectedVoivodeship}
                  onChange={(e) => setSelectedVoivodeship(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2 border"
                >
                  <option value="">Wszystkie</option>
                  {voivodeships.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimalna anomalia (głosy)
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={minAnomaly}
                  onChange={(e) => setMinAnomaly(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  Co najmniej {minAnomaly} głosów
                </div>
              </div>
            </div>
          </div>

          {summary && (
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Podsumowanie
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Całkowity efekt:</span>
                  <p className="font-semibold">
                    {Math.round(summary.summary?.totalEffect || 0).toLocaleString('pl-PL')} głosów
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Dotkniętych komisji:</span>
                  <p className="font-semibold">
                    {(summary.summary?.affectedCommissions || 0).toLocaleString('pl-PL')}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Średnia anomalia:</span>
                  <p className="font-semibold">
                    {Math.round(summary.summary?.avgAnomaly || 0)} głosów
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Największe anomalie
              {selectedVoivodeship && ` - ${selectedVoivodeship}`}
            </h2>
            
            {loading ? (
              <LoadingSpinner />
            ) : anomalies.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Brak anomalii spełniających kryteria
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lokalizacja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nr komisji
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anomalia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leaning Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pewność
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {anomalies.map((anomaly, index) => {
                      const metadata = anomaly.metadata || anomaly.commissionDetails || {}
                      const isHighConfidence = Math.abs(
                        anomaly.confidenceInterval?.lower || 0
                      ) > Math.abs(anomaly.anomalyInVotes) * 0.8
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">
                                {metadata.voivodeship || 'Nieznane'}
                              </div>
                              <div className="text-gray-500">
                                {metadata.county || ''} / {metadata.commune || ''}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {metadata.commissionNumber || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-semibold ${
                              anomaly.anomalyInVotes < 0 ? 'text-danger-600' : 'text-primary-600'
                            }`}>
                              {Math.round(anomaly.anomalyInVotes).toLocaleString('pl-PL')} głosów
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(anomaly.leaningScore || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isHighConfidence
                                ? 'bg-danger-100 text-danger-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {isHighConfidence ? 'Wysoka' : 'Średnia'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Interpretacja
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Anomalie to różnice między rzeczywistymi wynikami a przewidywaniami modelu
                opartego na wynikach z I tury i innych czynnikach.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <span className="text-danger-600 font-semibold">Ujemne anomalie</span> = mniej głosów niż oczekiwano</li>
                <li>• <span className="text-primary-600 font-semibold">Dodatnie anomalie</span> = więcej głosów niż oczekiwano</li>
                <li>• <span className="font-semibold">Leaning Score</span> = skład polityczny komisji (0-1)</li>
              </ul>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Eksport danych
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Możesz pobrać pełne dane do własnej analizy.
              </p>
              <button 
                className="btn-secondary w-full text-sm"
                onClick={() => alert('Funkcja eksportu będzie dostępna wkrótce')}
              >
                Pobierz jako CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}