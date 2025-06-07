import db from '../config/db.js';

class EventosService {

    // Obtener mensaje de invitación de un evento
    async obtenerMensaje(eventoId) {
        try {
            const result = await db.execute({
                sql: 'SELECT mensaje_invitacion FROM eventos WHERE id = ?',
                args: [eventoId]
            });

            return result.rows[0] || null;
        } catch (error) {
            console.error('Error obteniendo mensaje:', error);
            throw new Error('Error al obtener el mensaje');
        }
    }

    async actualizarMensaje(eventoId, nuevoMensaje) {
        try {
          const result = await db.execute({
            sql: `UPDATE eventos 
                  SET mensaje_invitacion = ?, 
                      updated_at = datetime('now') 
                  WHERE id = ? 
                  RETURNING id, mensaje_invitacion, updated_at`,
            args: [nuevoMensaje, eventoId]
          });
      
          return result.rows[0] || null;
        } catch (error) {
          console.error('Error actualizando mensaje:', error);
          throw new Error('Error al actualizar el mensaje');
        }
      }
}

export default new EventosService();