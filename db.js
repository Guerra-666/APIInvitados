import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN
});

// Verificar y crear estructura de la base de datos
async function initializeDB() {
  try {
    await client.batch([
      `CREATE TABLE IF NOT EXISTS invitados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        telefono_celular TEXT CHECK (LENGTH(telefono_celular) <= 10),
        invitados_adultos INTEGER NOT NULL CHECK (invitados_adultos BETWEEN 0 AND 10),
        invitados_ninos INTEGER NOT NULL CHECK (invitados_ninos BETWEEN 0 AND 10),
        estatus TEXT NOT NULL CHECK (estatus IN ('Confirmado', 'Pendiente', 'Cancelado')),
        fecha_modificacion TEXT,
        evento_id INTEGER,
        mesa TEXT,
        asistencia BOOLEAN DEFAULT FALSE
      )`
    ], 'write');
    
    console.log('Esquema de base de datos verificado');
  } catch (error) {
    console.error('Error inicializando DB:', error);
    process.exit(1);
  }
}

initializeDB();

export default client;