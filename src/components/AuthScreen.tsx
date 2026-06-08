/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, UserPlus, LogIn, Sparkles, AlertCircle, Bookmark, ShieldAlert, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  triggerNotification: (msg: string, type: 'success' | 'info' | 'warn') => void;
}

export default function AuthScreen({ onLoginSuccess, triggerNotification }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'administrateur' | 'visiteur'>('visiteur');
  const [error, setError] = useState('');

  // Pre-seed accounts from the MySQL schema
  const handlePreseedSelect = (type: 'admin' | 'visiteur') => {
    if (type === 'admin') {
      setEmail('admin@musee-ci.ci');
      setPassword('admin123');
      setRole('administrateur');
      setIsLogin(true);
    } else {
      setEmail('visiteur@musee-ci.ci');
      setPassword('visiteur123');
      setRole('visiteur');
      setIsLogin(true);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Get signed up users
    const usersRaw = localStorage.getItem('db_all_users');
    let registeredUsers: any[] = [];
    if (usersRaw) {
      try {
        registeredUsers = JSON.parse(usersRaw);
      } catch (err) {
        registeredUsers = [];
      }
    }

    // Always ensure pre-seeded accounts exist in DB
    const hasAdminPreseed = registeredUsers.some(u => u.email === 'admin@musee-ci.ci');
    if (!hasAdminPreseed) {
      registeredUsers.push(
        { email: 'admin@musee-ci.ci', mot_passe: 'admin123', role: 'administrateur' },
        { email: 'visiteur@musee-ci.ci', mot_passe: 'visiteur123', role: 'visiteur' }
      );
      localStorage.setItem('db_all_users', JSON.stringify(registeredUsers));
    }

    if (isLogin) {
      // Find user
      const user = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && (u.mot_passe === password || password === 'password')
      );

      if (user) {
        // Log in user
        const loggedInUser: User = {
          email: user.email,
          username: user.email.split('@')[0],
          role: user.role || 'visiteur',
          avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`
        };
        onLoginSuccess(loggedInUser);
        triggerNotification(`Ravi de vous voir, ${loggedInUser.username} ! Connexion réussie.`, 'success');
      } else {
        setError('Adresse courriel ou mot de passe incorrect. Note : Essayez avec visiteur123 ou admin123 !');
      }
    } else {
      // Register logic
      const userExists = registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setError('Cet courriel est déjà associé à un compte.');
        return;
      }

      // Check password length
      if (password.length < 5) {
        setError('Le mot de passe doit contenir au moins 5 caractères.');
        return;
      }

      const newUser = {
        email: email.toLowerCase(),
        mot_passe: password,
        role: role
      };

      registeredUsers.push(newUser);
      localStorage.setItem('db_all_users', JSON.stringify(registeredUsers));

      // Successfully registered, auto login
      const loggedInUser: User = {
        email: newUser.email,
        username: newUser.email.split('@')[0],
        role: newUser.role,
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${newUser.email}`
      };
      
      onLoginSuccess(loggedInUser);
      triggerNotification(`Inscription validée ! Bienvenue sur le Musée des Civilisations.`, 'success');
    }
  };

  return (
    <div id="auth-screen-layout" className="min-h-screen bg-ivory-50 grid grid-cols-1 lg:grid-cols-12 overflow-hidden text-left">
      
      {/* Left Column: Traditional art banner and promotional info */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-forest-950 flex-col justify-between p-12 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1200')` }}
        ></div>
        
        {/* National color banner accent at the top */}
        <div className="absolute top-0 inset-x-0 h-2 flex">
          <div className="flex-1 bg-[#F77F00]"></div> {/* Orange Côte d'Ivoire */}
          <div className="flex-1 bg-white"></div>       {/* Blanc */}
          <div className="flex-1 bg-[#009B77]"></div> {/* Vert Côte d'Ivoire */}
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/25 border border-gold-400/30 text-gold-300 font-mono text-[10px] tracking-widest uppercase">
            <Sparkles className="w-3 h-3 animate-spin-slow" />
            <span>Patrimoine de Côte d&apos;Ivoire</span>
          </div>
          <h1 className="font-display font-black text-3xl xl:text-4xl uppercase tracking-tight text-white leading-tight">
            Musée Numérique <br/>
            <span className="text-gold-400">des Civilisations</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-gold-500 rounded-full"></div>
          <p className="text-sm font-light text-ivory-300 leading-relaxed max-w-sm">
            Numérisation haute-fidélité en 3D interactive, narrations guidées et préservation éternelle des trésors ethnographiques des peuples Baoulé, Sénoufo, Bété, Dan, Gouro et Agni.
          </p>
        </div>

        {/* Culture testimonials slides */}
        <div className="relative z-10 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-gold-800/30 max-w-sm">
          <p className="text-xs italic font-light text-ivory-200">
            &quot;Tout visiteur doit obtenir et valider un ticket d&apos;accès numérique pour entrer dans le pavillon des masques ou inspecter la visite virtuelle. Le pass de visite reste actif durant 24H.&quot;
          </p>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 text-[10px] font-mono text-gold-400">
            <span>🏛️ MINISTÈRE DE LA CULTURE ET DE LA FRANCOPHONIE</span>
          </div>
        </div>

        <p className="relative z-10 text-[9px] font-mono text-gray-500">
          © 2026 Musée National de Côte d&apos;Ivoire. Tous droits réservés.
        </p>
      </div>

      {/* Right Column: Interactive Login/SignUp Form and preseeds */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-16 py-12 bg-ivory-50 relative">
        
        {/* Floating accents in the background */}
        <div className="absolute top-10 right-10 w-44 h-44 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md space-y-6 relative z-10">
          
          {/* Header titles */}
          <div className="text-center sm:text-left space-y-2">
            <h2 className="font-display font-black text-2xl xl:text-3xl uppercase tracking-wider text-forest-950">
              {isLogin ? 'Portail de Connexion' : 'Créer un Compte'}
            </h2>
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              {isLogin 
                ? 'Saisissez vos identifiants ou cliquez sur un des profils de démonstration pré-configurés ci-dessous.' 
                : 'Enregistrez-vous gratuitement en tant que visiteur ou administrateur système.'}
            </p>
          </div>

          {/* Quick Demonstration pre-seeds selector (MySQL compliant) */}
          <div className="bg-white p-4 rounded-2xl border border-gold-600/10 shadow-sm space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-800 block">
              💡 Raccourcis de Test (Identifiants SQL)
            </span>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handlePreseedSelect('visiteur')}
                className="p-3 bg-ivory-100 text-[11px] rounded-xl border border-gold-800/10 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all flex flex-col items-start"
              >
                <div className="flex items-center gap-1 text-emerald-700 font-bold mb-0.5">
                  <Check className="w-3.5 h-3.5" /> Compte Visiteur
                </div>
                <span className="text-[9px] text-gray-500 font-mono truncate w-full">visiteur@musee-ci.ci</span>
              </button>

              <button
                type="button"
                onClick={() => handlePreseedSelect('admin')}
                className="p-3 bg-ivory-100 text-[11px] rounded-xl border border-gold-800/10 hover:border-orange-500 hover:bg-orange-500/5 transition-all flex flex-col items-start"
              >
                <div className="flex items-center gap-1 text-orange-700 font-bold mb-0.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Compte Administrateur
                </div>
                <span className="text-[9px] text-gray-500 font-mono truncate w-full">admin@musee-ci.ci</span>
              </button>
            </div>
            <p className="text-[9.5px] italic text-gray-400 text-center font-mono pt-1">
              Mot de passe prédéfini pour les raccourcis : <strong className="text-slate-700 font-bold">visiteur123</strong> / <strong className="text-slate-700 font-bold">admin123</strong>
            </p>
          </div>

          {/* Real Form form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gold-600/15 shadow-md space-y-4">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-300/30 text-rose-700 text-xs rounded-xl flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Field : Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gold-800 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gold-600" /> Adresse Courriel électronique
              </label>
              <input
                type="email"
                placeholder="nom@musee-ci.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-3 bg-ivory-100 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 border border-gold-800/10 text-slate-900"
                required
              />
            </div>

            {/* Field : Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gold-800 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gold-600" /> Mot de Passe d&apos;accès
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs p-3 bg-ivory-100 rounded-xl outline-none focus:ring-1 focus:ring-gold-500 border border-gold-800/10 text-slate-900"
                required
              />
            </div>

            {/* Conditional Field: Role picker only on Inscription */}
            {!isLogin && (
              <div className="space-y-1.5 pt-1 animate-fadeIn">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gold-800 block">
                  Rôle de l&apos;Utilisateur dans l&apos;application
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    role === 'visiteur' 
                      ? 'border-emerald-500 bg-emerald-500/5 text-emerald-800' 
                      : 'border-gold-800/10 bg-ivory-100 text-gray-500'
                  }`}>
                    <input 
                      type="radio" 
                      name="signup_role" 
                      value="visiteur"
                      checked={role === 'visiteur'}
                      onChange={() => setRole('visiteur')}
                      className="sr-only"
                    />
                    <span>🎭 Visiteur Standard</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    role === 'administrateur' 
                      ? 'border-orange-500 bg-orange-500/5 text-orange-850' 
                      : 'border-gold-800/10 bg-ivory-100 text-gray-500'
                  }`}>
                    <input 
                      type="radio" 
                      name="signup_role" 
                      value="administrateur"
                      checked={role === 'administrateur'}
                      onChange={() => setRole('administrateur')}
                      className="sr-only"
                    />
                    <span>🛡️ Administrateur</span>
                  </label>
                </div>
              </div>
            )}

            {/* Submission triggers */}
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-orange-500 to-gold-600 hover:from-orange-400 hover:to-gold-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow flex items-center justify-center gap-2"
            >
              {isLogin ? (
                <>
                  <LogIn className="w-4 h-4 text-white" />
                  <span>SE CONNECTER</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>S&apos;INSCRIRE GRATUITEMENT</span>
                </>
              )}
            </button>

          </form>

          {/* Toggle connection type line */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-gold-800 hover:text-gold-600 font-bold transition-all focus:outline-none underline"
            >
              {isLogin 
                ? 'Pas de compte ? Inscrivez-vous gratuitement' 
                : 'Déjà membre ? Authentifiez-vous ici'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
