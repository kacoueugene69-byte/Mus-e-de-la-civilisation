/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Oeuvre, Ethnie } from '../types';
import { Compass, RotateCw, Lightbulb, ZoomIn, Eye, Map, Music, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VirtualTourProps {
  oeuvres: Oeuvre[];
  ethnies: Ethnie[];
  initialActiveOeuvre?: Oeuvre | null;
}

// Custom defined hotspot checkpoints for iconic specimens
interface Hotspot {
  x: number; // percentage width
  y: number; // percentage height
  title: string;
  detail: string;
}

const STATUES_HOTSPOTS: Record<number, Hotspot[]> = {
  1: [
    { x: 50, y: 22, title: 'Pommeaux Polychromes', detail: 'Couronne sculptée représentant des cornes d\'oiseaux sacrés symbolisant l\'éveil et la réconciliation.' },
    { x: 48, y: 55, title: 'Teinte Polychrome', detail: 'Peintures minérales et végétales complexes appliquées avec de l\'huile de palme purifiée.' },
    { x: 52, y: 78, title: 'Attache d\'Ayous', detail: 'Bois d\'Ayous extrêmement souple et fin, permettant aux danseurs d\'effectuer des figures d\'une agilité extrême.' }
  ],
  2: [
    { x: 50, y: 28, title: 'Bec Sacré', detail: 'Le bec massif recourbé touche la panse, symbolisant le recueillement, la parole pondérée et la transmission rituelle.' },
    { x: 45, y: 62, title: 'Ventre de Gestation', detail: 'Le ventre bombé représente la fertilité, la protection maternelle de l\'esprit primordial de la communauté Senufo.' },
    { x: 55, y: 88, title: 'Trépied de Danse', detail: 'Base de soutien servant à hisser le Calao protecteur au centre du bosquet sacré.' }
  ],
  3: [
    { x: 50, y: 35, title: 'Cornes de Bélier', detail: 'Représente la puissance mesurée, l\'humilité virile et le commandement cosmique pour les anciens.' },
    { x: 48, y: 60, title: 'Forme Circulaire Solaire', detail: 'Visage en forme de disque aplati évoquant le soleil, la déesse lunaire et le temps éternel.' }
  ],
  4: [
    { x: 50, y: 50, title: 'Orpur Coulé', detail: 'Or pur fondu selon la technique secrète royale de la cire perdue Akan, inaltérable.' }
  ]
};

export default function VirtualTour({ oeuvres, ethnies, initialActiveOeuvre }: VirtualTourProps) {
  
  // Select active artwork to view in 3D orbit
  const [activeOeuvre, setActiveOeuvre] = useState<Oeuvre>(oeuvres[0]);

  // Handle outside direct triggers (e.g. when coming from clicking "Specter in 3D" in the gallery)
  useEffect(() => {
    if (initialActiveOeuvre) {
      setActiveOeuvre(initialActiveOeuvre);
    }
  }, [initialActiveOeuvre]);

  // Orbit rotation degree simulation
  const [rotation, setRotation] = useState(0);
  const [isPlayingRotation, setIsPlayingRotation] = useState(true);

  // 3D environmental settings states
  const [lightIntensity, setLightIntensity] = useState(75);
  const [zoomLevel, setZoomLevel] = useState(105);
  const [currentHotspot, setCurrentHotspot] = useState<Hotspot | null>(null);

  // Immersive sound beat states
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const [activeCameraAngle, setActiveCameraAngle] = useState<'Face' | 'Profil' | 'Zénithal' | 'Détail'>('Face');

  // Rotate simulator loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingRotation) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 70);
    }
    return () => clearInterval(interval);
  }, [isPlayingRotation]);

  const hotspots = STATUES_HOTSPOTS[activeOeuvre.id_oeuvre] || [
    { x: 50, y: 50, title: 'Détail Sculptural', detail: 'Finesse artisanale préservée par imagerie numérique haute définition.' }
  ];

  return (
    <section id="virtual-tour-workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-ivory-50 select-none">
      
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="bg-emerald-500/10 text-emerald-700 text-xs font-mono font-bold uppercase py-1.5 px-3 rounded-full">
          🌌 PAVILLON IMMERSIF WEBGL SIMULÉ
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ivory-900 uppercase mt-2">
          Visite Virtuelle Interactive
        </h2>
        <div className="w-16 h-1 w-1 bg-gradient-to-r from-orange-400 to-gold-500 mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Art Selectors & Culture Regional Origin map */}
        <div className="lg:col-span-3 space-y-6 text-left">
          
          {/* List selection widgets */}
          <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm">
            <h3 className="font-display font-bold text-sm text-gold-900 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-orange-500" />
              <span>Sélectionner l&apos;œuvre</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {oeuvres.map(o => (
                <button
                  key={o.id_oeuvre}
                  onClick={() => { setActiveOeuvre(o); setCurrentHotspot(null); }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                    activeOeuvre.id_oeuvre === o.id_oeuvre
                      ? 'border-gold-500 bg-gold-500/5 text-gold-900 font-bold'
                      : 'border-gold-800/10 bg-ivory-100/50 hover:bg-gold-50 text-ivory-800/80'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold truncate">{o.nom}</p>
                    <p className="text-[10px] text-gray-500 font-normal">{o.type_oeuvre}</p>
                  </div>
                  <span className="text-[10px] text-gold-600 font-mono">3D Mode</span>
                </button>
              ))}
            </div>
          </div>

          {/* Regional Map of Origin Simulation */}
          <div className="bg-white rounded-2xl p-4 border border-gold-600/10 shadow-sm relative overflow-hidden">
            <h3 className="font-display font-bold text-sm text-gold-900 tracking-wider uppercase mb-3 flex items-center gap-1.5">
              <Map className="w-4 h-4 text-emerald-600" />
              <span>Origine Régionale</span>
            </h3>

            {/* Simulated geographic silhouette map of Ivory Coast */}
            <div className="relative h-44 bg-forest-950/20 rounded-xl border border-gold-800/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center blend-multiply opacity-20" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=400')` }}></div>
              
              {/* Regional dot locator */}
              <div className="relative w-full h-full flex items-center justify-center text-xs font-mono">
                {/* Visual outline mockup using elegant CSS */}
                <span className="text-[11px] text-ivory-800/40 uppercase tracking-widest">CIV MAP COORDINATES</span>
                
                {/* Pulse dot for the origin */}
                <div className="absolute top-[40%] left-[30%] flex h-5 w-5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 border-2 border-white shadow flex items-center justify-center text-[8px] text-white font-bold">★</span>
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg border border-gold-800/20 text-[10px] text-center">
                  <p className="font-bold text-gold-800 truncate">{activeOeuvre.region_ivoirienne}</p>
                  <p className="text-[8px] text-gray-500">District Côte d&apos;Ivoire</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Center: Interactive simulated 3D model-viewer frame with controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-forest-950 rounded-3xl overflow-hidden border-2 border-gold-800/20 shadow-xl relative aspect-[4/3] flex flex-col justify-between p-5 text-white">
            
            {/* 3D stage effects, shadow mesh and rotating canvas wrapper */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-forest-900 to-forest-950"></div>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-600/25 via-transparent to-transparent pointer-events-none"></div>

            {/* Top Toolbar overlay */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold-800/30">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[9px] tracking-widest text-emerald-400/90 uppercase">MOTEUR RENDU 3D</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio sound button simulator */}
                <button
                  onClick={() => setIsAmbientSoundOn(!isAmbientSoundOn)}
                  className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                    isAmbientSoundOn 
                      ? 'bg-emerald-500 border-emerald-400 text-white animate-pulse' 
                      : 'bg-black/40 border-gold-800/20 text-gold-300'
                  }`}
                  title="Activer l'ambiance sonore rituelle des forêts ou tambours"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-mono tracking-wider">{isAmbientSoundOn ? 'AMB - ON' : 'AMB - OFF'}</span>
                </button>
              </div>
            </div>

            {/* Main Interactive Stage showcase with absolute rotating items */}
            <div className="relative z-0 flex-1 flex items-center justify-center p-6 h-full w-full">
              
              {/* Rotating Object Holder */}
              <div 
                className="relative flex items-center justify-center transition-all duration-300 transform"
                style={{ 
                  transform: `scale(${zoomLevel / 100})`, 
                  filter: `brightness(${lightIntensity / 100 + 0.3})`
                }}
              >
                
                {/* Simulated 3D Shadow mesh below */}
                <div 
                  className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-40 h-4 bg-black/60 rounded-full blur-md"
                  style={{ transform: `scaleX(${1 + (zoomLevel - 100)/200}) rotateY(${-rotation}deg)` }}
                />

                <motion.div 
                  className="relative rounded-2xl overflow-hidden max-w-[240px] border border-gold-600/30 shadow-2xl bg-forest-900 select-none cursor-grab active:cursor-grabbing"
                  style={{ transform: `rotateY(${rotation}deg)` }}
                >
                  <img
                    src={activeOeuvre.image_principale}
                    alt={activeOeuvre.nom}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                  
                  {/* Rotating metallic light shine layer effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"
                    style={{ transform: `translateX(${(rotation - 180) * 1.5}px)` }}
                  />
                </motion.div>

                {/* Hotspots Checkpoints on Top layer (does not rotate inside, stays mapped over target item) */}
                {hotspots.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentHotspot(h)}
                    className="absolute z-30 flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 hover:bg-gold-500 border-2 border-white font-mono text-xs text-white font-bold shadow-md hover:scale-110 pointer-events-auto transition-transform"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                    title={h.title}
                  >
                    {i + 1}
                  </button>
                ))}

              </div>

            </div>

            {/* Floating Hotspot info popup banner if selected */}
            <AnimatePresence>
              {currentHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="relative z-20 bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-gold-400/40 text-left mt-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-gold-400 font-bold uppercase flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-orange-400" /> INSPECTION SÉCRETS RITUELS
                    </span>
                    <button onClick={() => setCurrentHotspot(null)} className="text-[10px] text-gray-400 hover:text-white">Fermer</button>
                  </div>
                  <h4 className="text-xs font-bold font-display text-white mt-1 uppercase">{currentHotspot.title}</h4>
                  <p className="text-[11px] text-ivory-200 mt-1 font-light leading-normal">{currentHotspot.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coordinates and Angle feedback row */}
            <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono text-gold-300 mt-2 bg-black/40 p-2 rounded-xl">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-orange-500" />
                <span>Rotation: {Math.round(rotation)}°</span>
              </span>
              <span>Zoom: {zoomLevel}%</span>
              <span>Lumière: {lightIntensity}%</span>
            </div>

          </div>

          {/* 3D Ambient sound controller banner */}
          <AnimatePresence>
            {isAmbientSoundOn && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3 text-emerald-800 text-xs"
              >
                <div className="flex space-x-1 shrink-0">
                  <div className="h-4 w-1 bg-emerald-500 animate-pulse"></div>
                  <div className="h-4 w-1 bg-emerald-600 animate-pulse delay-75"></div>
                  <div className="h-4 w-1 bg-emerald-400 animate-pulse delay-150"></div>
                </div>
                <div className="text-left font-sans">
                  <p className="font-bold">🔊 Synthèse sonore rattachée active :</p>
                  <p className="text-[10px] opacity-80">Simulation d&apos;instruments sacrés (Tambour parleur &amp; Balafon d&apos;Afrique de l&apos;Ouest à Korhogo).</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive controls adjustment sliders (Rotates, Zoom, Lighting) */}
          <div className="bg-white rounded-2xl p-5 border border-gold-600/10 shadow-sm text-left space-y-4">
            
            {/* Multi-angle Preset Buttons to see all faces & sides easily */}
            <div>
              <label className="text-[10px] font-mono font-bold tracking-wider text-gold-800 uppercase mb-2 block">
                🔄 Vues Angulaires Rituelles (Tous les côtés et faces)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => {
                    setRotation(0);
                    setIsPlayingRotation(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border text-center flex items-center justify-center gap-1.5 ${
                    rotation % 360 === 0 && !isPlayingRotation
                      ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white border-transparent shadow'
                      : 'bg-ivory-100/80 text-gold-900 border-gold-800/10 hover:bg-gold-50/80'
                  }`}
                  title="Vue de Face (0°)"
                >
                  <span>🎭 Face (0°)</span>
                </button>
                <button
                  onClick={() => {
                    setRotation(90);
                    setIsPlayingRotation(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border text-center flex items-center justify-center gap-1.5 ${
                    rotation % 360 === 90 && !isPlayingRotation
                      ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white border-transparent shadow'
                      : 'bg-ivory-100/80 text-gold-900 border-gold-800/10 hover:bg-gold-50/80'
                  }`}
                  title="Vue de Profil Gauche (90°)"
                >
                  <span>⬅ Gauche (90°)</span>
                </button>
                <button
                  onClick={() => {
                    setRotation(180);
                    setIsPlayingRotation(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border text-center flex items-center justify-center gap-1.5 ${
                    rotation % 360 === 180 && !isPlayingRotation
                      ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white border-transparent shadow'
                      : 'bg-ivory-100/80 text-gold-900 border-gold-800/10 hover:bg-gold-50/80'
                  }`}
                  title="Vue de Dos (180°)"
                >
                  <span>👤 Dos (180°)</span>
                </button>
                <button
                  onClick={() => {
                    setRotation(270);
                    setIsPlayingRotation(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border text-center flex items-center justify-center gap-1.5 ${
                    rotation % 360 === 270 && !isPlayingRotation
                      ? 'bg-gradient-to-r from-orange-500 to-gold-600 text-white border-transparent shadow'
                      : 'bg-ivory-100/80 text-gold-900 border-gold-800/10 hover:bg-gold-50/80'
                  }`}
                  title="Vue de Profil Droit (270°)"
                >
                  <span>➡ Droit (270°)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-gold-800/10">
              {/* Rotation toggle or simple manuals */}
              <div className="flex flex-col justify-center">
                <label className="text-[10px] font-mono font-bold tracking-wider text-gold-800 uppercase mb-1">Rotation Continue</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPlayingRotation(!isPlayingRotation)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-all border ${
                      isPlayingRotation
                        ? 'bg-orange-500 text-white border-orange-400 font-bold'
                        : 'bg-ivory-100/80 text-gold-850 border-gold-800/10 hover:bg-gold-50'
                    }`}
                  >
                    {isPlayingRotation ? '⏸ Stop Orbit' : '▶ Auto-Tourner'}
                  </button>
                </div>
              </div>

              {/* Lighting input slider */}
              <div className="flex flex-col justify-center">
                <span className="text-[10.5px] font-mono font-bold tracking-wider text-gold-800 uppercase mb-1 flex items-center justify-between">
                  <span>INTENSITÉ LUMIÈRE</span>
                  <span>{lightIntensity}%</span>
                </span>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer h-1.5 bg-ivory-100 rounded-lg appearance-none"
                />
              </div>

              {/* Zoom slider */}
              <div className="flex flex-col justify-center">
                <span className="text-[10.5px] font-mono font-bold tracking-wider text-gold-800 uppercase mb-1 flex items-center justify-between">
                  <span>ZOOM ORBITAL</span>
                  <span>{zoomLevel}%</span>
                </span>
                <input
                  type="range"
                  min="80"
                  max="155"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer h-1.5 bg-ivory-100 rounded-lg appearance-none"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: High-fidelity Ethnography details & contextual guides */}
        <div className="lg:col-span-3 space-y-6 text-left">
          
          <div className="bg-white rounded-2xl p-5 border border-gold-600/10 shadow-sm space-y-4">
            
            {/* Context title */}
            <div className="border-b border-gold-800/10 pb-3">
              <span className="font-mono text-[9px] text-emerald-700 uppercase tracking-widest font-bold">HISTORIOGRAPHIE CIV</span>
              <h3 className="font-display font-extrabold text-lg text-ivory-900 uppercase">
                {activeActiveEthnie(activeOeuvre.id_ethnie)?.nom || "Groupe Culturel"}
              </h3>
            </div>

            {/* Description text info */}
            <p className="text-xs font-light text-ivory-900 leading-relaxed">
              {activeActiveEthnie(activeOeuvre.id_ethnie)?.description}
            </p>

            {/* Special Ritual focus box */}
            <div className="p-3.5 bg-gold-900/5 rounded-xl border border-gold-500/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-gold-700 font-bold uppercase font-mono">
                <Info className="w-3.5 h-3.5" />
                <span>Rituel Ancestral Principal</span>
              </div>
              <p className="text-xs text-gold-900/90 font-semibold italic">
                {activeActiveEthnie(activeOeuvre.id_ethnie)?.rituel_principal}
              </p>
            </div>

            {/* Characteristic Art */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block">Art caractéristique de l&apos;ethnie</span>
              <p className="text-xs font-medium text-ivory-900">
                {activeActiveEthnie(activeOeuvre.id_ethnie)?.art_caracteristique}
              </p>
            </div>

          </div>

          {/* Interactive Help Help center details */}
          <div className="bg-gradient-to-tr from-forest-950 to-forest-900 rounded-2xl p-4 text-white border border-gold-500/10">
            <span className="text-[10px] font-mono tracking-widest text-gold-300 font-bold uppercase flex items-center gap-1 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" /> GUIDE DE MANIPULATION
            </span>
            <ul className="text-[10.5px] font-light space-y-1.5 text-ivory-300 list-disc list-inside">
              <li>Cliquez sur les <strong className="text-gold-400">chiffres oranges</strong> sur l&apos;œuvre pour lire les secrets de sculpture.</li>
              <li>Activez la <strong className="text-gold-400">Rotation Automatique</strong> ou ajustez le <strong className="text-gold-400">Zoom</strong> pour inspecter chaque rainure.</li>
              <li>Activez l&apos;ambiance sonore pour une expérience d&apos;immersion mystique.</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );

  // Helper method to retrieve matching ethnie
  function activeActiveEthnie(id: number) {
    return ethnies.find(e => e.id_ethnie === id);
  }
}
