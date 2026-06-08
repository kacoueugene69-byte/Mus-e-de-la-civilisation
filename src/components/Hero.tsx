/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, MapPin, Landmark, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreClick: () => void;
  onVirtualTourClick: () => void;
}

export default function Hero({ onExploreClick, onVirtualTourClick }: HeroProps) {
  return (
    <div id="hero-section" className="relative overflow-hidden bg-forest-950 py-16 sm:py-24 text-ivory-100">
      
      {/* Background Graphic Patterns & Shadows */}
      <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#d99a0c_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      <div className="absolute -left-40 top-10 w-96 h-96 bg-terracotta-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute -right-40 bottom-10 w-96 h-96 bg-gold-600 rounded-full blur-[120px] opacity-25 pointer-events-none"></div>

      {/* Flag accent bar on top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
        <div className="w-1/3 h-full bg-orange-500"></div>
        <div className="w-1/3 h-full bg-white"></div>
        <div className="w-1/3 h-full bg-green-600"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Main Title Description and CTA calls */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-900/60 to-terracotta-900/60 border border-gold-600/30 px-3.5 py-1.5 rounded-full text-gold-300 text-xs font-mono font-medium max-w-max">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>MINISTÈRE DE LA CULTURE ET DE LA NUMÉRISATION</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-ivory-100 uppercase">
              Patrimoine des <br />
              <span className="bg-gradient-to-r from-orange-400 via-gold-400 to-amber-500 bg-clip-text text-transparent">
                Civilisations
              </span> <br />
              de Côte d&apos;Ivoire
            </h1>

            <p className="text-base sm:text-lg text-ivory-300 max-w-2xl font-light leading-relaxed">
              Bienvenue sur la plateforme officielle du Musée Numérique National des Civilisations. 
              Explorez en haute fidélité tridimensionnelle nos artefacts d&apos;exception (Akan, Sénoufo, Dan, Bété), 
              suivez la visite guidée virtuelle avec voix narrative et réservez votre accès en ligne.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 text-sm font-semibold rounded-xl text-ivory-50 bg-gradient-to-r from-terracotta-600 to-gold-600 hover:from-terracotta-500 hover:to-gold-500 transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
              >
                Explorer la Galerie
              </button>
              
              <button
                onClick={onVirtualTourClick}
                className="px-6 py-3.5 text-sm font-semibold rounded-xl text-gold-200 border border-gold-600/40 bg-gold-950/40 hover:bg-gold-900/50 hover:text-gold-100 transition-all duration-300 flex items-center space-x-2"
              >
                <Compass className="w-4 h-4 text-gold-400 animate-spin-slow" />
                <span>Lancer la Visite 3D</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gold-800/20 max-w-lg">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-gold-400 font-display">100%</span>
                <span className="text-xs text-ivory-300 font-mono tracking-tight uppercase">Immersion 3D</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-white font-display">60+</span>
                <span className="text-xs text-ivory-300 font-mono tracking-tight uppercase">Arts Classés</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display">UNESCO</span>
                <span className="text-xs text-ivory-300 font-mono tracking-tight uppercase">Patrimoine Cru</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual Showcase */}
          <div className="hidden lg:grid lg:col-span-5 relative mt-12 lg:mt-0 px-2">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold-600/20 shadow-2xl bg-forest-900 p-4 flex flex-col justify-between aspect-square group">
              <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-80" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent"></div>

              {/* Top Banner Tag */}
              <div className="relative flex items-center justify-between z-10 w-full">
                <span className="bg-orange-500/90 text-ivory-50 text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> Zaouli Gouro
                </span>
                <button className="p-2 bg-forest-950/80 rounded-full text-gold-300 border border-gold-600/20 hover:text-rose-400 hover:scale-110 transition-all duration-300">
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>

              {/* Bottom Details Section */}
              <div className="relative z-10 w-full bg-forest-950/85 backdrop-blur-md rounded-xl p-4 border border-gold-800/30 transform group-hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-center space-x-1 text-gold-400 text-xs font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Région de la Marahoué, Côte d&apos;Ivoire</span>
                </div>
                <h3 className="font-display font-bold text-lg text-ivory-100">
                  Le Masque Sacré de Djela
                </h3>
                <p className="text-xs text-ivory-300 line-clamp-2 mt-1">
                  Inscrit à l&apos;UNESCO en 2017. Symbole de rejouissance civile incarnant l&apos;histoire spirituelle et chorégraphique des Gouro.
                </p>
                
                {/* 3D Simulation CTA Badge */}
                <div onClick={onVirtualTourClick} className="mt-3 flex items-center justify-between text-xs text-gold-300 hover:text-gold-200 cursor-pointer border-t border-gold-800/30 pt-2.5">
                  <span className="font-mono text-[10px] tracking-wide">CLIQUEZ POUR EXPLORER EN 3D</span>
                  <span className="flex items-center gap-1 text-gold-400">
                    Interactif →
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
