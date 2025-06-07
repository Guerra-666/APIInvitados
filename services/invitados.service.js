// invitados.service.js - Adaptar a sintaxis async/await
import db from '../config/db.js';

class InvitadosService {
  // Obtener todos los invitados activos
  async getAll() {
    const result = await db.execute(`
      SELECT 
        i.*,
        e.mensaje_invitacion 
      FROM invitados i
      LEFT JOIN eventos e ON i.evento_id = e.id
      WHERE i.activo = 1
      AND e.id == 1
    `);
    return result.rows;
  }

  async getStats() {
    try {
      const result = await db.execute(`
        SELECT 
          COALESCE(SUM(invitados_adultos + invitados_ninos), 0) as totalInvitados,
          COALESCE(SUM(invitados_adultos), 0) as totalAdultos,
          COALESCE(SUM(invitados_ninos), 0) as totalNinos,
          COALESCE(SUM(CASE WHEN estatus = 'Confirmado' THEN invitados_adultos ELSE 0 END), 0) as adultosConfirmados,
          COALESCE(SUM(CASE WHEN estatus = 'Confirmado' THEN invitados_ninos ELSE 0 END), 0) as ninosConfirmados,
          COUNT(CASE WHEN estatus = 'Pendiente' THEN 1 END) as pendientes,
          COUNT(CASE WHEN estatus = 'Cancelado' THEN 1 END) as cancelados
        FROM invitados
        WHERE activo = 1 AND evento_id = 1
      `);
      
      return result.rows[0] || {};
    } catch (error) {
      console.error('Error en getStats:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }

  // Obtener un invitado por ID
  async getById(id) {
    const result = await db.execute({
      sql: 'SELECT * FROM invitados WHERE id = ? AND activo = 1',
      args: [id]
    });
    return result.rows[0] || null;
  }

  // Crear nuevo invitado
  async create(data) {
    const fields = [
      'nombre', 'apellido', 'telefono_celular', 'invitados_adultos',
      'invitados_ninos', 'estatus', 'fecha_modificacion', 'evento_id',
      'mesa', 'asistencia', 'activo'
    ];
    
    const args = fields.map(field => {
        if (field === 'invitados_ninos') return data[field] || 0; // Si no viene el valor, usa 0
        if (field === 'invitados_adultos') return data[field] || 1; // Default 1
        if (field === 'asistencia') return data[field] ? 1 : 0;
        if (field === 'activo') return data[field] ? 1 : 0;
      return data[field] || null;
    });

    const result = await db.execute({
      sql: `INSERT INTO invitados (${fields.join()}) VALUES (${fields.map(() => '?').join()})`,
      args
    });

    return { id: result.lastInsertRowid, ...data };
  }

  // Actualizar invitado
  async update(id, data) {
    const updates = [];
    const args = [];
    
    const fieldsMapping = {
      nombre: 'string',
      apellido: 'string',
      telefono_celular: 'string',
      invitados_adultos: 'number',
      invitados_ninos: 'number',
      estatus: 'string',
      fecha_modificacion: 'string',
      evento_id: 'number',
      mesa: 'string',
      asistencia: 'boolean',
      activo: 'boolean'
    };

    for (const [key, type] of Object.entries(fieldsMapping)) {
      if (data[key] !== undefined) {
        updates.push(`${key} = ?`);
        args.push(
          type === 'boolean' ? (data[key] ? 1 : 0) : data[key]
        );
      }
    }

    if (updates.length === 0) throw new Error('Sin datos para actualizar');
    
    args.push(id);
    
    const result = await db.execute({
      sql: `UPDATE invitados SET ${updates.join()} WHERE id = ?`,
      args
    });

    if (result.rowsAffected === 0) return null;
    return this.getById(id);
  }

  // Soft delete
  async softDelete(id) {
    const result = await db.execute({
      sql: 'UPDATE invitados SET activo = 0 WHERE id = ?',
      args: [id]
    });
    return result.rowsAffected > 0;
  }
}

export default new InvitadosService();