'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, Package, Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        setIsScanning(true);

        // Request camera access using getUserMedia
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' }, // Prefer back camera
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Start ZXing scanner
        const codeReader = new BrowserMultiFormatReader();
        readerRef.current = codeReader;

        // Use decodeFromVideoElement instead
        codeReader.decodeFromVideoElement(videoRef.current!, (result, error) => {
          if (result) {
            const barcode = result.getText();
            console.log('Barcode scanned:', barcode);
            onScan(barcode);
            stopScanner();
            onClose();
          }
          // Ignore NotFoundException - it's normal when no barcode is visible
          if (error && error.name !== 'NotFoundException') {
            console.error('Scanner error:', error);
          }
        });
      } catch (err: any) {
        console.error('Failed to start scanner:', err);
        if (err.name === 'NotAllowedError') {
          setError('Permission d\'accès à la caméra refusée. Veuillez autoriser l\'accès dans les paramètres.');
        } else if (err.name === 'NotFoundError') {
          setError('Aucune caméra détectée sur cet appareil.');
        } else {
          setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        }
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    // Stop ZXing reader
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Scanner le code-barres</h2>
          </div>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Video preview */}
      <div className="relative w-full h-full flex items-center justify-center">
        {error ? (
          <div className="text-center p-6">
            <div className="bg-red-500/20 text-red-100 rounded-lg p-6 max-w-md mx-auto">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Erreur</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 bg-white text-gray-900 px-6 py-2 rounded-lg font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />

            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                {/* Scanning frame */}
                <div className="w-64 h-64 border-4 border-white/50 rounded-lg relative">
                  {/* Corner indicators */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                  {/* Scanning line animation */}
                  {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 animate-scan" />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom instructions */}
      {!error && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="text-center text-white space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-sm">Recherche de code-barres...</p>
            </div>
            <p className="text-xs text-gray-300">
              Placez le code-barres dans le cadre pour le scanner
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: calc(100% - 4px);
          }
          100% {
            top: 0;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
