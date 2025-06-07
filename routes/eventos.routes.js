import express from 'express';
import EventosController from '../controllers/eventos.controller.js';

const router = express.Router();


// Actualizar mensaje de invitación (sin auth)
router.put('/:id/mensaje', EventosController.actualizarMensaje);

// Obtener mensaje de invitación (sin auth)
router.get('/:id/mensaje', EventosController.obtenerMensaje);

export default router;