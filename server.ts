import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment configurations from .env
dotenv.config();

import {
  getOeuvres,
  saveOeuvre,
  deleteOeuvre,
  getEthnies,
  saveEthnie,
  deleteEthnie,
  getEmplacements,
  saveEmplacement,
  deleteEmplacement,
  getTickets,
  saveTicket,
  updateTicketStatus,
  getComments,
  saveComment,
  getActualites,
  getUsers,
  saveUser,
  clearAllDatabaseData
} from "./src/dbController";

async function runBackend() {
  const app = express();
  const PORT = 3000;

  // Middleware to automatically parse incoming JSON data payload bodies
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // ==========================================
  // REST API Endpoints linked to dbController
  // ==========================================

  // --- CATALOGUE OEUVRES ---
  app.get("/api/oeuvres", async (req, res) => {
    try {
      const items = await getOeuvres();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.post("/api/oeuvres", async (req, res) => {
    try {
      const saved = await saveOeuvre(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.delete("/api/oeuvres/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await deleteOeuvre(id);
      res.json({ success: true, id_deleted: id });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- ETHNIES ---
  app.get("/api/ethnies", async (req, res) => {
    try {
      const items = await getEthnies();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.post("/api/ethnies", async (req, res) => {
    try {
      const saved = await saveEthnie(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.delete("/api/ethnies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await deleteEthnie(id);
      res.json({ success: true, id_deleted: id });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- EMPLACEMENTS / GALERIES ---
  app.get("/api/emplacements", async (req, res) => {
    try {
      const items = await getEmplacements();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.post("/api/emplacements", async (req, res) => {
    try {
      const saved = await saveEmplacement(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.delete("/api/emplacements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await deleteEmplacement(id);
      res.json({ success: true, id_deleted: id });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- TICKETS ---
  app.get("/api/tickets", async (req, res) => {
    try {
      const items = await getTickets();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const saved = await saveTicket(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.put("/api/tickets/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { statut, activation_time } = req.body;
      const success = await updateTicketStatus(id, statut, activation_time);
      res.json({ success, id, statut });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- COMMENTS BOOK ---
  app.get("/api/comments", async (req, res) => {
    try {
      const items = await getComments();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const saved = await saveComment(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- NEWS ACTUALITES ---
  app.get("/api/actualites", async (req, res) => {
    try {
      const items = await getActualites();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- USERS MEMBERSHIP ---
  app.get("/api/users", async (req, res) => {
    try {
      const items = await getUsers();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const saved = await saveUser(req.body);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // --- SYSTEM MAINTENANCE / WIPE DATABASE ---
  app.post("/api/clear-all", async (req, res) => {
    try {
      await clearAllDatabaseData();
      res.json({ success: true, message: "Toutes les données ont été vidées avec succès de la base de données principal et locale." });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Internal Server Error" });
    }
  });

  // ==========================================
  // Vite Middleware Setup for Frontend SPA
  // ==========================================

  if (process.env.NODE_ENV !== "production") {
    // Development mode: route UI assets to Vite Development Server on the fly
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve the compiled static assets directly from /dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind server listener to Host and Port required by Cloud Run Container
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur Musée Numérique en ligne sur http://localhost:${PORT}`);
  });
}

runBackend().catch((err) => {
  console.error("Échec critique lors du démarrage du serveur Express backend:", err);
});
