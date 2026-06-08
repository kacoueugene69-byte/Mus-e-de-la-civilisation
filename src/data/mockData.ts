/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ethnie, Emplacement, Oeuvre, Ticket, Commentaire, Actualite } from '../types';

export const INITIAL_ETHNIES: Ethnie[] = [
  {
    id_ethnie: 1,
    nom: 'Akan (Baoulé, Agni, Ebrié)',
    nom_ethnie: 'Akan (Baoulé, Agni, Ebrié)',
    description: 'Le groupe Akan, originaire principalement du Ghana voisin, occupe le Centre, l\'Est et le Sud de la Côte d\'Ivoire. Connu pour ses structures de royauté complexes, l\'importance de l\'or (symbole de pouvoir politique et spirituel) et son artisanat d\'orfèvrerie très élaboré.',
    region_origine: 'Centre, Est et Littoral Sud de la Côte d\'Ivoire',
    region: 'Centre, Est et Littoral Sud de la Côte d\'Ivoire',
    rituel_principal: 'La fête des ignames, l\'intronisation royale',
    art_caracteristique: 'Orfèvrerie (poids à peser l\'or, bijoux royaux), masques de portrait Baoulé, pagnes Kita',
    image_url: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=600'
  },
  {
    id_ethnie: 2,
    nom: 'Gour / Voltaïque (Sénoufo, Lobi)',
    nom_ethnie: 'Gour / Voltaïque (Sénoufo, Lobi)',
    description: 'Installé dans le Nord de la Côte d\'Ivoire, le peuple Sénoufo est célèbre pour ses rituels sacrés d\'initiation (le Poro), qui dure plusieurs cycles d\'années et transmet la sagesse politique, cosmogonique et morale de la communauté aux jeunes générations.',
    region_origine: 'Région du Nord (Korhogo, Ferkessédougou)',
    region: 'Région du Nord (Korhogo, Ferkessédougou)',
    rituel_principal: 'Le Poro (rite d\'initiation secret), Funérailles rituelles',
    art_caracteristique: 'Sculptures sur bois monumentales (Calao protecteur), toiles de Korhogo peintes, masques de buffle',
    image_url: 'https://images.unsplash.com/photo-1608985160805-4f48bba0612d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id_ethnie: 3,
    nom: 'Krou (Bété, Guéré, Wê)',
    nom_ethnie: 'Krou (Bété, Guéré, Wê)',
    description: 'Vivant dans le Centre-Ouest et l\'Ouest forestier, les peuples Krou accordent une grande importance à la musique sacrée et aux masques de forces de la forêt. Leurs sociétés de masques régissent l\'ordre politique et arbitrent les litiges.',
    region_origine: 'Région du Sud-Ouest et Ouest forestier (Gagnoa, Daloa, San-Pédro)',
    region: 'Région du Sud-Ouest et Ouest forestier (Gagnoa, Daloa, San-Pédro)',
    rituel_principal: 'Danses acrobatiques, cérémonies d\'apaisement des ancêtres',
    art_caracteristique: 'Masques aux détails expressionnistes puissants, instruments de percussion sacrés',
    image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600'
  },
  {
    id_ethnie: 4,
    nom: 'Mandé du Sud (Dan, Gouro)',
    nom_ethnie: 'Mandé du Sud (Dan, Gouro)',
    description: 'Les Mandés du Sud occupent l\'Ouest montagneux et le Centre-Ouest. Ils possèdent une culture artistique parmi les plus célébrées au niveau mondial, caractérisée par une alliance de raffinement esthétique et de dynamisme chorégraphique unique.',
    region_origine: 'Ouest montagneux (Man, Danané, Bouaflé)',
    region: 'Ouest montagneux (Man, Danané, Bouaflé)',
    rituel_principal: 'Culte des masques médiateurs, échasses rituelles, danse du Zaouli',
    art_caracteristique: 'Masque Zaouli coloré, masques Dan sereins aux yeux en amande',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_EMPLACEMENTS: Emplacement[] = [
  {
    id_emplacement: 1,
    nom: 'Pavillon de l\'Or Royal (Akan)',
    nom_emplacement: 'Pavillon de l\'Or Royal (Akan)',
    description: 'Une salle climatisée sécurisée abritant les trésors de métrologie et d\'orfèvrerie royale. Éclairage feutré basse-tension pour préserver l\'éclat des sculptures dorées.',
    localisation: 'Rez-de-chaussée, Aile Est',
    type_emplacement: 'Exposition permanente',
    capacity: 40,
    temperature: '21°C',
    humidite: '45%'
  },
  {
    id_emplacement: 2,
    nom: 'Galerie des Masques Sacrés',
    nom_emplacement: 'Galerie des Masques Sacrés',
    description: 'Une haute galerie simulant la pénombre des forêts sacrées de l\'Ouest ivoirien. Les masques y sont suspendus devant des panneaux d\'information rétro-éclairés.',
    localisation: 'Rez-de-chaussée, Aile Ouest',
    type_emplacement: 'Exposition permanente',
    capacity: 60,
    temperature: '19°C',
    humidite: '50%'
  },
  {
    id_emplacement: 3,
    nom: 'Espace Poro & Statuaire Sénoufo',
    nom_emplacement: 'Espace Poro & Statuaire Sénoufo',
    description: 'Salle circulaire évoquant les enclos sacrés et les cases sacrées du Nord. Spacieuse, elle permet d\'exposer les statues monumentales du Calao au centre.',
    localisation: 'Premier étage, Aile Est',
    type_emplacement: 'Exposition permanente',
    capacity: 50,
    temperature: '22°C',
    humidite: '40%'
  },
  {
    id_emplacement: 4,
    nom: 'Salon de Musique et Art Contemporain',
    nom_emplacement: 'Salon de Musique et Art Contemporain',
    description: 'Exposition interactive d\'instruments de musique traditionnels (balafons, tambours parleurs) reliés à des systèmes d\'écoute et d\'art contemporain inspiré.',
    localisation: 'Sous-sol',
    type_emplacement: 'Espace interactif',
    capacity: 35,
    temperature: '20°C',
    humidite: '55%'
  }
];

export const INITIAL_OEUVRES: Oeuvre[] = [
  {
    id_oeuvre: 1,
    nom: 'Masque Zaouli',
    nom_oeuvre: 'Masque Zaouli',
    description: 'Masque cérémoniel Gouro utilisé lors des fêtes de réjouissance. Représente un idéal de beauté féminine avec des détails colorés finement sculptés.',
    type_oeuvre: 'Masque',
    taille: '45 cm',
    date_reception: '2024-03-15',
    id_ethnie: 4, // Mandé du Sud (Gouro)
    id_emplacement: 1, // Salle des Masques
    image_principale: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    image_2d: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    modele_3D: '/assets/models/zaouli.glb',
    modele_3d: '/assets/models/zaouli.glb',
    audio_description: 'Vous écoutez le guide descriptif du Masque Zaouli, inscrit à l\'UNESCO. Ce chef-d\'œuvre d\'art Gouro exprime la beauté ultime féminine et se distingue par ses détails polychromes complexes et ses mouvements de danse imitant la nature.',
    audio_duration: '1:45',
    region_id: 'Centre-Ouest',
    region_ivoirienne: 'Gouro (Centre-Ouest)',
    popularity: 98,
    annee_creation: 'Milieu du XXe siècle'
  },
  {
    id_oeuvre: 2,
    nom: 'Statue de Fertilité',
    nom_oeuvre: 'Statue de Fertilité',
    description: 'Statue Baoulé représentant l\'époux ou l\'épouse de l\'au-delà (blolo bla / blolo bian) sculptée dans du bois de fromager noble.',
    type_oeuvre: 'Sculpture',
    taille: '120 cm',
    date_reception: '2024-05-20',
    id_ethnie: 1, // Akan (Baoulé)
    id_emplacement: 2, // Salle des Sculptures
    image_principale: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800',
    image_2d: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800',
    modele_3D: '/assets/models/calao.glb',
    modele_3d: '/assets/models/calao.glb',
    audio_description: 'Le Calao Sénoufo représente l\'oiseau originel qui a mené la vie sur Terre. Son immense ventre et ses ailes déployées forment un dôme de protection spirituelle au-dessus des initiés.',
    audio_duration: '2:10',
    region_id: 'Centre',
    region_ivoirienne: 'Baoulé (Centre)',
    popularity: 92,
    annee_creation: 'Fin du XIXe siècle'
  },
  {
    id_oeuvre: 3,
    nom: 'Masque Kpélié',
    nom_oeuvre: 'Masque Kpélié',
    description: 'Masque initiatique Sénoufo utilisé par la société secrète du Poro. Incarne les esprits protecteurs des ancêtres du sanctuaire.',
    type_oeuvre: 'Masque',
    taille: '38 cm',
    date_reception: '2024-07-10',
    id_ethnie: 2, // Gour (Sénoufo)
    id_emplacement: 1, // Salle des Masques
    image_principale: 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
    image_2d: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
    modele_3D: '/assets/models/goli.glb',
    modele_3d: '/assets/models/goli.glb',
    audio_description: 'Ce masque disque Goli Kpan incarne l\'ancêtre universel dans les croyances Baoulé. Porté en paire, il danse d\'un pas lourd et majestueux.',
    audio_duration: '1:30',
    region_id: 'Nord',
    region_ivoirienne: 'Sénoufo (Nord)',
    popularity: 88,
    annee_creation: 'Vers 1910'
  },
  {
    id_oeuvre: 4,
    nom: 'Masque Gla',
    nom_oeuvre: 'Masque Gla',
    description: 'Grand masque Bété à face humaine, porteur de justice divine et de paix sociale lors des cérémonies de réconciliation.',
    type_oeuvre: 'Masque',
    taille: '60 cm',
    date_reception: '2024-09-01',
    id_ethnie: 3, // Krou (Bété)
    id_emplacement: 1, // Salle des Masques
    image_principale: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1626006450511-aa90869daee6?auto=format&fit=crop&q=80&w=800',
    image_2d: 'https://images.unsplash.com/photo-1626006450511-aa90869daee6?auto=format&fit=crop&q=80&w=800',
    modele_3D: '/assets/models/or_royal.glb',
    modele_3d: '/assets/models/or_royal.glb',
    audio_description: 'L\'or chez les Akan représente la chair du soleil et son esprit éternel. Cet ornement de couronne est une œuvre de joaillerie unique.',
    audio_duration: '1:55',
    region_id: 'Ouest',
    region_ivoirienne: 'Bété (Ouest)',
    popularity: 95,
    annee_creation: 'Début du XXe siècle'
  },
  {
    id_oeuvre: 5,
    nom: 'Siège Royal Baoulé',
    nom_oeuvre: 'Siège Royal Baoulé',
    description: 'Trône sculpté en bois dur de fromager, précieusement réservé au chef du village et orné de motifs géométriques symboliques.',
    type_oeuvre: 'Mobilier',
    taille: '85 cm',
    date_reception: '2025-01-12',
    id_ethnie: 1, // Akan (Baoulé)
    id_emplacement: 2, // Salle des Sculptures
    image_principale: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    image_2d: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    modele_3D: undefined,
    modele_3d: undefined,
    audio_description: 'Le Deangle Dan est un masque pacificateur. Ses yeux mi-clos en amande et sa bouche charnue transmettent un sentiment universel de paix.',
    audio_duration: '1:20',
    region_id: 'Centre',
    region_ivoirienne: 'Baoulé (Centre)',
    popularity: 85,
    annee_creation: 'XVIIIe siècle'
  },
  {
    id_oeuvre: 6,
    nom: 'Pagne Agni Brodé',
    nom_oeuvre: 'Pagne Agni Brodé',
    description: 'Pagne de cérémonie Agni tissé à la main avec du fil d\'or et de coton, aux motifs éclatants symbolisant la royauté et la prospérité.',
    type_oeuvre: 'Textile',
    taille: '200 cm',
    date_reception: '2025-02-28',
    id_ethnie: 1, // Akan (Agni)
    id_emplacement: 3, // Galerie des Textiles
    image_principale: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    image_2D: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    image_2d: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    modele_3D: undefined,
    modele_3d: undefined,
    audio_description: 'Ce double poisson en bronze est à la fois outil économique de balance d\'or et amulette de bonne fortune. Il révèle la richesse du peuple.',
    audio_duration: '1:10',
    region_id: 'Est',
    region_ivoirienne: 'Agni (Est)',
    popularity: 76,
    annee_creation: 'Milieu du XXe siècle'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id_ticket: 1,
    nom_visiteur: 'Amadou Koné',
    email: 'amadou.kone@univ-cocody.ci',
    date_visite: '2026-06-15',
    type_ticket: 'etudiant',
    statut: 'valide',
    date_reservation: '2026-06-05',
    code_unique: 'TICK-AK-10492-CI',
    prix: 1000
  },
  {
    id_ticket: 2,
    nom_visiteur: 'Marie-Cécile Yao',
    email: 'mc.yao@gmail.com',
    date_visite: '2026-06-18',
    type_ticket: 'standard',
    statut: 'en_attente',
    date_reservation: '2026-06-08',
    code_unique: 'TICK-MY-58291-CI',
    prix: 2000
  },
  {
    id_ticket: 3,
    nom_visiteur: 'Dr. David Henderson',
    email: 'd.henderson@smithsonian.org',
    date_visite: '2026-06-25',
    type_ticket: 'virtuel',
    statut: 'valide',
    date_reservation: '2026-06-07',
    code_unique: 'TICK-DH-84902-CI',
    prix: 1500
  },
  {
    id_ticket: 4,
    nom_visiteur: 'Famille Kouadio (4 pers.)',
    email: 'kouadio_famille@yahoo.fr',
    date_visite: '2026-06-20',
    type_ticket: 'famille',
    statut: 'en_attente',
    date_reservation: '2026-06-08',
    code_unique: 'TICK-FK-20381-CI',
    prix: 5000
  },
  {
    id_ticket: 5,
    nom_visiteur: 'Visiteur Démonstration',
    email: 'visiteur@musee-ci.ci',
    date_visite: '2026-06-10',
    type_ticket: 'virtuel',
    statut: 'en_attente',
    date_reservation: '2026-06-08',
    code_unique: 'PASS-DEMO-94021-CI',
    prix: 1500
  }
];

export const INITIAL_COMMENTAIRES: Commentaire[] = [
  {
    id_commentaire: 1,
    nom_user: 'Bonaface G.',
    id_oeuvre: 1,
    commentaire: 'Une fierté nationale sans précédent ! Le niveau de détail du masque Zaouli en 3D est exceptionnel, on ressent tout l\'artisanat des sculpteurs Gouro.',
    date_commentaire: '2026-06-06 14:35:00'
  },
  {
    id_commentaire: 2,
    nom_user: 'Awa Touré',
    id_oeuvre: 1,
    commentaire: 'Pouvoir écouter l\'audio-guide en ligne et tourner l\'œuvre me donne envie d\'aller directement à Zuénoula vivre cela en vrai ! Magnifique travail de préservation.',
    date_commentaire: '2026-06-07 09:20:00'
  },
  {
    id_commentaire: 3,
    nom_user: 'Fatoumata S.',
    id_oeuvre: 2,
    commentaire: 'Le Calao est très imposant. Cette statue Ségbê explique parfaitement l\'esprit protecteur des anciens. Merci pour ces précieux textes explicatifs.',
    date_commentaire: '2026-06-08 11:15:00'
  }
];

export const INITIAL_ACTUALITES: Actualite[] = [
  {
    id_actualite: 1,
    titre: 'Le Zaouli à l\'honneur : Nouvelles intégrations 3D immersives',
    contenu: 'Dans le cadre du plan National de Numérisation du Patrimoine du Ministère de la Culture, le Musée des Civiisations a le plaisir d\'annoncer la numérisation complète en très haute définition de nos principaux masques Gouro. Explorez leurs facettes cachées et découvrez des ornements sculpturaux jusque-là invisibles dans les vitrines physiques.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
    date_publication: '2026-06-01'
  },
  {
    id_actualite: 2,
    titre: 'Exposition "La Cité d\'Or Akan" : Prolongation exceptionnelle',
    contenu: 'Suite au succès fulgurant rencontré ces deux derniers mois par l\'Espace Historique de l\'Or Sacré Akan (bijouterie, parures de trônes, poids d\'or), l\'exposition se prolonge jusqu\'au 31 août 2026 aux pavillons physiques d\'Abidjan et simultanément sur notre portail virtuel 3D avec audio guides révisés en français et en dioula.',
    image: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=600',
    date_publication: '2026-06-05'
  }
];
