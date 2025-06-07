// controllers/invitados.controller.js
import invitadosService from '../services/invitados.service.js';

class InvitadosController {
  // Obtener todos los invitados activos
  async getAll(req, res, next) {
    try {
      const invitados = await invitadosService.getAll();
      res.json({ 
        message: "success todos",
        data: invitados 
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await invitadosService.getStats();
      res.json({
        message: "success",
        data: {
          totalInvitados: stats.totalInvitados || 0,
          totalAdultos: stats.totalAdultos || 0,
          totalNinos: stats.totalNinos || 0,
          totalConfirmados: (stats.adultosConfirmados || 0) + (stats.ninosConfirmados || 0),
          totalAdultosConfirmados: stats.adultosConfirmados || 0,
          totalNinosConfirmados: stats.ninosConfirmados || 0,
          pendientes: stats.pendientes || 0,
          cancelados: stats.cancelados || 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtener un invitado por su ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const invitado = await invitadosService.getById(id);
      if (!invitado) {
        return res.status(404).json({ message: "Invitado no encontrado" });
      }
      res.json({ message: "success", data: invitado });
    } catch (error) {
      next(error);
    }
  }

  // Crear un nuevo invitado
  async create(req, res, next) {
    
    try {
      const newInvitado = await invitadosService.create(req.body);
      const safeData = {
        ...newInvitado,
        id: Number(newInvitado.id) // Asumiendo que el campo problemático es "id"
        
      };
      res.status(201).json({ message: "Invitado creado", data: safeData });
    } catch (error) {
      next(error);
    }
  }

  // Actualizar datos de un invitado existente
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedInvitado = await invitadosService.update(id, req.body);
      if (!updatedInvitado) {
        return res.status(404).json({ message: "Invitado no encontrado" });
      }
      res.json({ message: "Invitado actualizado", data: updatedInvitado });
    } catch (error) {
      next(error);
    }
  }

  // "Eliminar" un invitado (soft delete: actualizar el campo activo a false)
  async softDelete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await invitadosService.softDelete(id);
      if (!result) {
        return res.status(404).json({ message: "Invitado no encontrado" });
      }
      res.json({ message: "Invitado deshabilitado" });
    } catch (error) {
      next(error);
    }
  }
}

export default new InvitadosController();
