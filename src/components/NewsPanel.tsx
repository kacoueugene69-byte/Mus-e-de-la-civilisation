/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Actualite } from '../types';
import { Calendar, BookOpen, Clock, Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsPanelProps {
  actualites: Actualite[];
}

export default function NewsPanel({ actualites }: NewsPanelProps) {
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    setSubSuccess(true);
    setTimeout(() => {
      setEmailSub('');
      setSubSuccess(false);
    }, 4000);
  };

  return (
    <section id="news-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-ivory-50 text-left">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-3xl font-extrabold text-ivory-900 uppercase">
          Actualités &amp; Événements
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-gold-500 mx-auto mt-2 rounded-full"></div>
        <p className="mt-3 text-sm text-ivory-800/80 font-light">
          Suivez l&apos;actualisation de la numérisation du patrimoine de Côte d&apos;Ivoire et tenez-vous informé des expositions rituelles physiques temporaires.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* News Column */}
        <div className="lg:col-span-2 space-y-8">
          {actualites.map((act) => (
            <article 
              key={act.id_actualite}
              className="bg-white rounded-3xl overflow-hidden border border-gold-600/10 shadow-sm flex flex-col md:flex-row hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-2/5 aspect-video md:aspect-auto min-h-[160px] relative bg-forest-950">
                <img
                  src={act.image}
                  alt={act.titre}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>Publié le {new Date(act.date_publication).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-950 leading-snug">
                    {act.titre}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    {act.contenu}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gold-800/5 text-[10px]">
                  <span className="flex items-center gap-1 text-gold-700 font-mono">
                    <BookOpen className="w-3.5 h-3.5" /> MNC PRESSE
                  </span>
                  
                  <span className="text-gray-400">Lecture : 3 min</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter promo column */}
        <div className="bg-gradient-to-tr from-forest-950 to-forest-900 text-white rounded-3xl p-6 border border-gold-500/10 shadow-lg relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-gold-400 rounded-full blur-3xl opacity-20"></div>

          <div className="space-y-4 relative z-10">
            <span className="bg-orange-500 text-white font-mono font-bold text-[8px] tracking-widest px-2.5 py-1 rounded uppercase">NEWSLETTER</span>
            <h3 className="font-display font-black text-xl text-white uppercase leading-tight">
              Abonnez-vous aux Alertes de Numérisation
            </h3>
            <p className="text-xs font-light text-ivory-300 leading-relaxed">
              Recevez mensuellement les fiches techniques des nouvelles œuvres d&apos;art répertoriées en format 3D interactif et les archives régionales exclusives d&apos;Afrique de l&apos;Ouest.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-2">
              <input
                type="email"
                placeholder="Votre adresse courriel"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                className="w-full text-xs p-3 bg-white/10 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-gold-400 text-white placeholder:text-gray-400"
                required
              />
              
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-gold-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3 h-3 text-white" />
                <span>S&apos;inscrire gratuitement</span>
              </button>
            </form>

            <AnimatePresence>
              {subSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-[10px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Merci ! Votre adresse courriel est enregistrée d&apos;office.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-4 border-t border-gold-800/10 text-[9px] text-gray-400 font-mono flex items-center gap-1.5 justify-center">
            <Clock className="w-3.5 h-3.5 text-gold-500" />
            <span>Zéro spam. Désinscription possible à tout moment.</span>
          </div>
        </div>

      </div>

    </section>
  );
}
