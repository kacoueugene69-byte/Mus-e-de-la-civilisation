/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VirtualTour from './components/VirtualTour';
import Ticketing from './components/Ticketing';
import AdminDashboard from './components/AdminDashboard';
import NewsPanel from './components/NewsPanel';
import Footer from './components/Footer';
import AuthScreen from './components/AuthScreen';
import TicketGate from './components/TicketGate';

import { Oeuvre, Ethnie, Emplacement, Ticket, Commentaire, Actualite, User } from './types';
import { 
  INITIAL_OEUVRES, 
  INITIAL_ETHNIES, 
  INITIAL_EMPLACEMENTS, 
  INITIAL_TICKETS, 
  INITIAL_COMMENTAIRES, 
  INITIAL_ACTUALITES 
} from './data/mockData';

import { Sparkles, X, Heart, ShieldAlert, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  
  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mnc_logged_user');
    return saved ? JSON.parse(saved) : null;
  });

  // App active Tab router
  const [currentTab, setCurrentTab] = useState<string>('gallery');

  // Securely bound user role
  const [userRole, setUserRole] = useState<'administrateur' | 'visiteur'>(() => {
    const saved = localStorage.getItem('mnc_logged_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return u.role || 'visiteur';
      } catch (e) {
        return 'visiteur';
      }
    }
    return 'visiteur';
  });

  // DB States (Initialized from server API endpoints)
  const [oeuvres, setOeuvres] = useState<Oeuvre[]>([]);
  const [ethnies, setEthnies] = useState<Ethnie[]>([]);
  const [emplacements, setEmplacements] = useState<Emplacement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [comments, setComments] = useState<Commentaire[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [actualites, setActualites] = useState<Actualite[]>([]);

  // Find the active approved ticket for current visitor
  const activeVisitorTicket = currentUser && userRole === 'visiteur'
    ? tickets.find(t => t.email.toLowerCase() === currentUser.email.toLowerCase() && t.statut === 'valide')
    : null;

  // Backfill timestamp to validated tickets that don't have it yet to keep them from starting expired
  useEffect(() => {
    if (activeVisitorTicket && !activeVisitorTicket.activation_time) {
      const updateTicketOnServerTime = async () => {
        const updatedTime = Date.now();
        setTickets(prev => prev.map(t => {
          if (t.id_ticket === activeVisitorTicket.id_ticket) {
            return { ...t, activation_time: updatedTime };
          }
          return t;
        }));
        try {
          await fetch(`/api/tickets/${activeVisitorTicket.id_ticket}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: 'valide', activation_time: updatedTime })
          });
        } catch (err) {
          console.error(err);
        }
      };
      updateTicketOnServerTime();
    }
  }, [activeVisitorTicket, tickets]);

  const ticketActivationTime = activeVisitorTicket ? activeVisitorTicket.activation_time || null : null;

  // Synchronize currentUser session with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mnc_logged_user', JSON.stringify(currentUser));
      setUserRole(currentUser.role);
    } else {
      localStorage.removeItem('mnc_logged_user');
    }
  }, [currentUser]);

  // Handle auto-expiration check notifications
  useEffect(() => {
    if (!currentUser || userRole !== 'visiteur' || !ticketActivationTime) return;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = now - ticketActivationTime;
      const duration24h = 24 * 60 * 60 * 1000;
      if (elapsed > duration24h) {
        triggerNotification('Votre Pass d\'Accès 24h a expiré ! La session est maintenant verrouillée.', 'warn');
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentUser, userRole, ticketActivationTime]);

  // Simulation handlers
  const handleForceExpire = async () => {
    if (!currentUser) return;
    const expiredTime = Date.now() - 25 * 60 * 60 * 1000;
    setTickets(prev => prev.map(t => {
      if (t.email.toLowerCase() === currentUser.email.toLowerCase() && t.statut === 'valide') {
        return { ...t, activation_time: expiredTime };
      }
      return t;
    }));
    
    const targetT = tickets.find(t => t.email.toLowerCase() === currentUser.email.toLowerCase() && t.statut === 'valide');
    if (targetT) {
      try {
        await fetch(`/api/tickets/${targetT.id_ticket}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'valide', activation_time: expiredTime })
        });
      } catch (err) {
        console.error(err);
      }
    }
    triggerNotification('Simulation : Décompte expiré ! Votre Pass s\'interrompt d\'office.', 'warn');
  };

  const handleAddHours = async () => {
    if (!currentUser || !ticketActivationTime) return;
    const addedTime = ticketActivationTime + (2 * 60 * 60 * 1000);
    setTickets(prev => prev.map(t => {
      if (t.email.toLowerCase() === currentUser.email.toLowerCase() && t.statut === 'valide' && t.activation_time) {
        return { ...t, activation_time: addedTime };
      }
      return t;
    }));

    const targetT = tickets.find(t => t.email.toLowerCase() === currentUser.email.toLowerCase() && t.statut === 'valide');
    if (targetT) {
      try {
        await fetch(`/api/tickets/${targetT.id_ticket}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'valide', activation_time: addedTime })
        });
      } catch (err) {
        console.error(err);
      }
    }
    triggerNotification('Simulation : 2 heures ajoutées à votre pass d\'accès !', 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('visiteur');
    triggerNotification('Déconnexion réussie ! Merci d\'avoir visité notre patrimoine numérique.', 'info');
  };

  // Direct active work channel to pipe from Gallery inspection directly into 3D Virtual Tour
  const [tourDirectOeuvre, setTourDirectOeuvre] = useState<Oeuvre | null>(null);

  // General Notification toast notifications lists
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'success' | 'info' | 'warn' }[]>([]);

  // 1. Fetch States and Collections directly from dynamic backend endpoints
  useEffect(() => {
    // Recover Client Favorites list
    const favSaved = localStorage.getItem('mnc_favorites');
    if (favSaved) setFavorites(JSON.parse(favSaved));

    const loadAllServerData = async () => {
      try {
        const [rOeuvres, rEthnies, rEmplacements, rTickets, rComments, rActualites] = await Promise.all([
          fetch('/api/oeuvres').then(x => x.json()),
          fetch('/api/ethnies').then(x => x.json()),
          fetch('/api/emplacements').then(x => x.json()),
          fetch('/api/tickets').then(x => x.json()),
          fetch('/api/comments').then(x => x.json()),
          fetch('/api/actualites').then(x => x.json())
        ]);
        setOeuvres(rOeuvres);
        setEthnies(rEthnies);
        setEmplacements(rEmplacements);
        setTickets(rTickets);
        setComments(rComments);
        setActualites(rActualites);
      } catch (err) {
        console.warn('Erreur lors du chargement des APIs full-stack, re-génération locale:', err);
        // Fallback structures
        setOeuvres(INITIAL_OEUVRES);
        setEthnies(INITIAL_ETHNIES);
        setEmplacements(INITIAL_EMPLACEMENTS);
        setTickets(INITIAL_TICKETS);
        setComments(INITIAL_COMMENTAIRES);
        setActualites(INITIAL_ACTUALITES);
      }
    };

    loadAllServerData();

    // Trigger greeting notification
    triggerNotification('Bienvenue sur le portail du Musée des Civilisations ! Explorez nos galeries dorées.', 'info');
  }, []);

  // 2. Local syncing triggers (no massive writes if onServer)
  useEffect(() => {
    if (oeuvres.length > 0) localStorage.setItem('db_oeuvres', JSON.stringify(oeuvres));
  }, [oeuvres]);

  useEffect(() => {
    if (ethnies.length > 0) localStorage.setItem('db_ethnies', JSON.stringify(ethnies));
  }, [ethnies]);

  useEffect(() => {
    if (emplacements.length > 0) localStorage.setItem('db_emplacements', JSON.stringify(emplacements));
  }, [emplacements]);

  useEffect(() => {
    if (tickets.length > 0) localStorage.setItem('db_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    if (comments.length > 0) localStorage.setItem('db_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    if (actualites.length > 0) localStorage.setItem('db_actualites', JSON.stringify(actualites));
  }, [actualites]);

  // Handle Notifications toast appenders
  const triggerNotification = (message: string, type: 'success' | 'info' | 'warn' = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Automatically close after 4s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id_oeuvre: number) => {
    let newFavs: number[] = [];
    if (favorites.includes(id_oeuvre)) {
      newFavs = favorites.filter(f => f !== id_oeuvre);
      triggerNotification('Retiré de vos favoris personnels.', 'info');
    } else {
      newFavs = [...favorites, id_oeuvre];
      triggerNotification('Mis de côté dans vos précieux favoris !', 'success');
    }
    setFavorites(newFavs);
    localStorage.setItem('mnc_favorites', JSON.stringify(newFavs));
  };

  // Post Comment on detail popup
  const handleAddComment = async (newComment: Omit<Commentaire, 'id_commentaire' | 'date_commentaire'>) => {
    const finalComment = {
      ...newComment,
      date_commentaire: new Date().toISOString()
    };
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalComment)
      });
      const saved = await response.json();
      setComments(prev => [saved, ...prev.filter(c => c.id_commentaire !== saved.id_commentaire)]);
    } catch (e) {
      console.error(e);
      // fallback local update
      const nextId = comments.reduce((max, obj) => obj.id_commentaire > max ? obj.id_commentaire : max, 0) + 1;
      setComments(prev => [{ ...finalComment, id_commentaire: nextId }, ...prev]);
    }
    triggerNotification(`Livre d\'or signé par ${newComment.nom_user} !`, 'success');
  };

  // Reserve and booking dynamic ticket action
  const handleAddTicket = (unboundTicket: Omit<Ticket, 'id_ticket' | 'date_reservation' | 'code_unique'>): Ticket => {
    const nextId = tickets.reduce((max, obj) => obj.id_ticket > max ? obj.id_ticket : max, 0) + 1;
    const randomHash = Math.floor(10000 + Math.random() * 90000);
    const code = `TICK-MNC-${randomHash}-CI`;

    const finalTicket: Ticket = {
      ...unboundTicket,
      id_ticket: nextId,
      date_reservation: new Date().toISOString().split('T')[0],
      code_unique: code
    };

    // Optimistically update local application state
    setTickets(prev => [finalTicket, ...prev]);
    triggerNotification('Billet réservé ! Passez sur Console Admin pour l\'approuver.', 'success');

    // Sync database asynchronously in backend background thread
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalTicket)
    })
    .then(r => r.json())
    .then(saved => {
      // Re-map with the real persistent database record once saved
      setTickets(prev => prev.map(t => t.code_unique === code ? saved : t));
    })
    .catch(err => {
      console.error('Échec de synchronisation du ticket sur le serveur de base de données:', err);
    });

    return finalTicket;
  };

  // Launch virtual tour directly from a focused artwork inside the list
  const handleLaunchVirtualTourWithArtwork = (oeuvre: Oeuvre) => {
    setTourDirectOeuvre(oeuvre);
    setCurrentTab('virtual-tour');
    triggerNotification(`Focus orbital 3D initialisé sur : ${oeuvre.nom}`, 'info');
  };

  // Completely wipe all database inputs / elements
  const handleClearAllData = async () => {
    try {
      const response = await fetch('/api/clear-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setOeuvres([]);
        setEthnies([]);
        setEmplacements([]);
        setTickets([]);
        setComments([]);
        setActualites([]);
        
        // Remove individual state local storage items
        localStorage.removeItem('db_oeuvres');
        localStorage.removeItem('db_ethnies');
        localStorage.removeItem('db_emplacements');
        localStorage.removeItem('db_tickets');
        localStorage.removeItem('db_comments');
        localStorage.removeItem('db_actualites');

        triggerNotification('Base de données vidée intégralement !', 'success');
      } else {
        triggerNotification('Erreur serveur lors du vidage des données', 'warn');
      }
    } catch (e) {
      console.error(e);
      triggerNotification('Erreur réseau lors du vidage des données', 'warn');
    }
  };

  // Gate activation condition
  const isTicketActive = userRole === 'administrateur' || (ticketActivationTime !== null && (Date.now() - ticketActivationTime < 24 * 60 * 60 * 1000));

  // Helper to render content only if ticket is valid, else show the beautiful database gates
  const renderVisitorGateOrContent = (content: React.ReactNode, is3D = false) => {
    if (userRole === 'administrateur') {
      return content;
    }

    const visitorTicketsSorted = [...tickets]
      .filter(t => t.email.toLowerCase() === currentUser?.email.toLowerCase())
      .sort((a, b) => b.id_ticket - a.id_ticket);
    const visitorTicket = visitorTicketsSorted.length > 0 ? visitorTicketsSorted[0] : null;

    if (!visitorTicket) {
      // Case 1: No ticket has been reserved or paid for yet!
      return (
        <div className="py-12 bg-ivory-50">
          <div className="text-center max-w-md mx-auto mb-6 px-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F77F00] font-bold block mb-1 animate-pulse">
              🎫 Pass requis pour la visite
            </span>
            <h4 className="font-display font-black text-xl uppercase tracking-wider text-forest-950">
              Activez votre droit d&apos;entrée
            </h4>
            <p className="text-xs text-slate-500 font-light leading-relaxed mt-1">
              Le Musée des Civilisations est soumis à une authentification d&apos;accès temporaire. Veuillez acquérir un pass virtuel ou standard ci-dessous.
            </p>
          </div>
          <TicketGate 
            userEmail={currentUser?.email || ''}
            onUnlockSuccess={() => {
              // Create the ticket in 'en_attente' status!
              const ticketId = tickets.reduce((max, obj) => obj.id_ticket > max ? obj.id_ticket : max, 0) + 1;
              const newTicket: Ticket = {
                id_ticket: ticketId,
                nom_visiteur: currentUser?.username || currentUser?.email.split('@')[0] || 'Visiteur',
                email: currentUser?.email || '',
                date_visite: new Date().toISOString().split('T')[0],
                type_ticket: is3D ? 'virtuel' : 'standard',
                statut: 'en_attente',
                date_reservation: new Date().toISOString().split('T')[0],
                code_unique: `${is3D ? 'PASS-3D' : 'PASS-WEB'}-${Math.floor(10000 + Math.random() * 90000)}`,
                prix: is3D ? 1500 : 2000
              };
              setTickets(prev => [newTicket, ...prev]);
              triggerNotification('Billet réservé ! Votre accès est soumis à la validation administrative.', 'info');
            }}
            triggerNotification={triggerNotification}
          />
        </div>
      );
    }

    if (visitorTicket.statut === 'en_attente') {
      // Case 2: Ticket exists but is pending administrative validation!
      return (
        <div className="py-16 bg-ivory-50 max-w-2xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-500/30 shadow-2xl space-y-6 text-left"
          >
            <div className="mx-auto h-16 w-16 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-600 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            
            <div className="space-y-2 text-center">
              <span className="bg-orange-500/10 text-orange-700 font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                ⏳ Ticket En Attente de Validation
              </span>
              <h3 className="font-display font-black text-2xl text-forest-950 uppercase mt-2">
                Validation administrative requise
              </h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed max-w-md mx-auto">
                Votre transaction de {visitorTicket.prix.toLocaleString()} FCFA pour le ticket <strong className="font-mono text-[11px] text-orange-600 bg-orange-50 px-1 rounded">{visitorTicket.code_unique}</strong> a été enregistrée avec succès.
              </p>
            </div>

            <div className="bg-forest-950 text-white p-5 rounded-2xl border border-gold-500/20 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                🛠️ Mode Simulateur AI Studio - Étape d&apos;approbation
              </span>
              <p className="text-[11px] text-ivory-200 font-light leading-relaxed">
                Afin de tester le parcours d&apos;approbation comme demandé dans votre cahier des charges :
              </p>
              <ol className="text-[11px] space-y-1.5 pl-4 list-decimal text-gold-300 font-medium">
                <li>Basculez le bouton <strong>&quot;Simulateur&quot;</strong> en haut à droite vers le mode <strong>Administrateur</strong> (l&apos;interrupteur passera au orange).</li>
                <li>Cliquez sur l&apos;onglet <strong>&quot;Console Admin&quot;</strong> apparu dans la barre de navigation.</li>
                <li>Rendez-vous dans la sous-rubrique <strong>&quot;Entrées &amp; Billets&quot;</strong>, puis cliquez sur <strong>&quot;Approuver&quot;</strong> à côté de votre ticket d&apos;email <strong>{currentUser?.email}</strong>.</li>
                <li>Revenez ensuite en mode Visiteur pour explorer le musée !</li>
              </ol>
            </div>

            <div className="flex justify-center gap-3 pt-2 text-[10px] font-mono text-gray-400 border-t border-gray-100">
              <span>Code : {visitorTicket.code_unique}</span>
              <span>•</span>
              <span>Propriétaire : {visitorTicket.email}</span>
            </div>
          </motion.div>
        </div>
      );
    }

    if (visitorTicket.statut === 'refuse') {
      // Case 3: Ticket refused!
      return (
        <div className="py-16 bg-ivory-50 max-w-md mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 border-2 border-rose-500/20 shadow-xl space-y-5"
          >
            <div className="mx-auto h-12 w-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5 animate-fadeIn">
              <h4 className="font-display font-black text-lg text-slate-900 uppercase">
                Demande de ticket refusée
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Malheureusement, le ticket d&apos;accès <span className="font-mono">{visitorTicket.code_unique}</span> a été rejeté par l&apos;administration ou la transaction Mobile Money a échoué.
              </p>
            </div>

            <button
              onClick={() => {
                // Delete previous ticket and let them try again!
                setTickets(prev => prev.filter(t => t.id_ticket !== visitorTicket.id_ticket));
                triggerNotification('Billet archivé, vous pouvez repasser commande.', 'info');
              }}
              className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Réserver un nouveau billet
            </button>
          </motion.div>
        </div>
      );
    }

    // Case 4: Valid ticket, but let's check for 24-hour expiration!
    const activationTime = visitorTicket.activation_time || 0;
    const isExpired = activationTime > 0 && (Date.now() - activationTime >= 24 * 60 * 60 * 1000);

    if (isExpired) {
      return (
        <div className="py-16 bg-ivory-50 max-w-md mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 border-2 border-amber-500/35 shadow-xl space-y-5 animate-shake"
          >
            <div className="mx-auto h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6 animate-spin" />
            </div>
            
            <div className="space-y-1.5 col-span-1">
              <span className="bg-amber-100 text-amber-805 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">Pass Expiré (24h)</span>
              <h4 className="font-display font-black text-lg text-slate-900 uppercase mt-1">
                Votre session a expiré !
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Le droit d&apos;accès temporaire de 24 heures rattaché au code <strong className="font-mono">{visitorTicket.code_unique}</strong> a pris fin d&apos;office. Réservez un nouveau pass pour reprendre vos visites.
              </p>
            </div>

            <button
              onClick={() => {
                // Remove expired ticket so they can order a fresh one
                setTickets(prev => prev.filter(t => t.id_ticket !== visitorTicket.id_ticket));
                triggerNotification('Ancien pass nettoyé, vous pouvez commander un nouveau ticket.', 'info');
              }}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Commander un nouveau pass 24h
            </button>
          </motion.div>
        </div>
      );
    }

    // Active pass! Grant view of component
    return content;
  };

  // If no user is authenticated, redirect to registration & login screen first
  if (!currentUser) {
    return (
      <div id="mnc-ivory-coast-anon">
        {/* Absolute floating notifications queue */}
        <div id="floating-toaster-room" className="fixed top-6 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="p-4 bg-forest-950 text-white rounded-xl shadow-2xl border border-gold-500/30 flex items-start gap-2.5 pointer-events-auto"
              >
                <div className="shrink-0 pt-0.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs font-mono tracking-tight leading-relaxed text-left flex-1">
                  {notif.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AuthScreen 
          onLoginSuccess={(user) => setCurrentUser(user)} 
          triggerNotification={triggerNotification} 
        />
      </div>
    );
  }

  return (
    <div id="mnc-ivory-coast-root" className="min-h-screen bg-ivory-50 text-ivory-900 font-sans flex flex-col justify-between">
      
      {/* Absolute floating notifications queue */}
      <div id="floating-toaster-room" className="fixed top-24 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="p-4 bg-forest-950 text-white rounded-xl shadow-2xl border border-gold-500/30 flex items-start gap-2.5 pointer-events-auto"
            >
              <div className="shrink-0 pt-0.5">
                {notif.type === 'success' ? (
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                ) : notif.type === 'warn' ? (
                  <ShieldAlert className="w-4 h-4 text-orange-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-orange-400" />
                )}
              </div>
              <p className="text-xs font-mono tracking-tight leading-relaxed text-left flex-1">
                {notif.message}
              </p>
              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-gray-400 hover:text-white shrink-0 text-xs"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main layout Header Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={(role) => {
          setUserRole(role);
          triggerNotification(`Mode d'affichage basculé vers : ${role === 'administrateur' ? 'Administrateur (Accès complet CRUD)' : 'Visiteur Spécifique'}`, 'info');
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        ticketActivationTime={ticketActivationTime}
        onForceExpire={handleForceExpire}
        onAddHours={handleAddHours}
      />

      {/* Hero display on Home (Displays on gallery tab) */}
      {currentTab === 'gallery' && (
        <Hero 
          onExploreClick={() => {
            const el = document.getElementById('museum-gallery');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onVirtualTourClick={() => setCurrentTab('virtual-tour')}
        />
      )}

      {/* Core Dynamic Content Hub under tabs router */}
      <main id="app-main-content" className="flex-1 min-h-[500px]">
        {currentTab === 'gallery' && renderVisitorGateOrContent(
          <Gallery 
            oeuvres={oeuvres}
            ethnies={ethnies}
            emplacements={emplacements}
            comments={comments}
            onAddComment={handleAddComment}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onLaunchVirtualTour={handleLaunchVirtualTourWithArtwork}
          />,
          false
        )}

        {currentTab === 'virtual-tour' && renderVisitorGateOrContent(
          <VirtualTour 
            oeuvres={oeuvres}
            ethnies={ethnies}
            initialActiveOeuvre={tourDirectOeuvre}
          />,
          true
        )}

        {currentTab === 'ticketing' && (
          <Ticketing 
            tickets={tickets}
            onAddTicket={handleAddTicket}
          />
        )}

        {currentTab === 'news' && (
          <NewsPanel 
            actualites={actualites}
          />
        )}

        {currentTab === 'admin-dashboard' && userRole === 'administrateur' && (
          <AdminDashboard 
            oeuvres={oeuvres}
            setOeuvres={setOeuvres}
            ethnies={ethnies}
            setEthnies={setEthnies}
            emplacements={emplacements}
            setEmplacements={setEmplacements}
            tickets={tickets}
            setTickets={setTickets}
            commentsCount={comments.length}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Bottom Footer bar */}
      <Footer setCurrentTab={setCurrentTab} />

    </div>
  );
}
