/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Ethnie {
  id_ethnie: number;
  nom: string;
  nom_ethnie?: string; // DB schema compatibility
  description: string;
  region_origine: string;
  region?: string; // DB schema compatibility
  rituel_principal: string;
  art_caracteristique: string;
  image_url: string;
}

export interface Emplacement {
  id_emplacement: number;
  nom: string;
  nom_emplacement?: string; // DB schema compatibility
  description: string;
  type_emplacement?: string; // DB schema compatibility
  localisation?: string; // DB schema compatibility
  capacity: number;
  temperature: string;
  humidite: string;
}

export interface Oeuvre {
  id_oeuvre: number;
  nom: string;
  nom_oeuvre?: string; // DB schema compatibility
  description: string;
  type_oeuvre: string;
  taille: string;
  date_reception: string;
  id_ethnie: number;
  id_emplacement: number;
  image_principale: string;
  image_2D: string;
  image_2d?: string; // DB schema compatibility
  modele_3D?: string; // Standard or simulated GLB path
  modele_3d?: string; // DB schema compatibility
  audio_description: string;
  audio_duration?: string;
  region_ivoirienne: string;
  region_id?: string; // For SQL compatibility
  popularity: number; // For sorting and metrics
  annee_creation?: string;
}

export interface Ticket {
  id_ticket: number;
  nom_visiteur: string;
  email: string;
  date_visite: string;
  type_ticket: 'standard' | 'etudiant' | 'famille' | 'groupe' | 'virtuel';
  statut: 'en_attente' | 'valide' | 'refuse';
  date_reservation: string;
  code_unique: string;
  prix: number;
  activation_time?: number;
  moyen_paiement?: string;
  telephone_paiement?: string;
}

export interface Commentaire {
  id_commentaire: number;
  nom_user: string;
  id_oeuvre: number;
  commentaire: string;
  date_commentaire: string;
}

export interface Favori {
  id_favori: number;
  username: string;
  id_oeuvre: number;
}

export interface Actualite {
  id_actualite: number;
  titre: string;
  contenu: string;
  image: string;
  date_publication: string;
}

export interface User {
  username: string;
  email: string;
  role: 'administrateur' | 'visiteur';
  avatar_url?: string;
}
