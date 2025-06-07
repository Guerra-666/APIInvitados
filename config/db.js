// db.js - Validación de variables
import { createClient } from '@libsql/client';
import 'dotenv/config';

const requiredEnv = ['TURSO_DB_URL', 'TURSO_DB_AUTH_TOKEN'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Falta la variable de entorno requerida: ${env}`);
  }
});

const turso = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
});

export default turso;