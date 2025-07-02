'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ExplorePage() {
  const [selectedVoivodeship, setSelectedVoivodeship] = useState('')
  const [selectedCounty, setSelectedCounty] = useState('')
  const [minAnomaly, setMinAnomaly] = useState(0)

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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  max="100"
                  value={minAnomaly}
                  onChange={(e) => setMinAnomaly(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  {minAnomaly} głosów
                </div>
              </div>

              <button className="btn-primary w-full">
                Zastosuj filtry
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mapa anomalii
            </h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">
                Interaktywna mapa będzie dostępna wkrótce
              </p>
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Największe anomalie
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Komisja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Województwo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anomalia (głosy)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Przechylenie
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900" colSpan={4}>
                      Ładowanie danych...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}