'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Czy wyniki wyborów 2025 były anomalne?
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Zaawansowana analiza statystyczna ujawniła nieoczekiwane wzorce w wynikach wyborów.
          Poznaj metodologię, zbadaj dane i wyciągnij własne wnioski.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mt-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🔍 Co odkryliśmy?
            </h2>
            <p className="text-gray-600 mb-4">
              Analiza wykazała statystycznie istotne anomalie w około 460,000 głosów.
              Niewyjaśnione straty głosów występowały głównie w komisjach o określonym profilu politycznym.
            </p>
            <Link href="/findings" className="text-primary-600 hover:text-primary-700 font-medium">
              Zobacz szczegółowe wyniki →
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card h-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Jak to zbadaliśmy?
            </h2>
            <p className="text-gray-600 mb-4">
              Wykorzystaliśmy dwuetapową analizę: regresję z efektami stałymi oraz
              uogólnione modele addytywne (GAM). Metoda pozwala wyizolować niewyjaśnione anomalie.
            </p>
            <Link href="/methodology" className="text-primary-600 hover:text-primary-700 font-medium">
              Poznaj metodologię →
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="card inline-block">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🚀 Zacznij eksplorację
          </h3>
          <p className="text-gray-600 mb-4">
            Przeglądaj dane według regionów, typów komisji i innych kryteriów
          </p>
          <Link href="/explore" className="btn-primary inline-block">
            Eksploruj dane
          </Link>
        </div>
      </motion.div>

      <div className="mt-20 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">
          ⚠️ Ważne zastrzeżenie
        </h3>
        <p className="text-yellow-800">
          Ta analiza identyfikuje anomalie statystyczne. Nie jest dowodem na nieprawidłowości,
          ale wskazuje obszary wymagające dalszego zbadania. Zachęcamy do krytycznej analizy
          przedstawionych danych i metodologii.
        </p>
      </div>
    </div>
  )
}