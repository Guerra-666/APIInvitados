import eventosService from "../services/eventos.service.js";

class EventosController {
  // Brindar el mensaje de invitación de un evento
  async obtenerMensaje(req, res, next) {
    try {
      const { id } = req.params;
      const evento = await eventosService.obtenerMensaje(id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      res.json({ data: evento });
    } catch (error) {
      next(error);
    }
  }

  async actualizarMensaje(req, res, next) {
    try {
      const { id } = req.params;
      const { mensaje } = req.body;

      // Validación básica
      if (!mensaje || mensaje.trim().length < 10) {
        return res.status(400).json({
          error: "El mensaje debe tener al menos 10 caracteres",
        });
      }

      const eventoActualizado = await eventosService.actualizarMensaje(
        id,
        mensaje.trim()
      );

      if (!eventoActualizado) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      res.json({
        message: "Mensaje actualizado exitosamente",
        data: eventoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EventosController();
