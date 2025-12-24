'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Bloquer le scroll quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Toggle menu"
        type="button"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay & Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-[100] md:hidden"
            onClick={closeMenu}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl z-[110] md:hidden animate-slide-in">
        <div className="flex flex-col" style={{ height: '100vh' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button
              onClick={closeMenu}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <Link
                href="#features"
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#pricing"
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Tarifs
              </Link>
              <Link
                href="#testimonials"
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Témoignages
              </Link>
              <Link
                href="#faq"
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                FAQ
              </Link>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                onClick={closeMenu}
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Essai gratuit
              </Link>
            </div>
          </nav>
        </div>
      </div>
        </>
      )}
    </>
  );
}
