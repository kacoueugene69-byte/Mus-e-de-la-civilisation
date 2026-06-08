/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Oeuvre, Ethnie, Emplacement, Ticket } from '../types';
import { 
  ShieldAlert, Landmark, Users, Ticket as TicketIcon, Compass, Sparkles, Plus, Edit, Trash2, 
  MapPin, Check, X, ShieldCheck, Thermometer, Droplet, LayoutGrid, Award, Info, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  oeuvres: Oeuvre[];
  setOeuvres: React.Dispatch<React.SetStateAction<Oeuvre[]>>;
  ethnies: Ethnie[];
  setEthnies: React.Dispatch<React.SetStateAction<Ethnie[]>>;
  emplacements: Emplacement[];
  setEmplacements: React.Dispatch<React.SetStateAction<Emplacement[]>>;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  commentsCount: number;
  onClearAllData?: () => void;
}

export default function AdminDashboard({
  oeuvres,
  setOeuvres,
  ethnies,
  setEthnies,
  emplacements,
  setEmplacements,
  tickets,
  setTickets,
  commentsCount,
  onClearAllData
}: AdminDashboardProps) {
  
  // Tab states for submodules in the Admin desk
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'system-metrics' | 'crud-oeuvres' | 'crud-ethnies' | 'crud-emplacements' | 'queue-tickets'>('system-metrics');

  // Form states for creating/editing artworks
  const [editingOeuvre, setEditingOeuvre] = useState<Oeuvre | null>(null);
  const [showOeuvreForm, setShowOeuvreForm] = useState(false);
  const [oeuvreForm, setOeuvreForm] = useState<Omit<Oeuvre, 'id_oeuvre'>>({
    nom: '',
    description: '',
    type_oeuvre: 'Masque',
    taille: '40 cm',
    date_reception: new Date().toISOString().split('T')[0],
    id_ethnie: 1,
    id_emplacement: 2,
    image_principale: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    modele_3D: '',
    audio_description: 'Vous écoutez le guide audio de cette œuvre du patrimoine national.',
    audio_duration: '1:40',
    region_ivoirienne: 'Côte d\'Ivoire',
    popularity: 50,
    annee_creation: 'XXe siècle'
  });

  // Form states for creating/editing ethnies
  const [editingEthnie, setEditingEthnie] = useState<Ethnie | null>(null);
  const [showEthnieForm, setShowEthnieForm] = useState(false);
  const [ethnieForm, setEthnieForm] = useState<Omit<Ethnie, 'id_ethnie'>>({
    nom: '',
    description: '',
    region_origine: 'Côte d\'Ivoire',
    rituel_principal: 'Rituels sacrés',
    art_caracteristique: 'Sculptures de prestige',
    image_url: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=600'
  });

  // Form states for creating/editing physical locations
  const [editingEmplacement, setEditingEmplacement] = useState<Emplacement | null>(null);
  const [showEmplacementForm, setShowEmplacementForm] = useState(false);
  const [emplacementForm, setEmplacementForm] = useState<Omit<Emplacement, 'id_emplacement'>>({
    nom: '',
    description: '',
    capacity: 30,
    temperature: '21°C',
    humidite: '45%'
  });

  // Action: Approve or reject visitor tickets dynamically
  const handleSetTicketStatus = async (id_ticket: number, newStatut: 'valide' | 'refuse') => {
    setTickets(prev => prev.map(t => t.id_ticket === id_ticket ? { ...t, statut: newStatut } : t));
    try {
      await fetch(`/api/tickets/${id_ticket}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatut })
      });
    } catch (err) {
      console.error('Erreur API ticket status:', err);
    }
  };

  // Action: Add or Edit artwork
  const handleSaveOeuvre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oeuvreForm.nom.trim()) return;

    const bodyPayload = editingOeuvre 
      ? { ...oeuvreForm, id_oeuvre: editingOeuvre.id_oeuvre }
      : oeuvreForm;

    try {
      const response = await fetch('/api/oeuvres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const saved = await response.json();
      if (editingOeuvre) {
        setOeuvres(prev => prev.map(o => o.id_oeuvre === editingOeuvre.id_oeuvre ? saved : o));
      } else {
        setOeuvres(prev => [...prev, saved]);
      }
    } catch (err) {
      console.error(err);
      // fallback
      if (editingOeuvre) {
        setOeuvres(prev => prev.map(o => o.id_oeuvre === editingOeuvre.id_oeuvre ? { ...oeuvreForm, id_oeuvre: o.id_oeuvre } : o));
      } else {
        const nextId = oeuvres.reduce((max, obj) => obj.id_oeuvre > max ? obj.id_oeuvre : max, 0) + 1;
        setOeuvres(prev => [...prev, { ...oeuvreForm, id_oeuvre: nextId }]);
      }
    }
    
    // Clean up forms
    setShowOeuvreForm(false);
    setEditingOeuvre(null);
    setOeuvreForm({
      nom: '',
      description: '',
      type_oeuvre: 'Masque',
      taille: '40 cm',
      date_reception: new Date().toISOString().split('T')[0],
      id_ethnie: 1,
      id_emplacement: 2,
      image_principale: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
      image_2D: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
      modele_3D: '',
      audio_description: 'Vous écoutez le guide audio de cette œuvre du patrimoine national.',
      audio_duration: '1:40',
      region_ivoirienne: 'Côte d\'Ivoire',
      popularity: 50,
      annee_creation: 'XXe siècle'
    });
  };

  const handleStartEditOeuvre = (o: Oeuvre) => {
    setEditingOeuvre(o);
    setOeuvreForm({ ...o });
    setShowOeuvreForm(true);
  };

  const handleDeleteOeuvre = async (id: number) => {
    if (confirm('Voulez-vous vraiment ranger cette œuvre aux archives (suppression finale de la vitrine)?')) {
      setOeuvres(prev => prev.filter(o => o.id_oeuvre !== id));
      try {
        await fetch(`/api/oeuvres/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Action: Add or Edit cultures (Ethnie)
  const handleSaveEthnie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ethnieForm.nom.trim()) return;

    const bodyPayload = editingEthnie
      ? { ...ethnieForm, id_ethnie: editingEthnie.id_ethnie }
      : ethnieForm;

    try {
      const response = await fetch('/api/ethnies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const saved = await response.json();
      if (editingEthnie) {
        setEthnies(prev => prev.map(eth => eth.id_ethnie === editingEthnie.id_ethnie ? saved : eth));
      } else {
        setEthnies(prev => [...prev, saved]);
      }
    } catch (err) {
      console.error(err);
      if (editingEthnie) {
        setEthnies(prev => prev.map(eth => eth.id_ethnie === editingEthnie.id_ethnie ? { ...ethnieForm, id_ethnie: eth.id_ethnie } : eth));
      } else {
        const nextId = ethnies.reduce((max, obj) => obj.id_ethnie > max ? obj.id_ethnie : max, 0) + 1;
        setEthnies(prev => [...prev, { ...ethnieForm, id_ethnie: nextId }]);
      }
    }

    setShowEthnieForm(false);
    setEditingEthnie(null);
    setEthnieForm({
      nom: '',
      description: '',
      region_origine: 'Côte d\'Ivoire',
      rituel_principal: 'Rituels sacrés',
      art_caracteristique: 'Sculptures de prestige',
      image_url: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=600'
    });
  };

  const handleStartEditEthnie = (e: Ethnie) => {
    setEditingEthnie(e);
    setEthnieForm({ ...e });
    setShowEthnieForm(true);
  };

  const handleDeleteEthnie = async (id: number) => {
    if (confirm('Supprimer cette ethnie ? Cette action n\'altère pas les œuvres existantes.')) {
      setEthnies(prev => prev.filter(eth => eth.id_ethnie !== id));
      try {
        await fetch(`/api/ethnies/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Action: Add or Edit rooms (Emplacement)
  const handleSaveEmplacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emplacementForm.nom.trim()) return;

    const bodyPayload = editingEmplacement
      ? { ...emplacementForm, id_emplacement: editingEmplacement.id_emplacement }
      : emplacementForm;

    try {
      const response = await fetch('/api/emplacements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const saved = await response.json();
      if (editingEmplacement) {
        setEmplacements(prev => prev.map(em => em.id_emplacement === editingEmplacement.id_emplacement ? saved : em));
      } else {
        setEmplacements(prev => [...prev, saved]);
      }
    } catch (err) {
      console.error(err);
      if (editingEmplacement) {
        setEmplacements(prev => prev.map(em => em.id_emplacement === editingEmplacement.id_emplacement ? { ...emplacementForm, id_emplacement: em.id_emplacement } : em));
      } else {
        const nextId = emplacements.reduce((max, obj) => obj.id_emplacement > max ? obj.id_emplacement : max, 0) + 1;
        setEmplacements(prev => [...prev, { ...emplacementForm, id_emplacement: nextId }]);
      }
    }

    setShowEmplacementForm(false);
    setEditingEmplacement(null);
    setEmplacementForm({
      nom: '',
      description: '',
      capacity: 30,
      temperature: '21°C',
      humidite: '45%'
    });
  };

  const handleStartEditEmplacement = (em: Emplacement) => {
    setEditingEmplacement(em);
    setEmplacementForm({ ...em });
    setShowEmplacementForm(true);
  };

  const handleDeleteEmplacement = async (id: number) => {
    if (confirm('Supprimer cette galerie ?')) {
      setEmplacements(prev => prev.filter(em => em.id_emplacement !== id));
      try {
        await fetch(`/api/emplacements/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-ivory-50 text-left">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gold-805/10 pb-6 mb-8 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full text-orange-700 text-xs font-mono font-medium max-w-max">
            <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
            <span>CONSOLE PRIVÉE DE GESTION DU PATRIMOINE DU MUSÉE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ivory-900 uppercase mt-2">
            Tableau de Bord Administratif
          </h2>
        </div>

        {/* Action switch toolbar tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveAdminSubTab('system-metrics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all ${
              activeAdminSubTab === 'system-metrics'
                ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                : 'bg-white text-gold-900 hover:bg-gold-50 border border-gold-600/10'
            }`}
          >
            📊 Analyses &amp; Stats
          </button>
          
          <button
            onClick={() => setActiveAdminSubTab('crud-oeuvres')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all ${
              activeAdminSubTab === 'crud-oeuvres'
                ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                : 'bg-white text-gold-900 hover:bg-gold-50 border border-gold-600/10'
            }`}
          >
            🏺 Gérer Œuvres
          </button>

          <button
            onClick={() => setActiveAdminSubTab('crud-ethnies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all ${
              activeAdminSubTab === 'crud-ethnies'
                ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                : 'bg-white text-gold-900 hover:bg-gold-50 border border-gold-600/10'
            }`}
          >
            👥 Ethnies
          </button>

          <button
            onClick={() => setActiveAdminSubTab('crud-emplacements')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all ${
              activeAdminSubTab === 'crud-emplacements'
                ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                : 'bg-white text-gold-900 hover:bg-gold-50 border border-gold-600/10'
            }`}
          >
            🏢 Salles &amp; Galeries
          </button>

          <button
            onClick={() => setActiveAdminSubTab('queue-tickets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all relative ${
              activeAdminSubTab === 'queue-tickets'
                ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white shadow-md'
                : 'bg-white text-gold-900 hover:bg-gold-50 border border-gold-600/10'
            }`}
          >
            🎫 Tickets
            {tickets.filter(t => t.statut === 'en_attente').length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] text-white font-bold animate-bounce font-sans">
                {tickets.filter(t => t.statut === 'en_attente').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: ANALYSIS & EXECUTIVE DASHBOARD STATISTICS CARDS */}
      {activeAdminSubTab === 'system-metrics' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main 5 stat metrics cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {/* Card 1: Artworks */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 text-orange-600 rounded-xl shrink-0">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Œuvres</span>
                <p className="text-2xl font-display font-bold text-slate-900">{oeuvres.length}</p>
              </div>
            </div>

            {/* Card 2: Ethnies */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-gold-500/10 text-gold-600 rounded-xl shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Ethnies</span>
                <p className="text-2xl font-display font-bold text-slate-900">{ethnies.length}</p>
              </div>
            </div>

            {/* Card 3: Visites Virtuelles click simulator */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Visites V-3D</span>
                <p className="text-2xl font-display font-bold text-emerald-600">
                  {oeuvres.reduce((acc, curr) => acc + curr.popularity, 0) * 8}
                </p>
              </div>
            </div>

            {/* Card 4: Tickets Queue */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl shrink-0">
                <TicketIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Total Billets</span>
                <p className="text-2xl font-display font-bold text-slate-900">{tickets.length}</p>
              </div>
            </div>

            {/* Card 5: Comments Book counts */}
            <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="p-3 bg-rose-500/10 text-rose-600 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Avis d&apos;or</span>
                <p className="text-2xl font-display font-bold text-slate-900">{commentsCount}</p>
              </div>
            </div>

          </div>

          {/* Graphical Analytics panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Graph Panel: Distribution per Culture */}
            <div className="bg-white rounded-2xl p-6 border border-gold-600/10 shadow-sm text-left">
              <h3 className="font-display font-bold text-sm text-gold-900 tracking-wider uppercase mb-5">
                Distribution du catalogue par Culture d&apos;Afrique de l&apos;Ouest
              </h3>

              <div className="space-y-4">
                {ethnies.map(eth => {
                  const itemsCount = oeuvres.filter(o => o.id_ethnie === eth.id_ethnie).length;
                  const pct = Math.max(8, oeuvres.length > 0 ? (itemsCount / oeuvres.length) * 100 : 0);

                  return (
                    <div key={eth.id_ethnie} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-ivory-900">{eth.nom}</span>
                        <span className="font-mono text-gray-500 font-bold">{itemsCount} pièces ({Math.round(pct)}%)</span>
                      </div>
                      
                      <div className="w-full bg-ivory-100 h-3 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-gold-400 h-full rounded-full" 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Graph Panel: Environmental statuses of rooms (Hygrometry, Climate safety) */}
            <div className="bg-white rounded-2xl p-6 border border-gold-600/10 shadow-sm text-left col-span-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gold-800/10 pb-3 mb-4">
                  <h3 className="font-display font-bold text-sm text-gold-900 tracking-wider uppercase">
                    Monitoring Climatologique des Salles Officielles
                  </h3>
                  <span className="bg-emerald-500 text-white font-mono text-[8px] tracking-widest px-2 py-0.5 rounded">AUTO SECURE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {emplacements.map(em => (
                    <div key={em.id_emplacement} className="bg-ivory-100/60 p-3 rounded-xl border border-gold-800/10 text-xs text-left">
                      <p className="font-bold text-ivory-900 truncate">{em.nom}</p>
                      
                      <div className="flex items-center gap-4 mt-2 font-mono text-[10px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-orange-500" /> {em.temperature}
                        </span>
                        <span className="flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-blue-500" /> {em.humidite}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300/30 rounded-xl flex items-center justify-between text-[11px] text-emerald-800">
                <span className="font-medium">Statut climatologique général des vitrines :</span>
                <span className="font-mono font-bold uppercase tracking-widest text-[9.5px] bg-emerald-500 text-white px-2.5 py-0.5 rounded">OFFICIEL STABLE</span>
              </div>
            </div>

          </div>

          {/* Quick info advisory instructions banner */}
          <div className="bg-gradient-to-r from-forest-950 to-forest-900 text-gold-100 rounded-2xl p-5 border border-gold-800/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left max-w-xl">
              <span className="text-[9px] font-mono tracking-widest text-gold-400 font-bold uppercase">RAPPORT PATRIMOINE CI</span>
              <h4 className="font-display font-bold text-lg text-white mt-0.5 uppercase">Lancement de la phase d&apos;audit trimestrial</h4>
              <p className="text-xs font-light text-ivory-300 leading-normal mt-1">
                La numérisation des œuvres en format GLB progresse. Veillez à cataloguer consciencieusement l&apos;origine culturelle et l&apos;explicatif audio-narratif pour de meilleures performances sur les moteurs de synthèse vocale.
              </p>
            </div>
            
            <button 
              onClick={() => setActiveAdminSubTab('crud-oeuvres')} 
              className="px-4.5 py-2.5 bg-gradient-to-r from-orange-500 to-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shrink-0"
            >
              Ajouter une œuvre
            </button>
          </div>

          {/* System Maintenance / Danger Zone */}
          <div className="bg-red-50 border border-red-200/60 rounded-2xl p-6 text-left space-y-4">
            <div>
              <span className="text-[8.5px] font-mono font-bold tracking-widest bg-red-100 text-red-600 px-2 py-0.5 rounded">
                MAINTENANCE & SÉCURITÉ SYSTEME
              </span>
              <h4 className="font-display font-extrabold text-base text-red-950 uppercase mt-1.5 flex items-center gap-1.5">
                ⚠️ Zone de Danger : Purger les Données
              </h4>
              <p className="text-xs text-red-800 mt-1">
                Cette option permet d&apos;effacer instantanément et définitivement toutes les données enregistrées dans la base de données (œuvres cataloguées, origines ethniques, galeries d&apos;exposition, réservations de tickets, et commentaires du livre d&apos;or) à l&apos;exception des comptes d&apos;accès administrateur et visiteur de test obligatoires.
              </p>
            </div>
            
            <button
              onClick={() => {
                const firstConfirm = window.confirm("🚨 Êtes-vous ABSOLUMENT SÛR de vouloir VIDER TOUTES les données de l'application ? Cette action est irréversible.");
                if (firstConfirm) {
                  const secondConfirm = window.confirm("🔥 ATTENTION ! Toutes les œuvres 3D, les cultures d&apos;Afrique de l&apos;Ouest, les salles d&apos;exposition, les billets et les avis d&apos;or seront définitivement purgés de la base de données. Confirmer le vidage ?");
                  if (secondConfirm && onClearAllData) {
                    onClearAllData();
                  }
                }
              }}
              className="px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm relative hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>🚨 Vider toutes les données de l&apos;application</span>
            </button>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: ARTWORKS IMMERSIVE MANAGER (CRUD) */}
      {activeAdminSubTab === 'crud-oeuvres' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-slate-950 uppercase">
              Catalogue Général des Chefs d&apos;œuvre ({oeuvres.length})
            </h3>
            
            <button
              onClick={() => {
                setEditingOeuvre(null);
                setShowOeuvreForm(true);
              }}
              className="px-4 py-2.5 bg-forest-900 border border-gold-800/20 text-white hover:bg-forest-950 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Ajouter une pièce d&apos;art
            </button>
          </div>

          {/* COLLAPSIBLE Form container row */}
          <AnimatePresence>
            {showOeuvreForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-5 border border-gold-600/20 shadow-md text-left"
              >
                <div className="flex items-center justify-between border-b border-gold-800/10 pb-3 mb-4">
                  <h4 className="font-display font-bold text-gold-900 uppercase">
                    {editingOeuvre ? `Modifier la fiche : ${editingOeuvre.nom}` : 'Ajouter un artefact au musée'}
                  </h4>
                  <button 
                    onClick={() => { setShowOeuvreForm(false); setEditingOeuvre(null); }}
                    className="text-gray-400 hover:text-gray-600 text-xs font-mono"
                  >
                    Annuler
                  </button>
                </div>

                <form onSubmit={handleSaveOeuvre} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Nom de l&apos;œuvre</label>
                    <input
                      type="text"
                      value={oeuvreForm.nom}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, nom: e.target.value })}
                      placeholder="Ex. Masque Goli"
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg outline-none border border-gold-800/10 focus:ring-1 focus:ring-gold-500 text-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Artéfact Type</label>
                    <select
                      value={oeuvreForm.type_oeuvre}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, type_oeuvre: e.target.value as any })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10 focus:ring-1 focus:ring-gold-500"
                    >
                      <option value="Masque">Masque Sacré / Cérémonial</option>
                      <option value="Sculpture">Sculpture Totémique / Statue</option>
                      <option value="Ornement / Bijou">Orfèvrerie Royale / Bijou</option>
                      <option value="Instrument">Instrument traditionnel</option>
                      <option value="Parure">Parure Vestimentaire</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Région ivoirienne d&apos;origine</label>
                    <input
                      type="text"
                      value={oeuvreForm.region_ivoirienne}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, region_ivoirienne: e.target.value })}
                      placeholder="Ex. Marahoué (Bouaflé)"
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Taille/Dimensions</label>
                    <input
                      type="text"
                      value={oeuvreForm.taille}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, taille: e.target.value })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Période création</label>
                    <input
                      type="text"
                      value={oeuvreForm.annee_creation}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, annee_creation: e.target.value })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Date de réception</label>
                    <input
                      type="date"
                      value={oeuvreForm.date_reception}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, date_reception: e.target.value })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Groupe Ethnie</label>
                    <select
                      value={oeuvreForm.id_ethnie}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, id_ethnie: Number(e.target.value) })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    >
                      {ethnies.map(eth => (
                        <option key={eth.id_ethnie} value={eth.id_ethnie}>{eth.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Galerie Affectation (Room)</label>
                    <select
                      value={oeuvreForm.id_emplacement}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, id_emplacement: Number(e.target.value) })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    >
                      {emplacements.map(em => (
                        <option key={em.id_emplacement} value={em.id_emplacement}>{em.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Score Popularité (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={oeuvreForm.popularity}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, popularity: Number(e.target.value) })}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-3 flex flex-col space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Description Historique &amp; Cosmologique</label>
                    <textarea
                      value={oeuvreForm.description}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, description: e.target.value })}
                      placeholder="Indiquez l'interprétation spirituelle de cet artéfact..."
                      rows={3}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10 w-full"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-3 flex flex-col space-y-1.5 font-sans">
                    <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Narratif Audio-Guide (Texte lu par la voix de synthèse)</label>
                    <textarea
                      value={oeuvreForm.audio_description}
                      onChange={(e) => setOeuvreForm({ ...oeuvreForm, audio_description: e.target.value })}
                      rows={2}
                      className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10 w-full"
                    />
                  </div>

                  {/* Visual media fields: 2D and 3D paths */}
                  <div className="col-span-1 md:col-span-3 border-t border-gold-500/10 pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn font-sans">
                    <div className="col-span-1 md:col-span-3 mb-1">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#009B77] block">
                        📸 Ajouter l&apos;image ou la photo de l&apos;œuvre (Vues 2D et 3D)
                      </span>
                    </div>

                    {/* Photo suggestions selector for easier demo-ing */}
                    <div className="col-span-1 md:col-span-3 text-left">
                      <span className="text-[9px] font-mono text-gray-400 block mb-1.5">
                        💡 Raccourcis de photothèque ivoirienne (cliquez pour remplir l&apos;url automatiquement) :
                      </span>
                      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-thin">
                        {[
                          { label: 'Masque Baoulé', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800' },
                          { label: 'Masque Dan', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800' },
                          { label: 'Statuette Senoufo', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800' },
                          { label: 'Plaid Doré Akan', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800' },
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => {
                              setOeuvreForm({ 
                                ...oeuvreForm, 
                                image_principale: p.url,
                                image_2D: p.url
                              });
                            }}
                            className="shrink-0 p-1 bg-white hover:bg-gold-50/50 border border-gold-800/10 hover:border-gold-500 rounded-lg text-[9px] font-mono font-bold text-slate-800 flex items-center gap-1.5 transition-all text-left"
                          >
                            <img src={p.url} className="w-5 h-5 rounded object-cover" alt="" referrerPolicy="no-referrer" />
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5 border border-gold-800/10 p-3 bg-white rounded-xl">
                      <label className="text-[10px] font-mono font-bold text-[#009B77] uppercase block mb-1">
                        Ajouter Photo Principale (Couverture)
                      </label>
                      {/* Drag & drop file selector block */}
                      <div className="border-2 border-dashed border-gold-805/20 hover:border-[#009b77] bg-ivory-100/50 rounded-xl p-3 text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center min-h-[90px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setOeuvreForm({ ...oeuvreForm, image_principale: event.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {oeuvreForm.image_principale && oeuvreForm.image_principale.startsWith('data:image') ? (
                          <div className="flex flex-col items-center space-y-1">
                            <img src={oeuvreForm.image_principale} className="w-12 h-12 rounded object-cover border border-gold-500 shadow-sm" alt="upl" referrerPolicy="no-referrer" />
                            <span className="text-[9px] text-[#009B77] font-bold font-mono">✓ Image chargée (PC)</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-lg">📁</span>
                            <span className="text-[10px] font-bold text-slate-800">Charger du PC</span>
                            <span className="text-[8px] text-gray-400">Glisser ou cliquer ici</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={oeuvreForm.image_principale}
                        onChange={(e) => setOeuvreForm({ ...oeuvreForm, image_principale: e.target.value })}
                        placeholder="Ex. https://image.com/photo_sacre.jpg"
                        className="text-[10px] p-2 bg-ivory-100 rounded-lg border border-gold-800/10 text-slate-900 w-full"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5 border border-gold-800/10 p-3 bg-white rounded-xl">
                      <label className="text-[10px] font-mono font-bold text-[#009B77] uppercase block mb-1">
                        Photo Exposition Plane (2D)
                      </label>
                      {/* Drag & drop file selector block */}
                      <div className="border-2 border-dashed border-gold-805/20 hover:border-[#009b77] bg-ivory-100/50 rounded-xl p-3 text-center cursor-pointer transition-colors relative flex flex-col items-center justify-center min-h-[90px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setOeuvreForm({ ...oeuvreForm, image_2D: event.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        {oeuvreForm.image_2D && oeuvreForm.image_2D.startsWith('data:image') ? (
                          <div className="flex flex-col items-center space-y-1">
                            <img src={oeuvreForm.image_2D} className="w-12 h-12 rounded object-cover border border-gold-500 shadow-sm" alt="upl" referrerPolicy="no-referrer" />
                            <span className="text-[9px] text-[#009B77] font-bold font-mono">✓ Image chargée (PC)</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-lg">📁</span>
                            <span className="text-[10px] font-bold text-slate-800">Charger du PC</span>
                            <span className="text-[8px] text-gray-400">Glisser ou cliquer ici</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={oeuvreForm.image_2D}
                        onChange={(e) => setOeuvreForm({ ...oeuvreForm, image_2D: e.target.value })}
                        placeholder="Ex. https://image.com/photo_expo_2d.jpg"
                        className="text-[10px] p-2 bg-ivory-100 rounded-lg border border-gold-800/10 text-slate-900 w-full"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5 border border-gold-800/10 p-3 bg-white rounded-xl">
                      <label className="text-[10px] font-mono font-bold text-gold-850 uppercase block mb-1.5">
                        Modèle Virtuel Interactif (3D)
                      </label>
                      <div className="bg-ivory-100/50 rounded-xl p-3 flex flex-col justify-center min-h-[90px]">
                        <span className="text-[9px] text-gray-400 block mb-1">
                          🔒 Modèle par défaut pré-configuré ou lien GLB (.glb) :
                        </span>
                        <input
                          type="text"
                          value={oeuvreForm.modele_3D || ''}
                          onChange={(e) => setOeuvreForm({ ...oeuvreForm, modele_3D: e.target.value })}
                          placeholder="Ex. masques/baoule_3d.glb"
                          className="text-[10px] p-2 bg-white rounded-lg border border-gold-800/10 text-slate-900 font-mono w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3 flex justify-end gap-3.5 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowOeuvreForm(false); setEditingOeuvre(null); }}
                      className="px-4 py-2 text-xs font-bold uppercase hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase"
                    >
                      Enregistrer Pièce
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table display list of artworks for Admin oversight */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gold-600/10 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800 border-collapse">
                <thead className="bg-ivory-100 text-gold-850 font-mono text-[10px] tracking-wider uppercase border-b border-gold-800/10">
                  <tr>
                    <th className="p-4">Artefact</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Ethnie</th>
                    <th className="p-4">Région CIV</th>
                    <th className="p-4 text-center">Visites simulées/Score</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-800/5">
                  {oeuvres.map(o => {
                    const ethName = ethnies.find(e => e.id_ethnie === o.id_ethnie)?.nom || "Inconnu";
                    return (
                      <tr key={o.id_oeuvre} className="hover:bg-ivory-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={o.image_principale}
                            alt={o.nom}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-gold-800/10"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{o.nom}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{o.annee_creation || 'Ages indéterminé'}</p>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-500">{o.type_oeuvre}</td>
                        <td className="p-4 text-gold-900 font-medium">{ethName}</td>
                        <td className="p-4 text-gray-500">{o.region_ivoirienne}</td>
                        <td className="p-4 text-center font-mono font-semibold text-emerald-700 bg-emerald-500/5">
                          ⭐ {o.popularity} / 100
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEditOeuvre(o)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOeuvre(o.id_oeuvre)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: ETHNIES DATABASE MANAGER (CRUD) */}
      {activeAdminSubTab === 'crud-ethnies' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-slate-950 uppercase">
              Groupes culturels &amp; Ethnographiques ({ethnies.length})
            </h3>
            <button
              onClick={() => {
                setEditingEthnie(null);
                setShowEthnieForm(true);
              }}
              className="px-4 py-2.5 bg-forest-900 border border-gold-800/20 text-white hover:bg-forest-950 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Enregistrer Ethnie
            </button>
          </div>

          <AnimatePresence>
            {showEthnieForm && (
              <form onSubmit={handleSaveEthnie} className="bg-white rounded-2xl p-5 border border-gold-600/20 shadow-md text-left grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 border-b pb-2 mb-2 font-display font-bold text-gold-900 uppercase">
                  {editingEthnie ? 'Modifier Ethnie' : 'Nouvelle Ethnie'}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Nom de l&apos;Ethnie</label>
                  <input
                    type="text"
                    value={ethnieForm.nom}
                    onChange={(e) => setEthnieForm({ ...ethnieForm, nom: e.target.value })}
                    placeholder="Ex. Baoulé"
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Régions d&apos;Origine centrale</label>
                  <input
                    type="text"
                    value={ethnieForm.region_origine}
                    onChange={(e) => setEthnieForm({ ...ethnieForm, region_origine: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Rituels majeurs sacrés</label>
                  <input
                    type="text"
                    value={ethnieForm.rituel_principal}
                    onChange={(e) => setEthnieForm({ ...ethnieForm, rituel_principal: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Arts emblématiques</label>
                  <input
                    type="text"
                    value={ethnieForm.art_caracteristique}
                    onChange={(e) => setEthnieForm({ ...ethnieForm, art_caracteristique: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                  />
                </div>
                <div className="col-span-2 flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Descriptif Historiologique complet</label>
                  <textarea
                    value={ethnieForm.description}
                    onChange={(e) => setEthnieForm({ ...ethnieForm, description: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    rows={3}
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowEthnieForm(false); setEditingEthnie(null); }} className="text-gray-500 font-bold text-xs uppercase px-3 py-1">Fermer</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase">Sauvegarder</button>
                </div>
              </form>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ethnies.map(e => (
              <div key={e.id_ethnie} className="bg-white rounded-2xl p-5 border border-gold-600/10 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start border-b border-gold-800/10 pb-2 mb-3">
                    <h4 className="font-display font-extrabold text-base text-slate-900 uppercase">{e.nom}</h4>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleStartEditEthnie(e)} className="text-blue-500"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteEthnie(e.id_ethnie)} className="text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-light">{e.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] mt-4 pt-3 border-t border-gold-800/5 text-slate-500 font-mono">
                  <div>
                    <span className="font-bold text-gold-700 block text-[9px] uppercase">RITUEL</span>
                    <span className="truncate block font-medium text-slate-900">{e.rituel_principal}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gold-700 block text-[9px] uppercase">RÉGION</span>
                    <span className="truncate block font-medium text-slate-900">{e.region_origine}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: EMPLACEMENTS (ROOMS / V-EXHIBIT ROOMS) CRUD */}
      {activeAdminSubTab === 'crud-emplacements' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-extrabold text-lg text-slate-950 uppercase">
              Salles rattachées &amp; Vitrines physiques ({emplacements.length})
            </h3>
            <button
              onClick={() => {
                setEditingEmplacement(null);
                setShowEmplacementForm(true);
              }}
              className="px-4 py-2.5 bg-forest-900 border border-gold-800/20 text-white hover:bg-forest-950 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Enregistrer Salle
            </button>
          </div>

          <AnimatePresence>
            {showEmplacementForm && (
              <form onSubmit={handleSaveEmplacement} className="bg-white rounded-2xl p-5 border border-gold-600/20 shadow-md text-left grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 border-b pb-2 mb-2 font-display font-bold text-gold-900 uppercase">
                  {editingEmplacement ? 'Modifier Salle' : 'Nouvelle Galerie'}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Nom de la salle</label>
                  <input
                    type="text"
                    value={emplacementForm.nom}
                    onChange={(e) => setEmplacementForm({ ...emplacementForm, nom: e.target.value })}
                    placeholder="Ex. Salon de l'Or"
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Capacité maximum visiteurs</label>
                  <input
                    type="number"
                    value={emplacementForm.capacity}
                    onChange={(e) => setEmplacementForm({ ...emplacementForm, capacity: Number(e.target.value) })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Température Climat (°C)</label>
                  <input
                    type="text"
                    value={emplacementForm.temperature}
                    onChange={(e) => setEmplacementForm({ ...emplacementForm, temperature: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Taux d&apos;Humidité (%)</label>
                  <input
                    type="text"
                    value={emplacementForm.humidite}
                    onChange={(e) => setEmplacementForm({ ...emplacementForm, humidite: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                  />
                </div>
                <div className="col-span-2 flex flex-col space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-gold-800 uppercase">Descriptif &amp; Contraintes conservation</label>
                  <textarea
                    value={emplacementForm.description}
                    onChange={(e) => setEmplacementForm({ ...emplacementForm, description: e.target.value })}
                    className="text-xs p-2.5 bg-ivory-100 rounded-lg border border-gold-800/10"
                    rows={2}
                  />
                </div>
                <div className="col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowEmplacementForm(false); setEditingEmplacement(null); }} className="text-gray-500 text-xs font-bold uppercase px-3 py-1">Fermer</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase">Sauvegarder</button>
                </div>
              </form>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {emplacements.map(em => (
              <div key={em.id_emplacement} className="bg-white rounded-2xl p-5 border border-gold-600/10 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start border-b border-gold-800/10 pb-2 mb-2">
                    <h4 className="font-display font-extrabold text-base text-slate-900 uppercase truncate pr-4">{em.nom}</h4>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleStartEditEmplacement(em)} className="text-blue-500"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteEmplacement(em.id_emplacement)} className="text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-light">{em.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gold-800/5 flex items-center justify-between text-[11px] font-mono text-gold-800">
                  <span className="font-medium">Maximun: {em.capacity} pers.</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-orange-500" /> {em.temperature}</span>
                    <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5 text-blue-500" /> {em.humidite}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: TICKETS RESERVATIONS AUDIT QUEUE */}
      {activeAdminSubTab === 'queue-tickets' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="border-b border-gold-800/10 pb-4">
            <h3 className="font-display font-extrabold text-lg text-slate-950 uppercase">
              Validation des Entrées &amp; Demandes de Ticket ({tickets.length})
            </h3>
            <p className="text-xs text-slate-500 font-light mt-1">
              Approuvez ou rejetez les demandes de passes émises par les visiteurs. Les réservations approuvées passent automatiquement en statut &quot;Validé&quot;.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-gold-600/10 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800 border-collapse">
                <thead className="bg-ivory-100 text-gold-850 font-mono text-[10px] tracking-wider uppercase border-b border-gold-800/10">
                  <tr>
                    <th className="p-4">Commanditaire / Email</th>
                    <th className="p-4">Date de visite</th>
                    <th className="p-4">Type de pass</th>
                    <th className="p-4">Code Unique</th>
                    <th className="p-4 text-center">Statut du ticket</th>
                    <th className="p-4 text-right">Actions administratives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-800/5">
                  {tickets.map(t => {
                    
                    // Style attributes for tickets statuses
                    let colorClasses = '';
                    if (t.statut === 'en_attente') {
                      colorClasses = 'bg-orange-500/15 text-orange-700 animate-pulse';
                    } else if (t.statut === 'valide') {
                      colorClasses = 'bg-emerald-500/15 text-emerald-800 font-bold';
                    } else {
                      colorClasses = 'bg-rose-500/15 text-rose-850';
                    }

                    return (
                      <tr key={t.id_ticket} className="hover:bg-ivory-50/50 transition-colors">
                        
                        {/* Name and email details */}
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{t.nom_visiteur}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{t.email}</p>
                        </td>

                        {/* Visit date */}
                        <td className="p-4 font-semibold text-slate-600">
                          {new Date(t.date_visite).toLocaleDateString('fr-FR')}
                        </td>

                        {/* Ticket selection category */}
                        <td className="p-4 text-gold-900 font-bold capitalize">
                          {t.type_ticket} ({t.prix.toLocaleString()} FCFA)
                        </td>

                        {/* Unique ticket verification hash */}
                        <td className="p-4 font-mono text-[11px] font-bold text-gray-500">
                          {t.code_unique}
                        </td>

                        {/* Interactive state pill */}
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${colorClasses}`}>
                            {t.statut === 'en_attente' ? '⌛ En Attente' : t.statut === 'valide' ? '✅ Validé' : '❌ Refusé'}
                          </span>
                        </td>

                        {/* Quick validation triggers */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-xs">
                            {t.statut === 'en_attente' ? (
                              <>
                                <button
                                  onClick={() => handleSetTicketStatus(t.id_ticket, 'valide')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 font-bold uppercase tracking-wider text-[10px] transition-transform active:scale-95"
                                >
                                  <Check className="w-3.5 h-3.5" /> Approuver
                                </button>
                                <button
                                  onClick={() => handleSetTicketStatus(t.id_ticket, 'refuse')}
                                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-1 font-semibold uppercase tracking-wider text-[10px] transition-transform active:scale-95"
                                >
                                  <X className="w-3.5 h-3.5" /> Refuser
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-mono">Clos d&apos;office</span>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
