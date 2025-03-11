import express from 'express';
import cors from 'cors';
import invitadosRouter from './routes/invitados.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración mejorada de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tudominio.com'] 
    : ['http://localhost:4321'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/invitados', invitadosRouter);

app.get('/api/invitados/stats', (req, res) => {
  // Ejemplo de implementación. Si no la tienes definida, el endpoint generará error 500.
  res.json({ total: 10, confirmados: 5, pendientes: 3, cancelados: 2 });
});

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    db: 'Turso',
    version: '1.0.0'
  });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Turso corriendo en: http://localhost:${PORT}`);
});