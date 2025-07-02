'use client'

import { motion } from 'framer-motion'

export default function FindingsPage() {
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
                -462,850 głosów
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Całkowity oszacowany efekt anomalii dla Rafała Trzaskowskiego
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Przedział ufności (95%):</strong> od -520,000 do -405,000 głosów
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
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-4">
            <p className="text-gray-500">Wykres GAM - wkrótce</p>
          </div>
          <p className="text-gray-600">
            Krzywa GAM pokazuje wyraźną zależność: im bardziej komisja była "przeciwna" RT
            (niższy leaning score), tym większe były niewyjaśnione straty głosów.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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