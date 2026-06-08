/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Landmark, Compass, Ticket, BookOpen, ShieldAlert, Users, ToggleLeft, ToggleRight, Sparkles, LogOut, Clock, Play, CreditCard, X, Smartphone } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: 'administrateur' | 'visiteur';
  setUserRole: (role: 'administrateur' | 'visiteur') => void;
  currentUser: User | null;
  onLogout: () => void;
  ticketActivationTime: number | null;
  onForceExpire?: () => void;
  onAddHours?: () => void;
}

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  userRole, 
  setUserRole, 
  currentUser, 
  onLogout,
  ticketActivationTime,
  onForceExpire,
  onAddHours
}: NavbarProps) {
  
  // Timer countdown local state
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  // 2-Hour extension payment states
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extPhone, setExtPhone] = useState('');
  const [extOperator, setExtOperator] = useState<'wave' | 'orange' | 'mtn'>('wave');
  const [isExtProcessing, setIsExtProcessing] = useState(false);
  const [extSuccessMsg, setExtSuccessMsg] = useState(false);

  const handleOpenExtensionModal = () => {
    setShowExtensionModal(true);
    setExtPhone('');
    setIsExtProcessing(false);
    setExtSuccessMsg(false);
  };

  const handlePayExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extPhone) return;
    setIsExtProcessing(true);
    setTimeout(() => {
      setIsExtProcessing(false);
      setExtSuccessMsg(true);
      setTimeout(() => {
        if (onAddHours) onAddHours();
        setShowExtensionModal(false);
      }, 1500);
    }, 1800);
  };

  useEffect(() => {
    if (!ticketActivationTime || userRole !== 'visiteur') {
      setTimeLeftStr('');
      return;
    }

    const intervalId = setInterval(() => {
      const now = Date.now();
      const duration24h = 24 * 60 * 60 * 1000;
      const elapsed = now - ticketActivationTime;
      const remaining = duration24h - elapsed;

      if (remaining <= 0) {
        setTimeLeftStr('Séance expirée !');
        // Let App.tsx know or handle inside it
      } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        const hString = hours < 10 ? `0${hours}` : hours;
        const mString = minutes < 10 ? `0${minutes}` : minutes;
        const sString = seconds < 10 ? `0${seconds}` : seconds;

        setTimeLeftStr(`${hString}h ${mString}m ${sString}s`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [ticketActivationTime, userRole]);

  const toggleRole = () => {
    const newRole = userRole === 'administrateur' ? 'visiteur' : 'administrateur';
    setUserRole(newRole);
    // If we were on admin metrics and changed to visitor, switch to home/gallery
    if (newRole === 'visiteur' && currentTab.startsWith('admin')) {
      setCurrentTab('gallery');
    }
  };

  const isTicketActive = ticketActivationTime !== null && (Date.now() - ticketActivationTime < 24 * 60 * 60 * 1000);

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full bg-forest-950/95 backdrop-blur-md border-b border-gold-800/20 shadow-lg">
      
      {/* 24H Visitor Ticket Ticker announcement bar */}
      {userRole === 'visiteur' && currentUser && (
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white text-[11px] font-mono font-semibold py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>
              {isTicketActive 
                ? `Pass d'Entrée Actif (24h) — Temps Restant : ` 
                : `Accès Verrouillé — Aucun pass d'accès actif pour voir les oeuvres.`}
            </span>
            {isTicketActive && (
              <span className="font-extrabold bg-black/40 px-2 py-0.5 rounded text-white text-xs border border-white/10">
                {timeLeftStr || "Chargement..."}
              </span>
            )}
          </div>

          {/* Quick Simulation controls for the reviewer */}
          <div className="flex items-center gap-3.5 text-[10px]">
            {isTicketActive ? (
              <>
                <button
                  type="button"
                  onClick={onForceExpire}
                  className="bg-black/50 hover:bg-rose-700/80 hover:text-white px-2 py-0.5 rounded text-rose-300 font-bold transition-all"
                  title="Simule l'expiration immédiate des 24 heures pour tester le verrouillage"
                >
                  ⚡ Expirer Pass (Tester Verrouillage)
                </button>
                <button
                  type="button"
                  onClick={handleOpenExtensionModal}
                  className="bg-black/50 hover:bg-emerald-700/80 hover:text-white px-2 py-0.5 rounded text-emerald-300 font-bold transition-all"
                  title="Acheter une prolongation d'accès de 2 heures"
                >
                  ⏳ Ajouter 2H
                </button>
              </>
            ) : (
              <span className="text-yellow-100 italic">Prenez un billet sur l&apos;onglet Billet ou simulez-en un via le verrou.</span>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Section */}
          <div 
            id="brand-logo" 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentTab('gallery')}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 via-gold-500 to-emerald-500 shadow-md group-hover:scale-105 transition-all duration-300">
              <Landmark className="w-6 h-6 text-ivory-50 group-hover:rotate-3 transition-transform" />
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-305"></span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-tight text-ivory-100 group-hover:text-gold-400 transition-colors uppercase">
                Musée Côte d&apos;Ivoire
              </span>
              <span className="font-mono text-[9px] tracking-widest text-[#009B77] flex items-center gap-1 font-extrabold">
                <Sparkles className="w-2.5 h-2.5 text-[#F77F00]" /> CIV MULTIMÉDIA
              </span>
            </div>
          </div>

          {/* Nav Links for Client View */}
          <nav id="main-navigation" className="hidden md:flex items-center space-x-3">
            <button
              id="nav-btn-gallery"
              onClick={() => setCurrentTab('gallery')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === 'gallery'
                  ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                  : 'text-ivory-200 hover:bg-forest-900 hover:text-ivory-50'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Galerie</span>
            </button>

            <button
              id="nav-btn-virtual-tour"
              onClick={() => setCurrentTab('virtual-tour')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === 'virtual-tour'
                  ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                  : 'text-ivory-200 hover:bg-forest-900 hover:text-ivory-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Visite 3D</span>
            </button>

            <button
              id="nav-btn-ticketing"
              onClick={() => setCurrentTab('ticketing')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === 'ticketing'
                  ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                  : 'text-ivory-200 hover:bg-forest-900 hover:text-ivory-50'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Billetterie</span>
            </button>

            <button
              id="nav-btn-news"
              onClick={() => setCurrentTab('news')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentTab === 'news'
                  ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                  : 'text-ivory-200 hover:bg-forest-900 hover:text-ivory-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Actualités</span>
            </button>

            {userRole === 'administrateur' && (
              <button
                id="nav-btn-admin"
                onClick={() => setCurrentTab('admin-dashboard')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-dashed transition-all ${
                  currentTab.startsWith('admin')
                    ? 'border-orange-400 bg-orange-950/40 text-orange-200 shadow'
                    : 'border-orange-500/30 text-orange-400 hover:bg-forest-900/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>Console Admin</span>
              </button>
            )}
          </nav>

          {/* User Profile Info and interactive controls */}
          <div className="flex items-center space-x-4">
            
            {/* Authenticated user display */}
            {currentUser && (
              <div className="flex items-center gap-2 border-l border-gold-800/20 pl-4">
                <img 
                  src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/identicon/svg?seed=MNC'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-gold-400/40 shrink-0"
                />
                <div className="flex flex-col hidden lg:flex text-left">
                  <span className="text-xs font-bold text-white truncate max-w-[100px]" title={currentUser.email}>
                    {currentUser.username || currentUser.email.split('@')[0]}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-gold-400 font-bold leading-tight">
                    {userRole === 'administrateur' ? 'Administrateur' : 'Visiteur'}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-1 px-2 hover:bg-red-900/30 hover:text-red-300 rounded text-gray-400 transition-all flex items-center gap-1 font-mono text-[10px]"
                  title="Se Déconnecter du Compte"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Quitter</span>
                </button>
              </div>
            )}

            {/* Interactive Role Switcher for seamless preview testing - Restricted to Admin users only */}
            {currentUser?.role === 'administrateur' && (
              <div id="role-switcher-badge" className="flex items-center space-x-2 bg-forest-900/80 px-3 py-1.5 rounded-full border border-gold-800/30">
                <span className="text-[9px] uppercase tracking-wider text-gold-400 font-mono hidden xl:inline">Simulateur</span>
                <button 
                  id="role-switch-trigger"
                  onClick={toggleRole}
                  className="text-ivory-200 hover:text-gold-400 transition-colors focus:outline-none"
                  title="Changer de rôle pour tester les fonctionnalités Administrateur / Visiteur"
                >
                  {userRole === 'administrateur' ? (
                    <ToggleRight className="w-7 h-7 text-orange-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-emerald-500" />
                  )}
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Navigation Dropdown Helper (Displays on small screens) */}
      <div id="mobile-navigation" className="md:hidden flex items-center justify-around bg-forest-900/90 border-t border-gold-800/10 py-2.5">
        <button
          onClick={() => setCurrentTab('gallery')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            currentTab === 'gallery' ? 'text-gold-400' : 'text-ivory-300'
          }`}
        >
          <Landmark className="w-5 h-5 mb-0.5" />
          <span>Galerie</span>
        </button>
        <button
          onClick={() => setCurrentTab('virtual-tour')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            currentTab === 'virtual-tour' ? 'text-gold-400' : 'text-ivory-300'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Visite 3D</span>
        </button>
        <button
          onClick={() => setCurrentTab('ticketing')}
          className={`flex flex-col items-center text-[10px] font-medium ${
            currentTab === 'ticketing' ? 'text-gold-400' : 'text-ivory-300'
          }`}
        >
          <Ticket className="w-5 h-5 mb-0.5" />
          <span>Billet</span>
        </button>
        {userRole === 'administrateur' && (
          <button
            onClick={() => setCurrentTab('admin-dashboard')}
            className={`flex flex-col items-center text-[10px] font-medium ${
              currentTab.startsWith('admin') ? 'text-gold-400' : 'text-gold-500'
            }`}
          >
            <ShieldAlert className="w-5 h-5 mb-0.5 animate-pulse" />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* 2-Hour Extension payment modal */}
      {showExtensionModal && (
        <div id="extension-checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white text-slate-950 rounded-3xl w-full max-w-md p-6 border-2 border-gold-600/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setShowExtensionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {extSuccessMsg ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h4 className="font-display font-bold text-lg text-forest-950 uppercase">Prolongation validée !</h4>
                <p className="text-xs text-gray-600">Votre paiement de <strong>500 FCFA</strong> a été traité. Nous avons ajouté 2 heures supplémentaires sur votre Pass d&apos;accès.</p>
              </div>
            ) : (
              <form onSubmit={handlePayExtension} className="space-y-4 text-left">
                <div>
                  <span className="bg-orange-500/10 text-orange-600 text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded">
                    PROLONGATION DE PASS
                  </span>
                  <h4 className="font-display font-black text-lg text-forest-950 uppercase mt-1">
                    Acheter +2 Heures
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Frais de prolongation : <strong className="text-gold-700 font-mono text-sm">500 FCFA</strong>
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-3">
                  {/* Operator selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase block">
                      Opérateur Mobile Money
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setExtOperator('wave')}
                        className={`p-2.5 rounded-xl border font-bold text-[10px] flex flex-col items-center gap-1 transition-all ${
                          extOperator === 'wave'
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500'
                        }`}
                      >
                        <span>🌊 WAVE</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtOperator('orange')}
                        className={`p-2.5 rounded-xl border font-bold text-[10px] flex flex-col items-center gap-1 transition-all ${
                          extOperator === 'orange'
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500'
                        }`}
                      >
                        <span>🍊 ORANGE</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setExtOperator('mtn')}
                        className={`p-2.5 rounded-xl border font-bold text-[10px] flex flex-col items-center gap-1 transition-all ${
                          extOperator === 'mtn'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-500'
                        }`}
                      >
                        <span>📱 MTN</span>
                      </button>
                    </div>
                  </div>

                  {/* Phone input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase block">
                      Numéro de téléphone Côte d&apos;Ivoire
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 07 00 00 00 00"
                        value={extPhone}
                        onChange={(e) => setExtPhone(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isExtProcessing}
                  className="w-full py-3.5 text-xs font-bold uppercase tracking-widest text-white rounded-xl bg-gradient-to-r from-orange-500 to-gold-600 hover:from-orange-400 hover:to-gold-500 transition-all flex items-center justify-center gap-2"
                >
                  {isExtProcessing ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>ENVOI DE LA REQUÊTE USSD...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-white" />
                      <span>RÉGLER LES FRAIS DE PROLONGATION</span>
                    </>
                  )}
                </button>
                <p className="text-[8px] text-gray-400 font-mono text-center">
                  Aucun montant réel ne sera prélevé. Simulation éducative MNC.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
