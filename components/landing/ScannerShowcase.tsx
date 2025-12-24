'use client';

import {
  ArrowRight, Check, ScanBarcode, Smartphone, Repeat, Workflow,
  Zap, Sparkles, Clock, TrendingUp
} from 'lucide-react';

export default function ScannerShowcase() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">Fonctionnalité exclusive PRO</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Scanner de code-barres intelligent
              </h2>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Transformez votre smartphone en scanner professionnel. Ajoutez des produits instantanément, gérez votre inventaire en temps réel et gagnez un temps précieux.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mt-1">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Mobile-first</h3>
                    <p className="text-blue-100">Scannez directement depuis votre mobile, tablette ou ordinateur portable</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mt-1">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Instantané</h3>
                    <p className="text-blue-100">Reconnaissance ultra-rapide des codes EAN, UPC, QR et bien plus</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mt-1">
                    <Workflow className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Automatisation complète</h3>
                    <p className="text-blue-100">Ajout automatique aux commandes, mise à jour du stock en un scan</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
                >
                  Essayer gratuitement
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
                >
                  Voir les plans
                </a>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Mock scanner interface */}
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScanBarcode className="h-6 w-6 text-white" />
                      <span className="font-semibold text-white">Scanner</span>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>

                  {/* Scanner viewfinder */}
                  <div className="relative bg-black aspect-[3/4] flex items-center justify-center">
                    {/* Scanning frame */}
                    <div className="relative w-48 h-48 border-4 border-white/30 rounded-2xl">
                      {/* Corner indicators */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                      {/* Animated scanning line */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 shadow-lg shadow-blue-500/50 animate-scan"></div>

                      {/* Barcode visualization */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-50">
                        <div className="flex gap-1">
                          {[4, 8, 2, 6, 4, 8, 3, 5, 7, 4, 6, 2].map((height, i) => (
                            <div
                              key={i}
                              className="w-1 bg-white"
                              style={{ height: `${height * 4}px` }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Success notification */}
                    <div className="absolute bottom-6 left-6 right-6 bg-green-500 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg animate-slide-up">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-semibold">Produit scanné!</div>
                        <div className="text-green-100 text-xs">Ajouté à la commande</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom instruction */}
                  <div className="bg-gray-800 p-4 text-center">
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                      <Repeat className="h-4 w-4" />
                      Placez le code-barres dans le cadre
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">-75%</div>
                    <div className="text-xs text-gray-600">Temps de saisie</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">+300%</div>
                    <div className="text-xs text-gray-600">Productivité</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 4px); }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
}
