'use client'

import { motion } from 'framer-motion'

export default function TechnicalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Szczegóły techniczne
        </h1>
        <p className="text-xl text-gray-600">
          Pełna dokumentacja metodologii i implementacji
        </p>
      </motion.div>

      <div className="space-y-8">
        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Model regresji (Etap 1)
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              W pierwszym etapie używamy modelu PanelOLS z biblioteki linearmodels:
            </p>
            <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm">{`import linearmodels.panel as plm

model = plm.PanelOLS(
    dependent=wyniki_rt_r2,
    exog=sm.add_constant(pd.DataFrame({
        'wyniki_rt_r1': wyniki_rt_r1,
        'zmiana_frekwencji': zmiana_frekwencji,
        'typ_obszaru': typ_obszaru_encoded
    })),
    entity_effects=True,
    time_effects=False
)`}</code>
            </pre>
            <p className="text-gray-600 mt-4">
              Efekty stałe na poziomie powiatu pozwalają kontrolować niezmienne cechy regionalne.
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Model GAM (Etap 2)
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Do modelowania nieliniowych zależności używamy statsmodels GAM:
            </p>
            <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm">{`from statsmodels.gam.api import GLMGam, BSplines

bs = BSplines(leaning_score, df=12, degree=3)
gam_model = GLMGam(
    residuals, 
    smoother=bs,
    alpha=np.array([0.5])
).fit()`}</code>
            </pre>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bootstrap dla walidacji
          </h2>
          <p className="text-gray-600 mb-4">
            Stosujemy klastrowy bootstrap na poziomie powiatów:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>1999 iteracji dla 95% przedziału ufności</li>
            <li>Losowanie powiatów ze zwracaniem</li>
            <li>Pełne powtorzenie dwuetapowej analizy w każdej iteracji</li>
            <li>Obliczenie percentyli empirycznych dla oszacowań</li>
          </ul>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Parametry analizy
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parametr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wartość
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uzasadnienie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    min_glosow
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    15
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Eliminacja statystycznie niereprezentatywnych komisji
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    spline_df
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    12
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Balans między elastycznością a przeuczeniem
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    bootstrap_n
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    1999
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Wysoka precyzja oszacowań przedziałów ufności
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kod źródłowy
          </h2>
          <p className="text-gray-600 mb-4">
            Pełny kod analizy jest dostępny w repozytorium:
          </p>
          <a 
            href="https://github.com/wybory2025/wybory2025" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Zobacz na GitHub
          </a>
        </section>
      </div>
    </div>
  )
}