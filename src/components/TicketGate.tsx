/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, CreditCard, Sparkles, Compass, CheckCircle2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TicketGateProps {
  userEmail: string;
  onUnlockSuccess: () => void;
  triggerNotification: (msg: string, type: 'success' | 'info' | 'warn') => void;
}

export default function TicketGate({ userEmail, onUnlockSuccess, triggerNotification }: TicketGateProps) {
  const [selectedTariff, setSelectedTariff] = useState<'standard' | 'etudiant' | 'virtuel'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'orange' | 'wave' | 'mtn'>('wave');
  const [phone, setPhone] = useState('');

  const TARIFFS = {
    standard: { label: 'Accès Standard Expo', price: 2000 },
    etudiant: { label: 'Tarif Réduit Étudiant/Jeune', price: 1000 },
    virtuel: { label: 'Pass Virtuel Premium 3D', price: 1500 }
  };

  const handleSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      triggerNotification('Félicitations ! Paiement mobile validé avec succès.', 'success');
      onUnlockSuccess();
    }, 2000);
  };

  return (
    <div id="ticket-gate-layout" className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-gold-600/25 shadow-2xl grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Column: Warning & Info */}
        <div className="md:col-span-5 bg-gradient-to-br from-forest-950 to-forest-900 text-white p-8 flex flex-col justify-between text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 rounded-full blur-[100px] opacity-20"></div>
          
          <div className="space-y-4 relative z-10">
            <span className="bg-orange-500/90 text-white text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded uppercase">
              ACCÈS PROTÉGÉ • 24 HEURES
            </span>
            
            <h3 className="font-display font-black text-2xl text-gold-300 uppercase leading-tight">
              Achat du Pass d&apos;entrée
            </h3>
            
            <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-gold-500 rounded-full"></div>
            
            <p className="text-xs font-light text-ivory-300 leading-relaxed">
              Pour accéder aux fiches de numérisation 3D, écouter les audioguides rituels des masques ou naviguer dans le pavillon virtuel, les visiteurs doivent acquérir un billet valide.
            </p>

            <ul className="text-[11px] text-gold-300/90 space-y-2 pt-2 list-none font-sans font-medium">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400"></span>
                Vues 3D en haute définition
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400"></span>
                Audioguides rituels en français
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400"></span>
                Accès garanti pendant 24H chrono
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-gold-800/20 text-[10px] text-gray-400 font-mono flex items-center gap-2 justify-center">
            <Compass className="w-4 h-4 text-gold-500 animate-spin-slow" />
            <span>N° Agrément CIV-MNC-2026</span>
          </div>
        </div>

        {/* Right Column: Checkout Sim form */}
        <div className="md:col-span-7 p-8 text-left space-y-6 bg-ivory-50/50">
          <div>
            <h4 className="font-display font-bold text-lg text-forest-950 uppercase">
              Régler le droit d&apos;accès numérique
            </h4>
            <p className="text-xs text-gray-500 font-light mt-0.5">
              Assurez une authentification de paiement sécurisée sans sortir de chez vous.
            </p>
          </div>

          <form onSubmit={handleSimulatedPayment} className="space-y-4">
            
            {/* Tariff Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">
                1. Sélectionner une Formule
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(Object.keys(TARIFFS) as Array<keyof typeof TARIFFS>).map(key => {
                  const item = TARIFFS[key];
                  const active = selectedTariff === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedTariff(key)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        active 
                          ? 'border-gold-500 bg-gold-500/5 shadow-sm' 
                          : 'border-gold-805/10 bg-white hover:bg-gold-50/40'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-800 leading-tight">{item.label}</span>
                      <span className="text-xs font-mono font-black text-gold-700 mt-2">{item.price.toLocaleString()} F</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Money choice */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">
                2. Opérateur de Paiement Local
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wave')}
                  className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'wave' 
                      ? 'border-[#1E90FF] bg-[#1E90FF]/5 text-[#1E90FF]' 
                      : 'border-gold-805/10 bg-white hover:bg-gold-50/40 text-gray-500'
                  }`}
                >
                  <span className="text-[9px] font-mono">🌊 WAVE CI</span>
                  <span className="text-[8px] font-normal leading-none font-mono">Frais 1%</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange')}
                  className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'orange' 
                      ? 'border-[#FF6600] bg-[#FF6600]/5 text-[#FF6600]' 
                      : 'border-gold-805/10 bg-white hover:bg-gold-50/40 text-gray-500'
                  }`}
                >
                  <span className="text-[9px] font-mono">🍊 ORANGE MONEY</span>
                  <span className="text-[8px] font-normal leading-none font-mono">Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn')}
                  className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'mtn' 
                      ? 'border-yellow-500 bg-yellow-500/5 text-yellow-800' 
                      : 'border-gold-805/10 bg-white hover:bg-gold-50/40 text-gray-500'
                  }`}
                >
                  <span className="text-[9px] font-mono">📱 MTN MOMO</span>
                  <span className="text-[8px] font-normal leading-none font-mono">Sécurisé</span>
                </button>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-gold-800 uppercase block">
                3. Numéro Mobile Money (Côte d&apos;Ivoire)
              </label>
              <input
                type="tel"
                placeholder="Ex. +225 07 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-3 bg-white rounded-xl outline-none focus:ring-1 focus:ring-gold-500 border border-gold-800/10 text-slate-900"
                required
              />
              <p className="text-[9px] text-gray-400 font-mono font-light text-right">
                Ce paiement est simulé à des fins de démonstration. Aucun montant réel ne sera prélevé.
              </p>
            </div>

            {/* Pricing Summary box */}
            <div className="bg-gold-500/5 border border-gold-500/10 p-3.5 rounded-2xl flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[9px] text-gray-500 block">TOTAL DE LA TRANSACTION :</span>
                <span className="text-base font-black text-forest-950 font-display">{(TARIFFS[selectedTariff].price).toLocaleString()} FCFA</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
                <CreditCard className="w-4.5 h-4.5 text-emerald-600" /> Sans frais cachés
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white rounded-xl bg-gradient-to-r from-orange-500 to-gold-600 hover:from-orange-400 hover:to-gold-500 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>VÉRIFICATION DU COMPTE MOBILE...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>SIMULER LE PAIEMENT ET ACTIVER MON PASS 24H</span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
