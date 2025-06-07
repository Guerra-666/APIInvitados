// routes/invitados.routes.js
import express from 'express';
import InvitadosController from '../controllers/invitados.controller.js';

const router = express.Router();

// Obtener todos los invitados activos
router.get('/', (req, res, next) => {
  InvitadosController.getAll(req, res, next);
});

router.get('/stats', (req, res, next) => {
  InvitadosController.getStats(req, res, next);
});

// Obtener un invitado específico por ID
router.get('/:id', (req, res, next) => {
  InvitadosController.getById(req, res, next);
});

// Crear un nuevo invitado
router.post('/', (req, res, next) => {
  InvitadosController.create(req, res, next);
});

// Actualizar los datos de un invitado existente
router.put('/:id', (req, res, next) => {
  InvitadosController.update(req, res, next);
});

// "Eliminar" (soft delete) un invitado
router.delete('/:id', (req, res, next) => {
  InvitadosController.softDelete(req, res, next);
});

export default router;
