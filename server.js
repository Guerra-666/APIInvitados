// server.js - Configuración del servidor Express

import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import invitadosRoutes from "./routes/invitados.routes.js";
import eventosRoutes from "./routes/eventos.routes.js";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://tudominio.com"] // Dominios permitidos en producción
        : ["http://localhost:5173", "http://localhost:4321"], // Dominios permitidos en desarrollo
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware para parsear solicitudes JSON
app.use(express.json());

// Rutas de la API
app.use("/api/invitados", invitadosRoutes);
app.use("/api/eventos", eventosRoutes);

// Ruta de salud (Health Check)
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "API de Invitados funcionando",
  });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === "development" ? err.message : null,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
