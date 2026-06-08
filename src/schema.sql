-- =====================================================================
-- SCHEMA DE LA BASE DE DONNÉES DU MUSÉE NUMÉRIQUE DE CÔTE D'IVOIRE (MNC)
-- Compatible avec MySQL 5.7+ / 8.0+
-- =====================================================================

CREATE DATABASE IF NOT EXISTS musee_db DEFAULT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';
USE musee_db;

-- 1. Table : users (Utilisateurs & Administrateurs)
CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(191) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    mot_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'visiteur',
    avatar_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensemencement initial des comptes d'administration et de test
INSERT INTO users (email, username, mot_passe, role, avatar_url) VALUES
('admin@musee-ci.ci', 'Administrateur', 'admin123', 'administrateur', 'https://api.dicebear.com/7.x/identicon/svg?seed=admin'),
('visiteur@musee-ci.ci', 'Visiteur', 'visiteur123', 'visiteur', 'https://api.dicebear.com/7.x/identicon/svg?seed=visiteur')
ON DUPLICATE KEY UPDATE email=email;


-- 2. Table : ethnies (Origines Culturelles)
CREATE TABLE IF NOT EXISTS ethnies (
    id_ethnie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    region_origine VARCHAR(255) NOT NULL,
    rituel_principal VARCHAR(255) NOT NULL,
    art_caracteristique VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO ethnies (id_ethnie, nom, description, region_origine, rituel_principal, art_caracteristique, image_url) VALUES
(1, 'Akan (Baoulé, Agni, Ebrié)', 'Le groupe Akan occupies the Central, Eastern and Southern sectors. Known for complex royalty structures, significance of gold and magnificent goldsmith crafts.', 'Centre, Est et Littoral Sud de la Côte d\'Ivoire', 'La fête des ignames, l\'intronisation royale', 'Orfèvrerie (poids à peser l\'or, bijoux royaux), masques de portrait Baoulé, pagnes Kita', 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=600'),
(2, 'Gour / Voltaïque (Sénoufo, Lobi)', 'Located in the North of CIV, Sénoufo are worldwide famous for their secret sacred Poro initiation cycle.', 'Région du Nord (Korhogo, Ferkessédougou)', 'Le Poro (rite d\'initiation secret), Funérailles rituelles', 'Sculptures sur bois monumentales (Calao protecteur), toiles de Korhogo peintes, masques de buffle', 'https://images.unsplash.com/photo-1608985160805-4f48bba0612d?auto=format&fit=crop&q=80&w=600'),
(3, 'Krou (Bété, Guéré, Wê)', 'Living in the Center-West forest, known for their powerful masks of forest spirits and acrobatic dances.', 'Région du Sud-Ouest et Ouest forestier (Gagnoa, Daloa, San-Pédro)', 'Danses acrobatiques, cérémonies d\'apaisement des ancêtres', 'Masques aux détails expressionnistes puissants, instruments de percussion sacrés', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600'),
(4, 'Mandé du Sud (Dan, Gouro)', 'Occupying the Western mountains. Famous for the visual power and choreographic richness of their traditional masks.', 'Ouest montagneux (Man, Danané, Bouaflé)', 'Culte des masques médiateurs, échasses rituelles, danse du Zaouli', 'Masque Zaouli coloré, masques Dan sereins aux yeux en amande', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600')
ON DUPLICATE KEY UPDATE id_ethnie=id_ethnie;


-- 3. Table : emplacements (Garde / Galeries du musée)
CREATE TABLE IF NOT EXISTS emplacements (
    id_emplacement INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    localisation VARCHAR(255) NULL,
    type_emplacement VARCHAR(100) NULL,
    capacity INT DEFAULT 30,
    temperature VARCHAR(50) DEFAULT '21°C',
    humidite VARCHAR(50) DEFAULT '45%'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO emplacements (id_emplacement, nom, description, localisation, type_emplacement, capacity, temperature, humidite) VALUES
(1, 'Pavillon de l\'Or Royal (Akan)', 'Une salle climatisée sécurisée abritant les trésors de métrologie et d\'orfèvrerie royale.', 'Rez-de-chaussée, Aile Est', 'Exposition permanente', 40, '21°C', '45%'),
(2, 'Galerie des Masques Sacrés', 'Une haute galerie simulant la pénombre des forêts sacrées de l\'Ouest ivoirien.', 'Rez-de-chaussée, Aile Ouest', 'Exposition permanente', 60, '19°C', '50%'),
(3, 'Espace Poro & Statuaire Sénoufo', 'Salle circulaire évoquant les enclos sacrés et les cases sacrées du Nord.', 'Premier étage, Aile Est', 'Exposition permanente', 50, '22°C', '40%'),
(4, 'Salon de Musique et Art Contemporain', 'Exposition interactive d\'instruments de musique traditionnels reliés à des systèmes d\'écoute.', 'Sous-sol', 'Espace interactif', 35, '20°C', '55%')
ON DUPLICATE KEY UPDATE id_emplacement=id_emplacement;


-- 4. Table : oeuvres (Le Catalogue du patrimoine)
CREATE TABLE IF NOT EXISTS oeuvres (
    id_oeuvre INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type_oeuvre VARCHAR(100) NOT NULL,
    taille VARCHAR(50) NOT NULL,
    date_reception DATE NOT NULL,
    id_ethnie INT NOT NULL,
    id_emplacement INT NOT NULL,
    image_principale TEXT NOT NULL,
    image_2D TEXT NOT NULL,
    modele_3D VARCHAR(255) NULL,
    audio_description TEXT NOT NULL,
    audio_duration VARCHAR(20) DEFAULT '2:00',
    region_ivoirienne VARCHAR(150) NOT NULL,
    popularity INT DEFAULT 50,
    annee_creation VARCHAR(100) NULL,
    FOREIGN KEY (id_ethnie) REFERENCES ethnies(id_ethnie) ON DELETE RESTRICT,
    FOREIGN KEY (id_emplacement) REFERENCES emplacements(id_emplacement) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO oeuvres (id_oeuvre, nom, description, type_oeuvre, taille, date_reception, id_ethnie, id_emplacement, image_principale, image_2D, modele_3D, audio_description, audio_duration, region_ivoirienne, popularity, annee_creation) VALUES
(1, 'Masque Zaouli', 'Masque cérémoniel Gouro utilisé lors des fêtes de réjouissance. Représente un idéal de beauté féminine avec des détails colorés finement sculptés.', 'Masque', '45 cm', '2024-03-15', 4, 2, 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800', 'assets/models/zaouli.glb', 'Vous écoutez le guide descriptif du Masque Zaouli, inscrit à l\'UNESCO. Ce chef-d\'œuvre d\'art Gouro exprime la beauté ultime féminine et se distingue par ses détails polychromes complexes.', '1:45', 'Gouro (Centre-Ouest)', 98, 'Milieu du XXe siècle'),
(2, 'Statue de Fertilité', 'Statue Baoulé représentant l\'époux ou l\'épouse de l\'au-delà (blolo bla / blolo bian) sculptée dans du bois de fromager noble.', 'Sculpture', '120 cm', '2024-05-20', 1, 1, 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?auto=format&fit=crop&q=80&w=800', 'assets/models/calao.glb', 'Le Calao Sénoufo représente l\'oiseau originel qui a mené la vie sur Terre. Son immense ventre et ses ailes déployées forment un dôme de protection spirituelle.', '2:10', 'Baoulé (Centre)', 92, 'Fin du XIXe siècle'),
(3, 'Masque Kpélié', 'Masque initiatique Sénoufo utilisé par la société secrète du Poro. Incarne les esprits protecteurs des ancêtres du sanctuaire.', 'Masque', '38 cm', '2024-07-10', 2, 3, 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800', 'assets/models/goli.glb', 'Ce masque disque Goli Kpan incarne l\'ancêtre universel dans les croyances Baoulé. Porté en paire, il danse d\'un pas lourd.', '1:30', 'Sénoufo (Nord)', 88, 'Vers 1910'),
(4, 'Masque Gla', 'Grand masque Bété à face humaine, porteur de justice divine et de paix sociale lors des cérémonies de réconciliation.', 'Masque', '60 cm', '2024-09-01', 3, 2, 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1626006450511-aa90869daee6?auto=format&fit=crop&q=80&w=800', 'assets/models/or_royal.glb', 'L\'or chez les Akan représente la chair du soleil et son esprit éternel. Cet ornement de couronne est une œuvre de joaillerie unique.', '1:55', 'Bété (Ouest)', 95, 'Début du XXe siècle')
ON DUPLICATE KEY UPDATE id_oeuvre=id_oeuvre;


-- 5. Table : tickets (Sésames d'accès)
CREATE TABLE IF NOT EXISTS tickets (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    nom_visiteur VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    date_visite DATE NOT NULL,
    type_ticket VARCHAR(50) NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
    date_reservation DATE NOT NULL,
    code_unique VARCHAR(100) NOT NULL UNIQUE,
    prix INT NOT NULL,
    activation_time BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO tickets (id_ticket, nom_visiteur, email, date_visite, type_ticket, statut, date_reservation, code_unique, prix) VALUES
(1, 'Amadou Koné', 'amadou.kone@univ-cocody.ci', '2026-06-15', 'etudiant', 'valide', '2026-06-05', 'TICK-AK-10492-CI', 1000),
(2, 'Marie-Cécile Yao', 'mc.yao@gmail.com', '2026-06-18', 'standard', 'en_attente', '2026-06-08', 'TICK-MY-58291-CI', 2000),
(3, 'Dr. David Henderson', 'd.henderson@smithsonian.org', '2026-06-25', 'virtuel', 'valide', '2026-06-07', 'TICK-DH-84902-CI', 1500)
ON DUPLICATE KEY UPDATE id_ticket=id_ticket;


-- 6. Table : commentaires (Le livre d'or)
CREATE TABLE IF NOT EXISTS commentaires (
    id_commentaire INT AUTO_INCREMENT PRIMARY KEY,
    nom_user VARCHAR(100) NOT NULL,
    id_oeuvre INT NOT NULL,
    commentaire TEXT NOT NULL,
    date_commentaire DATETIME NOT NULL,
    FOREIGN KEY (id_oeuvre) REFERENCES oeuvres(id_oeuvre) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO commentaires (id_commentaire, nom_user, id_oeuvre, commentaire, date_commentaire) VALUES
(1, 'Bonaface G.', 1, 'Une fierté nationale sans précédent ! Le niveau de détail du masque Zaouli en 3D est exceptionnel.', '2026-06-06 14:35:00'),
(2, 'Awa Touré', 1, 'Pouvoir écouter l\'audio-guide en ligne et tourner l\'œuvre me donne envie d\'aller directement à Zuénoula !', '2026-06-07 09:20:00')
ON DUPLICATE KEY UPDATE id_commentaire=id_commentaire;


-- 7. Table : actualites (Le carrousel d'actualités)
CREATE TABLE IF NOT EXISTS actualites (
    id_actualite INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    image TEXT NOT NULL,
    date_publication DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO actualites (id_actualite, titre, contenu, image, date_publication) VALUES
(1, 'Le Zaouli à l\'honneur : Nouvelles intégrations 3D immersives', 'Dans le cadre du plan National de Numérisation du Patrimoine du Ministère de la Culture, le Musée des Civiisations a le plaisir d\'annoncer la numérisation complète du masque Gouro.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600', '2026-06-01'),
(2, 'Exposition "La Cité d\'Or Akan" : Prolongation exceptionnelle', 'Suite au succès fulgurant de l\'Espace Historique de l\'Or Sacré Akan, l\'exposition se prolonge jusqu\'au 31 août 2026 à Abidjan et en virtuel.', 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=600', '2026-06-05')
ON DUPLICATE KEY UPDATE id_actualite=id_actualite;
