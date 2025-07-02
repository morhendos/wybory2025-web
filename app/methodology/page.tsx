'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export default function MethodologyPage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "Dane wejściowe",
      description: "Oficjalne wyniki z obu tur wyborów dla każdej komisji wyborczej",
      details: "Analizujemy wyniki z ponad 27,000 komisji wyborczych, uwzględniając wyniki I i II tury, frekwencję, typ obszaru (miasto/wieś) oraz skład komisji."
    },
    {
      title: "Etap 1: Model regresji",
      description: "Przewidujemy oczekiwany wynik na podstawie znanych czynników",
      details: "Używamy regresji z efektami stałymi na poziomie powiatu. Model uwzględnia: wynik z I tury, zmianę frekwencji, typ obszaru. To pozwala nam wyizolować 'niewyjaśnioną' część wyniku."
    },
    {
      title: "Etap 2: Analiza anomalii",
      description: "Badamy czy niewyjaśnione odchylenia zależą od składu komisji",
      details: "Używamy modeli GAM do zbadania nieliniowych zależności. Jeśli skład komisji nie ma wpływu, nie powinniśmy widzieć żadnego wzorca w residuach."
    },
    {
      title: "Walidacja",
      description: "Sprawdzamy istotność statystyczną przez bootstrap",
      details: "Powtarzamy analizę 1999 razy na losowo zmodyfikowanych danych. To pozwala oszacować przedziały ufności i upewnić się, że wyniki nie są dziełem przypadku."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Metodologia analizy
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Jak dokładnie przeprowadziliśmy analizę? Przedstawiamy krok po kroku.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Proces analizy
          </h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all ${
                    activeStep === index
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      activeStep === index ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {steps[activeStep].title}
            </h3>
            <p className="text-gray-600 mb-6">
              {steps[activeStep].details}
            </p>
            
            {activeStep === 1 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Wzór modelu:</h4>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  Głosy_RT_r2 = β₀ + β₁(Głosy_RT_r1) + β₂(Zmiana_frekwencji) + β₃(Typ_obszaru) + Efekt_powiatu + ε
                </code>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Model GAM:</h4>
                <p className="text-sm text-gray-600">
                  Używamy elastycznych funkcji (splajnów) do modelowania zależności:
                </p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-2">
                  Residua = f(leaning_score) + ε
                </code>
                <p className="text-sm text-gray-600 mt-2">
                  gdzie f() to nieliniowa funkcja szacowana z danych
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Dlaczego ta metoda?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">✅ Kontrola zmiennych</h3>
            <p className="text-gray-600">
              Model uwzględnia wszystkie oczywiste czynniki wpływające na wynik, izolując tylko to, co niewyjaśnione.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">✅ Elastyczność</h3>
            <p className="text-gray-600">
              GAM nie zakłada z góry kształtu zależności - model sam "odkrywa" wzorce w danych.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">✅ Rygorystyczna walidacja</h3>
            <p className="text-gray-600">
              Bootstrap zapewnia, że wyniki są statystycznie istotne i nie są dziełem przypadku.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}