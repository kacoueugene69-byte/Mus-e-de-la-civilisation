/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ticket } from '../types';
import { Ticket as TicketIcon, Calendar, Armchair, QrCode, Download, Printer, User, Mail, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TicketingProps {
  tickets: Ticket[];
  onAddTicket: (ticket: Omit<Ticket, 'id_ticket' | 'date_reservation' | 'code_unique'>) => Ticket;
}

export default function Ticketing({ tickets, onAddTicket }: TicketingProps) {
  
  // Form input state variables
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [ticketType, setTicketType] = useState<'standard' | 'etudiant' | 'famille' | 'groupe' | 'virtuel'>('standard');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Payment states
  const [payMethod, setPayMethod] = useState<'wave' | 'orange' | 'mtn' | 'card'>('wave');
  const [payPhone, setPayPhone] = useState('');
  const [payCardNum, setPayCardNum] = useState('');
  const [payCardExpiry, setPayCardExpiry] = useState('');
  const [payCardCvc, setPayCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // New generated ticket to display state
  const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);
  const [showPrintMessage, setShowPrintMessage] = useState(false);

  // Prices mapper
  const PRICES = {
    standard: 2000,
    etudiant: 1000,
    virtuel: 1500,
    famille: 5000,
    groupe: 8000
  };

  const TYPE_LABELS = {
    standard: 'Accès Standard Expo',
    etudiant: 'Tarif Étudiant / Jeune',
    virtuel: 'Accès Virtuel 3D',
    famille: 'Forfait Famille (4 pers.)',
    groupe: 'Accès Groupe Scolaire / Privé'
  };

  // Submit and create dynamic ticket with simulated secure payment processing
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail || !visitDate || !agreeTerms) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const newTicket = onAddTicket({
        nom_visiteur: visitorName,
        email: visitorEmail,
        date_visite: visitDate,
        type_ticket: ticketType,
        statut: 'en_attente', // Submits to administration list for dynamic approval
        prix: PRICES[ticketType],
        moyen_paiement: payMethod === 'card' ? 'Carte Bancaire' : payMethod.toUpperCase() + ' Money',
        telephone_paiement: payMethod === 'card' ? 'Card *' + (payCardNum.replace(/\s/g, '').slice(-4) || '4242') : payPhone
      });

      setGeneratedTicket(newTicket);
      setIsProcessingPayment(false);
      // Reset form inputs
      setVisitorName('');
      setVisitorEmail('');
      setVisitDate('');
      setPayPhone('');
      setPayCardNum('');
      setPayCardExpiry('');
      setPayCardCvc('');
      setAgreeTerms(false);
    }, 2000);
  };

  const handlePrint = () => {
    setShowPrintMessage(true);
    setTimeout(() => {
      window.print();
      setShowPrintMessage(false);
    }, 1500);
  };

  return (
    <section id="billing-space" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-ivory-50 text-left">
      
      {/* Upper header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-3xl font-extrabold text-ivory-900 uppercase">
          Billetterie et Réservations
        </h2>
        <div className="w-16 h-1 w-1 bg-gradient-to-r from-orange-400 to-gold-500 mx-auto mt-2 rounded-full"></div>
        <p className="mt-3 text-sm text-ivory-800/80 font-light">
          Réservez votre billet d&apos;entrée pour l&apos;exposition physique ou accédez au pass virtuel premium illimité. Les tickets réservés sont examinés instantanément par l&apos;administration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form elements Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gold-600/10 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-gold-800/10 pb-4">
            <TicketIcon className="w-6 h-6 text-orange-500 animate-pulse" />
            <h3 className="font-display font-extrabold text-lg text-ivory-900 uppercase">
              Formulaire de Réservation
            </h3>
          </div>

          <form onSubmit={handleSubmitBooking} className="space-y-4">
            
            {/* Input Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-500" /> Nom Complet du Visiteur
              </label>
              <input
                type="text"
                placeholder="Ex. Amadou Koné"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full text-sm p-3 bg-ivory-100 rounded-xl border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-gray-400"
                required
              />
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-500" /> Adresse Courriel électronique
              </label>
              <input
                type="email"
                placeholder="Ex. amadou.kone@gmail.com"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                className="w-full text-sm p-3 bg-ivory-100 rounded-xl border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-gray-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Input Date */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" /> Date de Visite
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]} // Prevents backdates
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full text-sm p-3 bg-ivory-100 rounded-xl border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700"
                  required
                />
              </div>

              {/* Selection for ticket type */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono flex items-center gap-1.5">
                  <Armchair className="w-3.5 h-3.5 text-gold-500" /> Formule &amp; Tarif
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as any)}
                  className="w-full text-sm p-3 bg-ivory-100 rounded-xl border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500 text-gray-700 font-medium"
                >
                  <option value="standard">Standard Expo - 2,000 FCFA</option>
                  <option value="etudiant">Étudiant/Jeune - 1,000 FCFA</option>
                  <option value="virtuel">Pass Virtuel Uniquement - 1,500 FCFA</option>
                  <option value="famille">Forfait Famille - 5,000 FCFA</option>
                  <option value="groupe">Groupe Privé &amp; Guide - 8,000 FCFA</option>
                </select>
              </div>

            </div>

            {/* Payment Method Selector Choice Block / Sélection des moyens de paiement */}
            <div className="border-t border-gold-800/10 pt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono block">
                  💳 Sélectionner le Moyen de Paiement
                </label>
                <p className="text-[10px] text-gray-500 font-light mt-0.5">
                  Choisissez votre canal requis pour régler les frais d&apos;entrée.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('wave')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    payMethod === 'wave'
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm font-bold'
                      : 'border-gold-800/10 bg-white text-gray-500 hover:bg-gold-50/50'
                  }`}
                >
                  <span className="text-xs font-bold">🌊 WAVE</span>
                  <span className="text-[8px] opacity-75 font-mono">Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('orange')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    payMethod === 'orange'
                      ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm font-bold'
                      : 'border-gold-800/10 bg-white text-gray-500 hover:bg-gold-50/50'
                  }`}
                >
                  <span className="text-xs font-bold">🍊 ORANGE</span>
                  <span className="text-[8px] opacity-75 font-mono">CI Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('mtn')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    payMethod === 'mtn'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800 shadow-sm font-bold'
                      : 'border-gold-800/10 bg-white text-gray-500 hover:bg-gold-50/50'
                  }`}
                >
                  <span className="text-xs font-bold">📱 MTN MOMO</span>
                  <span className="text-[8px] opacity-75 font-mono">Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    payMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm font-bold'
                      : 'border-gold-800/10 bg-white text-gray-500 hover:bg-gold-50/50'
                  }`}
                >
                  <span className="text-xs font-bold">💳 CARTE</span>
                  <span className="text-[8px] opacity-75 font-mono">Visa / Master</span>
                </button>
              </div>

              {/* Conditional Inputs */}
              <div>
                {payMethod !== 'card' ? (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase block">
                      Numéro de téléphone Côte d&apos;Ivoire
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 07 00 00 00 00"
                        value={payPhone}
                        onChange={(e) => setPayPhone(e.target.value)}
                        className="w-full text-xs px-3.5 py-3 bg-ivory-100 border border-gold-800/10 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-slate-800"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-[9.5px] font-mono font-bold text-gold-800 uppercase block">
                        Numéro de Carte
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242"
                        value={payCardNum}
                        onChange={(e) => setPayCardNum(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-ivory-100 border border-gold-800/10 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono font-bold text-gold-800 uppercase block">
                        Validité
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={payCardExpiry}
                        onChange={(e) => setPayCardExpiry(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-ivory-100 border border-gold-800/10 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 text-center focus:border-gold-500 text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono font-bold text-gold-800 uppercase block">
                        CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="123"
                        value={payCardCvc}
                        onChange={(e) => setPayCardCvc(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 bg-ivory-100 border border-gold-800/10 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 text-center focus:border-gold-500 text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulated Checkout Fee Statement box */}
            <div className="bg-ivory-100 rounded-xl p-4 border border-gold-800/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">Total à régler</p>
                <p className="font-display font-black text-2xl text-gold-800 mt-0.5">
                  {PRICES[ticketType].toLocaleString()} <span className="text-xs font-bold">FCFA</span>
                </p>
                <p className="text-[10px] text-gray-400 font-mono mt-0.5">TVA et guide audio inclus d&apos;office.</p>
              </div>

              <div className="bg-white px-3 py-2 rounded-lg border border-gold-800/10 text-[10px] font-mono text-emerald-800 flex items-center gap-1.5 font-bold uppercase">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>{payMethod === 'card' ? 'Visa / MC' : payMethod}</span>
              </div>
            </div>

            {/* Check Box to agree terms */}
            <div className="flex items-start space-x-2.5 pt-2">
              <input
                id="booking-terms-agree"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 accent-gold-600 h-4 w-4 rounded text-gold-600 border-gold-800/20"
                required
              />
              <label htmlFor="booking-terms-agree" className="text-xs font-light text-ivory-800/80 leading-normal">
                Je certifie l&apos;exactitude des informations fournies et réserve mon ticket d&apos;entrée pour les collections du Musée de Côte d&apos;Ivoire.
              </label>
            </div>

            {/* Actions Trigger button */}
            <button
              type="submit"
              disabled={!agreeTerms || isProcessingPayment}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest rounded-xl text-ivory-50 bg-gradient-to-r from-orange-500 to-gold-600 hover:from-orange-400 hover:to-gold-500 disabled:opacity-50 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  <span>TRAITEMENT SÉCURISÉ DU PAIEMENT...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>RÉGLER ET GÉNÉRER MON TICKET</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Display Side Column with dynamically generated gold pass */}
        <div className="lg:col-span-5 space-y-6">
          
          <AnimatePresence mode="wait">
            {generatedTicket ? (
              <motion.div
                key="generated-ticket-pass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-gold-950 to-forest-950 text-white rounded-3xl p-6 border-2 border-gold-500/30 shadow-2xl relative overflow-hidden"
              >
                
                {/* Visual authentic layout gold elements */}
                <div className="absolute top-[-30px] right-[-30px] w-40 h-40 bg-gold-400 rounded-full blur-[100px] opacity-25"></div>
                
                {/* Authentic museum layout banner */}
                <div className="flex items-center justify-between border-b border-gold-500/20 pb-4 mb-4">
                  <div className="text-left">
                    <span className="bg-orange-500 text-white font-mono font-bold text-[8px] tracking-widest px-2 py-0.5 rounded uppercase">E-TICKET</span>
                    <h4 className="font-display font-black text-sm text-gold-300 tracking-wider uppercase mt-1">Musée des Civilisations</h4>
                    <p className="text-[9px] text-gray-400 font-mono tracking-tighter">PRÉSERVATION DU PATRIMOINE IVOIRIEN</p>
                  </div>

                  <div className="h-10 w-10 shrink-0 bg-gold-400/10 rounded-lg flex items-center justify-center border border-gold-500/20 text-gold-300">
                    <TicketIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Main pass details */}
                <div className="space-y-4 text-left">
                  
                  {/* Visiteur Name */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">NOM VISITEUR</p>
                      <p className="font-bold text-ivory-50 text-sm truncate">{generatedTicket.nom_visiteur}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">COURRIEL E-MAIL</p>
                      <p className="font-light text-ivory-200 truncate">{generatedTicket.email}</p>
                    </div>
                  </div>

                  {/* Visit Date & Ticket Type */}
                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">DATE DE VISITE</p>
                      <p className="font-bold text-ivory-50 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-400" /> {new Date(generatedTicket.date_visite).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">CATÉGORIE/FORMULE</p>
                      <p className="font-bold text-gold-300">{TYPE_LABELS[generatedTicket.type_ticket] || generatedTicket.type_ticket}</p>
                    </div>
                  </div>

                  {/* Unique Code, Cost and status state */}
                  <div className="grid grid-cols-2 gap-4 text-xs pt-1 pb-4 border-b border-gold-500/20">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">CODE D&apos;ACCÈS EXPO</p>
                      <p className="font-mono text-[11px] text-orange-400 font-bold tracking-wider">{generatedTicket.code_unique}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">MONTANT RÉGLÉ</p>
                      <p className="font-extrabold text-white text-sm">{generatedTicket.prix.toLocaleString()} FCFA</p>
                    </div>
                  </div>

                  {generatedTicket.moyen_paiement && (
                    <div className="grid grid-cols-2 gap-4 text-xs pt-1 pb-4 border-b border-gold-500/20 animate-in fade-in duration-300">
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">CANAL DE RÈGLEMENT</p>
                        <p className="font-bold text-gray-200">{generatedTicket.moyen_paiement}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">DÉTAIL / RÉFÉRENCE</p>
                        <p className="font-mono text-[11px] text-gray-300 truncate">{generatedTicket.telephone_paiement || '—'}</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer bar with realistic QR code and actions row */}
                <div className="flex items-center justify-between pt-4 mt-2">
                  <div className="text-left space-y-1.5">
                    <p className="text-[8px] text-gray-400 uppercase font-mono">STATUT DU PASS EXPOSITION</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/25 text-orange-300 border border-orange-500/30 animate-pulse">
                      ⏳ En Attente d&apos;Admin
                    </span>
                    <p className="text-[9px] text-gray-500 leading-normal max-w-[180px]">
                      Passez à la Console Admin pour valider ou rejeter ce ticket !
                    </p>
                  </div>

                  {/* Dynamic mock visual QR Code block */}
                  <div className="p-2.5 bg-white rounded-xl border border-gold-500/30 shrink-0 flex flex-col items-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                    <span className="text-[7px] text-gray-500 font-mono tracking-widest mt-1">SCAN CI EXPO</span>
                  </div>
                </div>

                {/* Action commands: Print or download pass */}
                <div className="mt-6 pt-4 border-t border-gold-500/10 flex items-center justify-center gap-3">
                  <button 
                    onClick={handlePrint}
                    className="flex-1 py-2 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 border border-gold-500/20 text-xs font-bold text-gold-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Votre ticket ${generatedTicket.code_unique} a été généré avec succès en format PDF virtuel dans vos téléchargements!`);
                    }}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-gold-600 hover:brightness-105 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </button>
                </div>

                {/* Printing simulated info block */}
                {showPrintMessage && (
                  <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6 text-white">
                    <Printer className="w-8 h-8 text-gold-300 animate-spin" />
                    <p className="text-sm font-semibold mt-3 text-gold-400">Préparation de l&apos;impression physique...</p>
                    <p className="text-xs text-gray-400 mt-1">Veuillez autoriser les fenêtres contextuelles de l&apos;iframe.</p>
                  </div>
                )}

              </motion.div>
            ) : (
              <div key="ticket-instructions-card" className="bg-gradient-to-b from-forest-950 to-forest-900 text-white rounded-3xl p-6 border border-gold-600/10 shadow-lg text-left h-full flex flex-col justify-between min-h-[350px]">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] text-gold-400 uppercase tracking-widest">PATRIMOINE CIV</span>
                  <h3 className="font-display font-extrabold text-xl text-white uppercase leading-tight">
                    Accès aux Collections Nationales 
                  </h3>
                  <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-gold-500 rounded-full"></div>
                  
                  <p className="text-xs font-light text-ivory-300 leading-relaxed">
                    Le Musée Numérique des Civilisations propose des visites immersives complètes de nos collections classées. 
                    Le règlement est 100% sécurisé et simulé via Mobile Money local (Orange, MTN, Wave).
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-ivory-100">Billet Standard : 2,000 FCFA</p>
                        <p className="text-[10px] text-gray-400">Accès coupe-file complet pour une personne.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-ivory-100">Forfait Famille : 5,000 FCFA</p>
                        <p className="text-[10px] text-gray-400">Accès pour 2 adultes et 2 enfants de moins de 15 ans.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gold-800/20 pt-4 mt-6 text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                  <TicketIcon className="w-4 h-4 text-gold-500" />
                  <span>N° Agrément Ministère : MNC-CIV-2026-T89</span>
                </div>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </section>
  );
}
