/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, Compass, Heart, Github, Award, Clock } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="app-footer" className="bg-forest-950 text-ivory-300 border-t border-gold-800/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-terracotta-600 to-gold-500 shadow-md">
                <Landmark className="w-5 h-5 text-ivory-50" />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-ivory-100 uppercase">
                MNC Côte d&apos;Ivoire
              </span>
            </div>
            
            <p className="text-sm font-light text-ivory-400 max-w-sm leading-relaxed">
              Le Musée Numérique des Civilisations de Côte d&apos;Ivoire s&apos;engage dans la sauvegarde, 
              le catalogage tridimensionnel et la diffusion de la richesse culturelle incomparable 
              du grand patrimoine spirituel national.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-gold-400 font-mono">
              <Clock className="w-4 h-4 text-gold-500" />
              <span>Dernière mise à jour : Juin 2026 (v2.0)</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-display font-semibold text-sm text-ivory-100 tracking-wider uppercase">
              Navigation
            </h4>
            <button 
              onClick={() => setCurrentTab('gallery')} 
              className="text-left text-sm hover:text-gold-400 transition-colors"
            >
              Galerie des Œuvres
            </button>
            <button 
              onClick={() => setCurrentTab('virtual-tour')} 
              className="text-left text-sm hover:text-gold-400 transition-colors"
            >
              Visite Immersion 3D
            </button>
            <button 
              onClick={() => setCurrentTab('ticketing')} 
              className="text-left text-sm hover:text-gold-400 transition-colors"
            >
              Achat de Billet
            </button>
            <button 
              onClick={() => setCurrentTab('news')} 
              className="text-left text-sm hover:text-gold-400 transition-colors"
            >
              Actualités du Musée
            </button>
          </div>

          {/* Official Endorsements & Partners */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-display font-semibold text-sm text-ivory-100 tracking-wider uppercase">
              Affiliations
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-light text-ivory-400">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Ministère de la Transition Numérique</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Inscrit au Patrimoine UNESCO 2017</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Fonds National de la Culture (FNC)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower bar */}
        <div className="mt-8 pt-8 border-t border-gold-800/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-ivory-400">
          <p>© {currentYear} Musée Numérique de Côte d&apos;Ivoire. Tous droits réservés.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Conçu avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> pour la préservation des arts d&apos;Afrique de l&apos;Ouest.
          </p>
        </div>
      </div>
    </footer>
  );
}
