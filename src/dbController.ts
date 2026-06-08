import mysql, { Pool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { 
  INITIAL_OEUVRES, 
  INITIAL_ETHNIES, 
  INITIAL_EMPLACEMENTS, 
  INITIAL_TICKETS, 
  INITIAL_COMMENTAIRES, 
  INITIAL_ACTUALITES 
} from './data/mockData';
import { Oeuvre, Ethnie, Emplacement, Ticket, Commentaire, Actualite, User } from './types';

// Load environmental parameters
const dbConfig = {
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
};

let pool: Pool | null = null;
let useLocalFallback = true;
const fallbackFilePath = path.join(process.cwd(), 'src', 'data', 'local_db.json');

// Initialize Pool if settings are provided
if (dbConfig.host && dbConfig.user) {
  try {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('🔌 Base de données MySQL configurée principale connectée avec succès.');
    useLocalFallback = false;
  } catch (err) {
    console.warn('⚠️ Échec de connexion au pool MySQL. Utilisation du stockage JSON persistant local.', err);
    useLocalFallback = true;
  }
} else {
  console.log('ℹ️ Paramètres de base de données MySQL non configurés. Mode stockage local JSON actif.');
  useLocalFallback = true;
}

// Local mock database state structure
interface DBState {
  oeuvres: Oeuvre[];
  ethnies: Ethnie[];
  emplacements: Emplacement[];
  tickets: Ticket[];
  comments: Commentaire[];
  actualites: Actualite[];
  users: any[];
}

// Seed or load local JSON database
function loadLocalDB(): DBState {
  if (!fs.existsSync(fallbackFilePath)) {
    const defaultState: DBState = {
      oeuvres: [],
      ethnies: [],
      emplacements: [],
      tickets: [],
      comments: [],
      actualites: [],
      users: [
        { email: 'admin@musee-ci.ci', mot_passe: 'admin123', role: 'administrateur' },
        { email: 'visiteur@musee-ci.ci', mot_passe: 'visiteur123', role: 'visiteur' }
      ]
    };
    fs.mkdirSync(path.dirname(fallbackFilePath), { recursive: true });
    fs.writeFileSync(fallbackFilePath, JSON.stringify(defaultState, null, 2), 'utf-8');
    return defaultState;
  }
  try {
    const raw = fs.readFileSync(fallbackFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lors du chargement de la base locale JSON, re-génération:', err);
    return {
      oeuvres: [],
      ethnies: [],
      emplacements: [],
      tickets: [],
      comments: [],
      actualites: [],
      users: [
        { email: 'admin@musee-ci.ci', mot_passe: 'admin123', role: 'administrateur' },
        { email: 'visiteur@musee-ci.ci', mot_passe: 'visiteur123', role: 'visiteur' }
      ]
    };
  }
}

function saveLocalDB(state: DBState) {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erreur d\'écriture sur la base locale JSON:', err);
  }
}

// Database Actions with Fallback
export async function getOeuvres(): Promise<Oeuvre[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM oeuvres');
      return rows as Oeuvre[];
    } catch (e) {
      console.error('Erreur SQL, bascule sur local:', e);
    }
  }
  return loadLocalDB().oeuvres;
}

export async function saveOeuvre(o: Omit<Oeuvre, 'id_oeuvre'> & { id_oeuvre?: number }): Promise<Oeuvre> {
  if (!useLocalFallback && pool) {
    try {
      if (o.id_oeuvre) {
        await pool.query(
          `UPDATE oeuvres SET nom=?, description=?, type_oeuvre=?, taille=?, date_reception=?, id_ethnie=?, id_emplacement=?, image_principale=?, image_2D=?, modele_3D=?, audio_description=?, audio_duration=?, region_ivoirienne=?, popularity=?, annee_creation=? WHERE id_oeuvre=?`,
          [o.nom, o.description, o.type_oeuvre, o.taille, o.date_reception, o.id_ethnie, o.id_emplacement, o.image_principale, o.image_2D, o.modele_3D, o.audio_description, o.audio_duration, o.region_ivoirienne, o.popularity, o.annee_creation, o.id_oeuvre]
        );
        return o as Oeuvre;
      } else {
        const [result] = await pool.query(
          `INSERT INTO oeuvres (nom, description, type_oeuvre, taille, date_reception, id_ethnie, id_emplacement, image_principale, image_2D, modele_3D, audio_description, audio_duration, region_ivoirienne, popularity, annee_creation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [o.nom, o.description, o.type_oeuvre, o.taille, o.date_reception, o.id_ethnie, o.id_emplacement, o.image_principale, o.image_2D, o.modele_3D, o.audio_description, o.audio_duration, o.region_ivoirienne, o.popularity, o.annee_creation]
        );
        const insertId = (result as any).insertId;
        return { ...o, id_oeuvre: insertId } as Oeuvre;
      }
    } catch (e) {
      console.error('Erreur SQL de sauvegarde, fallback local:', e);
    }
  }
  const db = loadLocalDB();
  if (o.id_oeuvre) {
    db.oeuvres = db.oeuvres.map(item => item.id_oeuvre === o.id_oeuvre ? (o as Oeuvre) : item);
    saveLocalDB(db);
    return o as Oeuvre;
  } else {
    const nextId = db.oeuvres.reduce((max, x) => x.id_oeuvre > max ? x.id_oeuvre : max, 0) + 1;
    const newOeuvre = { ...o, id_oeuvre: nextId } as Oeuvre;
    db.oeuvres.push(newOeuvre);
    saveLocalDB(db);
    return newOeuvre;
  }
}

export async function deleteOeuvre(id: number): Promise<boolean> {
  if (!useLocalFallback && pool) {
    try {
      await pool.query('DELETE FROM oeuvres WHERE id_oeuvre = ?', [id]);
      return true;
    } catch (e) {
      console.error('Erreur SQL de suppression:', e);
    }
  }
  const db = loadLocalDB();
  db.oeuvres = db.oeuvres.filter(o => o.id_oeuvre !== id);
  saveLocalDB(db);
  return true;
}

// ETHNIES
export async function getEthnies(): Promise<Ethnie[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM ethnies');
      return rows as Ethnie[];
    } catch (e) {
      console.error(e);
    }
  }
  return loadLocalDB().ethnies;
}

export async function saveEthnie(eth: Omit<Ethnie, 'id_ethnie'> & { id_ethnie?: number }): Promise<Ethnie> {
  if (!useLocalFallback && pool) {
    try {
      if (eth.id_ethnie) {
        await pool.query(
          `UPDATE ethnies SET nom=?, description=?, region_origine=?, rituel_principal=?, art_caracteristique=?, image_url=? WHERE id_ethnie=?`,
          [eth.nom, eth.description, eth.region_origine, eth.rituel_principal, eth.art_caracteristique, eth.image_url, eth.id_ethnie]
        );
        return eth as Ethnie;
      } else {
        const [result] = await pool.query(
          `INSERT INTO ethnies (nom, description, region_origine, rituel_principal, art_caracteristique, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
          [eth.nom, eth.description, eth.region_origine, eth.rituel_principal, eth.art_caracteristique, eth.image_url]
        );
        const insertId = (result as any).insertId;
        return { ...eth, id_ethnie: insertId } as Ethnie;
      }
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  if (eth.id_ethnie) {
    db.ethnies = db.ethnies.map(item => item.id_ethnie === eth.id_ethnie ? (eth as Ethnie) : item);
    saveLocalDB(db);
    return eth as Ethnie;
  } else {
    const nextId = db.ethnies.reduce((max, x) => x.id_ethnie > max ? x.id_ethnie : max, 0) + 1;
    const item = { ...eth, id_ethnie: nextId } as Ethnie;
    db.ethnies.push(item);
    saveLocalDB(db);
    return item;
  }
}

export async function deleteEthnie(id: number): Promise<boolean> {
  if (!useLocalFallback && pool) {
    try {
      await pool.query('DELETE FROM ethnies WHERE id_ethnie = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  db.ethnies = db.ethnies.filter(x => x.id_ethnie !== id);
  saveLocalDB(db);
  return true;
}

// EMPLACEMENTS
export async function getEmplacements(): Promise<Emplacement[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM emplacements');
      return rows as Emplacement[];
    } catch (e) {
      console.error(e);
    }
  }
  return loadLocalDB().emplacements;
}

export async function saveEmplacement(em: Omit<Emplacement, 'id_emplacement'> & { id_emplacement?: number }): Promise<Emplacement> {
  if (!useLocalFallback && pool) {
    try {
      if (em.id_emplacement) {
        await pool.query(
          `UPDATE emplacements SET nom=?, description=?, capacity=?, temperature=?, humidite=? WHERE id_emplacement=?`,
          [em.nom, em.description, em.capacity, em.temperature, em.humidite, em.id_emplacement]
        );
        return em as Emplacement;
      } else {
        const [result] = await pool.query(
          `INSERT INTO emplacements (nom, description, capacity, temperature, humidite) VALUES (?, ?, ?, ?, ?)`,
          [em.nom, em.description, em.capacity, em.temperature, em.humidite]
        );
        const insertId = (result as any).insertId;
        return { ...em, id_emplacement: insertId } as Emplacement;
      }
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  if (em.id_emplacement) {
    db.emplacements = db.emplacements.map(item => item.id_emplacement === em.id_emplacement ? (em as Emplacement) : item);
    saveLocalDB(db);
    return em as Emplacement;
  } else {
    const nextId = db.emplacements.reduce((max, x) => x.id_emplacement > max ? x.id_emplacement : max, 0) + 1;
    const item = { ...em, id_emplacement: nextId } as Emplacement;
    db.emplacements.push(item);
    saveLocalDB(db);
    return item;
  }
}

export async function deleteEmplacement(id: number): Promise<boolean> {
  if (!useLocalFallback && pool) {
    try {
      await pool.query('DELETE FROM emplacements WHERE id_emplacement = ?', [id]);
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  db.emplacements = db.emplacements.filter(x => x.id_emplacement !== id);
  saveLocalDB(db);
  return true;
}

// TICKETS
export async function getTickets(): Promise<Ticket[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM tickets ORDER BY id_ticket DESC');
      return rows as Ticket[];
    } catch (e) {
      console.error(e);
    }
  }
  return loadLocalDB().tickets;
}

export async function saveTicket(t: any): Promise<Ticket> {
  if (!useLocalFallback && pool) {
    try {
      if (t.id_ticket) {
        await pool.query(
          `UPDATE tickets SET nom_visiteur=?, email=?, date_visite=?, type_ticket=?, statut=?, date_reservation=?, code_unique=?, prix=?, activation_time=? WHERE id_ticket=?`,
          [t.nom_visiteur, t.email, t.date_visite, t.type_ticket, t.statut, t.date_reservation, t.code_unique, t.prix, t.activation_time || null, t.id_ticket]
        );
        return t as Ticket;
      } else {
        const [result] = await pool.query(
          `INSERT INTO tickets (nom_visiteur, email, date_visite, type_ticket, statut, date_reservation, code_unique, prix, activation_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [t.nom_visiteur, t.email, t.date_visite, t.type_ticket, t.statut, t.date_reservation, t.code_unique, t.prix, t.activation_time || null]
        );
        const insertId = (result as any).insertId;
        return { ...t, id_ticket: insertId } as Ticket;
      }
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  if (t.id_ticket) {
    db.tickets = db.tickets.map(item => item.id_ticket === t.id_ticket ? (t as Ticket) : item);
    saveLocalDB(db);
    return t as Ticket;
  } else {
    const nextId = db.tickets.reduce((max, x) => x.id_ticket > max ? x.id_ticket : max, 0) + 1;
    const item = { ...t, id_ticket: nextId } as Ticket;
    db.tickets.push(item);
    saveLocalDB(db);
    return item;
  }
}

export async function updateTicketStatus(id: number, statut: 'valide' | 'refuse', activation_time?: number): Promise<boolean> {
  if (!useLocalFallback && pool) {
    try {
      if (activation_time) {
        await pool.query('UPDATE tickets SET statut = ?, activation_time = ? WHERE id_ticket = ?', [statut, activation_time, id]);
      } else {
        await pool.query('UPDATE tickets SET statut = ? WHERE id_ticket = ?', [statut, id]);
      }
      return true;
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  db.tickets = db.tickets.map(item => {
    if (item.id_ticket === id) {
      const updated: Ticket = { 
        ...item, 
        statut,
        activation_time: activation_time || item.activation_time
      };
      return updated;
    }
    return item;
  });
  saveLocalDB(db);
  return true;
}

// COMMENTS
export async function getComments(): Promise<Commentaire[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM commentaires ORDER BY date_commentaire DESC');
      return rows as Commentaire[];
    } catch (e) {
      console.error(e);
    }
  }
  return loadLocalDB().comments;
}

export async function saveComment(c: Omit<Commentaire, 'id_commentaire'>): Promise<Commentaire> {
  if (!useLocalFallback && pool) {
    try {
      const [result] = await pool.query(
        `INSERT INTO commentaires (nom_user, id_oeuvre, commentaire, date_commentaire) VALUES (?, ?, ?, ?)`,
        [c.nom_user, c.id_oeuvre, c.commentaire, c.date_commentaire]
      );
      const insertId = (result as any).insertId;
      return { ...c, id_commentaire: insertId } as Commentaire;
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  const nextId = db.comments.reduce((max, x) => x.id_commentaire > max ? x.id_commentaire : max, 0) + 1;
  const item = { ...c, id_commentaire: nextId } as Commentaire;
  db.comments.unshift(item);
  saveLocalDB(db);
  return item;
}

// ACTUALITES
export async function getActualites(): Promise<Actualite[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM actualites ORDER BY date_publication DESC');
      return rows as Actualite[];
    } catch (e) {
      console.error(e);
    }
  }
  return loadLocalDB().actualites;
}

// USERS AUTHENTICATION
export async function getUsers(): Promise<any[]> {
  if (!useLocalFallback && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      return rows as any[];
    } catch (e) {
      console.error(e);
    }
  }
  return loadLocalDB().users;
}

export async function saveUser(user: { email: string; username: string; mot_passe: string; role: string }): Promise<any> {
  if (!useLocalFallback && pool) {
    try {
      await pool.query(
        `INSERT INTO users (email, username, mot_passe, role, avatar_url) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=?, mot_passe=?, role=?`,
        [user.email, user.username, user.mot_passe, user.role, `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`, user.username, user.mot_passe, user.role]
      );
      return user;
    } catch (e) {
      console.error(e);
    }
  }
  const db = loadLocalDB();
  const exists = db.users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) {
    db.users = db.users.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? user : u);
  } else {
    db.users.push(user);
  }
  saveLocalDB(db);
  return user;
}

export async function clearAllDatabaseData(): Promise<void> {
  if (!useLocalFallback && pool) {
    try {
      await pool.query('SET FOREIGN_KEY_CHECKS = 0');
      await pool.query('TRUNCATE TABLE commentaires');
      await pool.query('TRUNCATE TABLE tickets');
      await pool.query('TRUNCATE TABLE oeuvres');
      await pool.query('TRUNCATE TABLE ethnies');
      await pool.query('TRUNCATE TABLE emplacements');
      await pool.query('TRUNCATE TABLE actualites');
      await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      console.error('Erreur de vidage SQL:', e);
    }
  }

  const db = loadLocalDB();
  db.oeuvres = [];
  db.ethnies = [];
  db.emplacements = [];
  db.tickets = [];
  db.comments = [];
  db.actualites = [];
  db.users = [
    { email: 'admin@musee-ci.ci', mot_passe: 'admin123', role: 'administrateur' },
    { email: 'visiteur@musee-ci.ci', mot_passe: 'visiteur123', role: 'visiteur' }
  ];
  // Retain admin/visitor accounts so that they can authenticate after wiping
  saveLocalDB(db);
}

