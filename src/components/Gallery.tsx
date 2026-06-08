/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Oeuvre, Ethnie, Emplacement, Commentaire } from '../types';
import { Search, SlidersHorizontal, MapPin, Scale, Calendar, Play, Pause, Heart, MessageSquare, Send, CheckCircle2, Bookmark, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryProps {
  oeuvres: Oeuvre[];
  ethnies: Ethnie[];
  emplacements: Emplacement[];
  comments: Commentaire[];
  onAddComment: (comment: Omit<Commentaire, 'id_commentaire' | 'date_commentaire'>) => void;
  favorites: number[];
  onToggleFavorite: (id_oeuvre: number) => void;
  onLaunchVirtualTour: (oeuvre: Oeuvre) => void;
}

export default function Gallery({
  oeuvres,
  ethnies,
  emplacements,
  comments,
  onAddComment,
  favorites,
  onToggleFavorite,
  onLaunchVirtualTour
}: GalleryProps) {
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEthnie, setSelectedEthnie] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Active Detailed artwork Modal State
  const [selectedArtwork, setSelectedArtwork] = useState<Oeuvre | null>(null);

  // Simulated audio guide controller state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioIntervalId, setAudioIntervalId] = useState<NodeJS.Timeout | null>(null);

  // User input comment state
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Filter lists
  const availableTypes = Array.from(new Set(oeuvres.map(o => o.type_oeuvre)));

  // Filter logic
  const filteredOeuvres = oeuvres.filter(oeuvre => {
    const matchesSearch = oeuvre.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          oeuvre.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          oeuvre.region_ivoirienne.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Convert to string for match safety
    const matchesEthnie = selectedEthnie === 'all' || oeuvre.id_ethnie.toString() === selectedEthnie;
    const matchesType = selectedType === 'all' || oeuvre.type_oeuvre === selectedType;

    return matchesSearch && matchesEthnie && matchesType;
  });

  // Audio Guide Simulation
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      if (audioIntervalId) clearInterval(audioIntervalId);
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.2;
        });
      }, 200);
      setAudioIntervalId(interval);
    }
  };

  // Close Detail and reset audio simulation
  const handleCloseDetail = () => {
    if (audioIntervalId) clearInterval(audioIntervalId);
    setIsPlayingAudio(false);
    setAudioProgress(0);
    setSelectedArtwork(null);
    setCommentSuccess(false);
  };

  // Submit dynamic comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork || !newCommentText.trim()) return;

    onAddComment({
      nom_user: newCommentName.trim() || 'Visiteur Anonyme',
      id_oeuvre: selectedArtwork.id_oeuvre,
      commentaire: newCommentText.trim()
    });

    setNewCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  return (
    <section id="museum-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-ivory-50">
      
      {/* Title & Concept summary */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ivory-900 uppercase">
          Trésors Nationaux du Musée
        </h2>
        <div className="w-16 h-1 w-1 bg-gradient-to-r from-orange-400 to-gold-500 mx-auto mt-2 rounded-full"></div>
        <p className="mt-3 text-sm text-ivory-800/80 font-light">
          Découvrez la collection unique de sculptures, masques spirituels et ornements sacrés de Côte d&apos;Ivoire. Utilisez les filtres avancés pour trier les collections par groupe culturel d&apos;origine.
        </p>
      </div>

      {/* Advanced Filter and Search Bar */}
      <div id="filter-panel" className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gold-600/10 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Main search text field */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gold-600/60" />
            </span>
            <input
              type="text"
              placeholder="Rechercher une œuvre, un nom, une clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-ivory-100 rounded-xl text-sm text-ivory-900 border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all font-sans placeholder:text-ivory-900/40"
            />
          </div>

          {/* Preset Buttons and Option panel toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider font-mono uppercase transition-all ${
                showFilters 
                  ? 'bg-gold-500 text-white shadow-md' 
                  : 'bg-ivory-100 text-gold-800 hover:bg-gold-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{showFilters ? 'Fermer Filtres' : 'Filtres de Tri'}</span>
            </button>
            
            {/* Quick count of visible artworks */}
            <span className="text-xs bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-full font-mono font-medium">
              {filteredOeuvres.length} Œuvres
            </span>
          </div>

        </div>

        {/* Collapsible advanced dropdown filters row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 mt-5 border-t border-gold-800/10 text-left">
                
                {/* Select culture (Ethnie) */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono">Groupe Culturel / Ethnie</label>
                  <select
                    value={selectedEthnie}
                    onChange={(e) => setSelectedEthnie(e.target.value)}
                    className="w-full py-2 px-3 bg-ivory-100 text-sm rounded-lg border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="all">Toutes les ethnies (Baoulé, Sénoufo, Gouro, Dan...)</option>
                    {ethnies.map(e => (
                      <option key={e.id_ethnie} value={e.id_ethnie.toString()}>
                        {e.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Art Type (Masque, Sculpture...) */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-gold-800 tracking-wider uppercase font-mono">Type d&apos;artéfact</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full py-2 px-3 bg-ivory-100 text-sm rounded-lg border border-gold-800/10 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="all">Tous les types (masques, bijoux, sculptures...)</option>
                    {availableTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid of Art Cards displaying the items */}
      {oeuvres.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gold-600/10 px-6 py-12 max-w-md mx-auto space-y-4 shadow-sm animate-in fade-in">
          <div className="w-14 h-14 bg-gold-500/10 text-gold-600 rounded-full flex items-center justify-center mx-auto text-gold-500">
            <SlidersHorizontal className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="font-display font-extrabold text-base text-forest-950 uppercase tracking-wider">Base de données vide</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            Toutes les œuvres et fiches d&apos;exposition ont été intégralement vidées. Vous pouvez maintenant bâtir votre musée à partir d&apos;une feuille blanche !
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center bg-ivory-100 px-3 py-1.5 text-[10px] font-mono text-gold-800 rounded-lg font-bold">
              🔑 Admin: admin@musee-ci.ci / admin123
            </span>
          </div>
        </div>
      ) : filteredOeuvres.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold-800/10">
          <p className="text-ivory-800/60 text-sm font-light">Aucun chef-d&apos;œuvre ne correspond à votre filtre de recherche.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedEthnie('all'); setSelectedType('all'); }} 
            className="mt-4 px-4 py-2 bg-gold-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gold-500"
          >
            Réinitialiser
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOeuvres.map(oeuvre => {
            const isFav = favorites.includes(oeuvre.id_oeuvre);
            const oeuvreComments = comments.filter(c => c.id_oeuvre === oeuvre.id_oeuvre);
            const artworkEthnie = ethnies.find(e => e.id_ethnie === oeuvre.id_ethnie)?.nom || "Inconnu";
            const emp = emplacements.find(item => item.id_emplacement === oeuvre.id_emplacement);
            const artworkEmplacement = emp 
              ? `${emp.nom_emplacement || emp.nom} (${emp.localisation || 'Salle principale'})` 
              : "Non assigné";

            return (
              <div 
                key={oeuvre.id_oeuvre}
                id={`oeuvre-card-${oeuvre.id_oeuvre}`}
                className="bg-white rounded-2xl overflow-hidden border border-gold-600/10 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Visual Top Area */}
                <div className="relative aspect-square overflow-hidden bg-forest-950 cursor-pointer" onClick={() => setSelectedArtwork(oeuvre)}>
                  <img
                    src={oeuvre.image_principale}
                    alt={oeuvre.nom}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  
                  {/* Category Type absolute badge */}
                  <span className="absolute top-3 left-3 bg-forest-950/80 backdrop-blur-md text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md border border-gold-800/30">
                    {oeuvre.type_oeuvre}
                  </span>

                  {/* Absolute Favorite Heart Toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(oeuvre.id_oeuvre); }}
                    className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md rounded-full text-gold-800 hover:scale-110 shadow-sm transition-all text-rose-500"
                  >
                    <Heart className={`w-4 h-4 transition-all ${isFav ? 'fill-rose-500 text-rose-500' : 'text-ivory-800/60'}`} />
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs text-white font-semibold flex items-center gap-1.5 font-sans">
                      🔬 Clic pour inspecter en 2D &amp; 3D
                    </span>
                  </div>
                </div>

                {/* Card Content Footer info */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-1.5 flex flex-col items-start w-full">
                    <div className="flex items-center space-x-1 text-gold-600 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      <span>{oeuvre.region_ivoirienne}</span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-ivory-900 hover:text-gold-600 transition-colors cursor-pointer w-full text-left" onClick={() => setSelectedArtwork(oeuvre)}>
                      {oeuvre.nom}
                    </h3>

                    <div className="flex flex-col space-y-1 w-full text-left">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                        Culture : {artworkEthnie}
                      </p>

                      <p className="text-[10px] font-semibold text-[#009B77] bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/10 leading-normal inline-flex items-center gap-1 mt-0.5">
                        <Landmark className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Musée : {artworkEmplacement}</span>
                      </p>
                    </div>

                    <p className="text-xs text-ivory-800/80 line-clamp-2 leading-relaxed font-light mt-1">
                      {oeuvre.description}
                    </p>
                  </div>

                  {/* Comments count and explore actions */}
                  <div className="mt-4 pt-4 border-t border-gold-800/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-ivory-800/60 font-mono">
                      <MessageSquare className="w-3.5 h-3.5 text-gold-600" />
                      <span>{oeuvreComments.length} avis</span>
                    </span>

                    <button
                      onClick={() => setSelectedArtwork(oeuvre)}
                      className="text-gold-700 hover:text-gold-500 font-bold transition-colors uppercase tracking-wider text-[11px] font-mono flex items-center gap-1"
                    >
                      <span>Examiner</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* RENDER MASTER ARTWORK INTERACTIVE DIALOG MODAL ON ACTIVE CLICKED CARD */}
      <AnimatePresence>
        {selectedArtwork && (
          <div id="artwork-detail-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row border border-gold-600/30 shadow-2xl relative"
            >
              
              {/* Close Button Absolute */}
              <button
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 z-20 p-2.5 bg-black/60 hover:bg-black/80 rounded-full text-white hover:scale-105 transition-all text-xs touch-manipulation font-mono uppercase font-bold"
              >
                ✕ Fermer
              </button>

              {/* Left Column: Visual presentation, audio simulation, & 3D button */}
              <div className="w-full md:w-1/2 bg-forest-950 text-white relative flex flex-col justify-between aspect-square md:aspect-auto">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('${selectedArtwork.image_2D}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent"></div>

                <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                  <div>
                    <span className="bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {selectedArtwork.type_oeuvre} • ORIGINEL
                    </span>
                    <h3 className="font-display font-bold text-2xl lg:text-3xl text-gold-300 mt-2 uppercase">
                      {selectedArtwork.nom}
                    </h3>
                    <p className="text-xs text-ivory-300 mt-1 flex items-center gap-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-gold-400" /> {selectedArtwork.region_ivoirienne}
                    </p>
                  </div>

                  {/* Interactive Audio Player Simulation */}
                  <div className="bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-gold-800/20 mt-6 md:mt-0">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="flex items-center gap-1 text-gold-400 font-mono text-[10px]">
                        🔊 AUDIO-GUIDE MUSÉE
                      </span>
                      <span className="font-mono text-ivory-300">{isPlayingAudio ? 'Lecture en cours...' : 'Prêt'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePlayAudio}
                        className="p-3.5 rounded-full bg-gradient-to-r from-orange-400 to-gold-500 text-white hover:scale-105 shadow-md transition-transform"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white" />}
                      </button>

                      <div className="flex-1">
                        <div className="w-full bg-ivory-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-orange-400 to-gold-400 h-full transition-all duration-200"
                            style={{ width: `${audioProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-ivory-300 mt-1">
                          <span>{selectedArtwork.audio_duration || '2:00'} min</span>
                          <span>{audioProgress >= 100 ? 'Terminé' : `${Math.round(audioProgress)}%`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Subtitle Text Transcript */}
                    <div className="mt-3 text-xs italic font-light font-sans text-ivory-300 max-h-16 overflow-y-auto border-t border-gold-800/20 pt-2 text-left">
                      &quot;{selectedArtwork.audio_description}&quot;
                    </div>
                  </div>

                  {/* Immersive 3D Space Direct Action */}
                  <button
                    onClick={() => { handleCloseDetail(); onLaunchVirtualTour(selectedArtwork); }}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-105 transition-all text-center flex items-center justify-center gap-2"
                  >
                    🔮 inspecter en immersion 3D interactive
                  </button>
                </div>
              </div>

              {/* Right Column: Descriptions, Metadata and Comments Box */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between max-h-[60vh] md:max-h-none overflow-y-auto text-left">
                
                {/* Details list */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gold-700 tracking-wider uppercase font-mono mb-1">Introduction Technique</h4>
                    <p className="text-sm font-light text-ivory-900 leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                  </div>

                  {/* Metadata Chips Grid */}
                  <div className="grid grid-cols-2 gap-3.5 bg-ivory-100 p-3 rounded-xl border border-gold-800/5 text-xs font-serif">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gold-700">Taille/Dimensions</span>
                      <span className="font-sans font-bold text-ivory-900 flex items-center gap-1 mt-0.5">
                        <Scale className="w-3.5 h-3.5 text-gold-500" /> {selectedArtwork.taille}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gold-700">Période création</span>
                      <span className="font-sans font-bold text-ivory-900 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-500" /> {selectedArtwork.annee_creation || 'XIXe / XXe siècle'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Comments Container */}
                <div className="mt-6 pt-5 border-t border-gold-800/10">
                  <h4 className="text-xs font-bold text-gold-700 tracking-wider uppercase font-mono mb-3">Livre d&apos;or des visiteurs ({comments.filter(c => c.id_oeuvre === selectedArtwork.id_oeuvre).length})</h4>
                  
                  {/* List of comments */}
                  <div className="space-y-3 max-h-36 overflow-y-auto mb-4 pr-1">
                    {comments.filter(c => c.id_oeuvre === selectedArtwork.id_oeuvre).length === 0 ? (
                      <p className="text-xs text-ivory-800/50 font-light italic">Soyez le premier à laisser un commentaire historique sur cette pièce !</p>
                    ) : (
                      comments.filter(c => c.id_oeuvre === selectedArtwork.id_oeuvre).map(comment => (
                        <div key={comment.id_commentaire} className="bg-ivory-100/60 p-2.5 rounded-lg border border-gold-800/5">
                          <div className="flex justify-between items-center text-[10px] text-gold-700 mb-1">
                            <span className="font-bold">{comment.nom_user}</span>
                            <span className="font-mono">{new Date(comment.date_commentaire).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-ivory-950 font-light leading-snug">{comment.commentaire}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comments Form */}
                  <form onSubmit={handlePostComment} className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Votre Prénom"
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        className="col-span-1 text-xs py-1.5 px-2.5 bg-ivory-100 rounded-lg outline-none border border-gold-800/10 focus:ring-1 focus:ring-gold-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Votre avis sur l'œuvre..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="col-span-2 text-xs py-1.5 px-2.5 bg-ivory-100 rounded-lg outline-none border border-gold-800/10 focus:ring-1 focus:ring-gold-500"
                        required
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {commentSuccess ? (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-3 h-3" /> Avis enregistré !
                        </span>
                      ) : (
                        <span></span>
                      )}
                      
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-forest-900 border border-gold-800/20 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-forest-950"
                      >
                        <Send className="w-2.5 h-2.5" /> Soumettre
                      </button>
                    </div>
                  </form>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
