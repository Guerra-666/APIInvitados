import express from 'express';
import client from '../db.js';

const router = express.Router();

// Middleware para manejo de errores
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Modificar la consulta de estadísticas para incluir campo activo
router.get('/stats', asyncHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      SUM(invitados_adultos + invitados_ninos) as total_invitados,
      SUM(invitados_adultos) as total_adultos,
      SUM(invitados_ninos) as total_ninos,
      SUM(CASE WHEN estatus = 'Confirmado' THEN invitados_adultos ELSE 0 END) as adultos_confirmados,
      SUM(CASE WHEN estatus = 'Confirmado' THEN invitados_ninos ELSE 0 END) as ninos_confirmados,
      COUNT(CASE WHEN estatus = 'Pendiente' THEN 1 END) as pendientes,
      COUNT(CASE WHEN estatus = 'Cancelado' THEN 1 END) as cancelados
    FROM invitados
    WHERE activo = 1 AND evento_id = 1
  `;

  const result = await client.execute(statsQuery);
  const stats = result.rows[0];

  res.json({
    message: "success",
    data: {
      totalInvitados: stats.total_invitados ?? 0,
      totalAdultos: stats.total_adultos ?? 0,
      totalNinos: stats.total_ninos ?? 0,
      totalConfirmados: (stats.adultos_confirmados ?? 0) + (stats.ninos_confirmados ?? 0),
      totalAdultosConfirmados: stats.adultos_confirmados ?? 0,
      totalNinosConfirmados: stats.ninos_confirmados ?? 0,
      pendientes: stats.pendientes ?? 0,
      cancelados: stats.cancelados ?? 0,
      evento_id: 1
    }
  });
}));

// Modificar consultas para incluir nuevos campos
router.post('/', asyncHandler(async (req, res) => {
  const { 
    nombre, 
    apellido, 
    telefono_celular, 
    invitados_adultos, 
    invitados_ninos, 
    estatus, 
    fecha_modificacion,
    evento_id,
    mesa,
    asistencia,
    activo 
  } = req.body;
  
  const result = await client.execute({
    sql: `INSERT INTO invitados 
          (nombre, apellido, telefono_celular, invitados_adultos, 
          invitados_ninos, estatus, fecha_modificacion, evento_id, 
          mesa, asistencia, activo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      nombre, 
      apellido, 
      telefono_celular, 
      invitados_adultos, 
      invitados_ninos, 
      estatus, 
      fecha_modificacion,
      evento_id || null,
      mesa || null,
      asistencia ? 1 : 0,
      activo ? 1 : 0
    ]
  });
  
  const newInvitado = await client.execute({
    sql: "SELECT * FROM invitados WHERE id = ?",
    args: [result.lastInsertRowid]
  });

  res.json({
    message: "success crear",
    data: newInvitado.rows[0]
  });
}));

// Actualizar endpoint PUT
router.put('/:id', asyncHandler(async (req, res) => {
  const { 
    nombre, 
    apellido, 
    telefono_celular, 
    invitados_adultos, 
    invitados_ninos, 
    estatus, 
    fecha_modificacion,
    evento_id,
    mesa,
    asistencia,
    activo 
  } = req.body;
  
  const result = await client.execute({
    sql: `UPDATE invitados SET
          nombre = COALESCE(?, nombre),
          apellido = COALESCE(?, apellido),
          telefono_celular = COALESCE(?, telefono_celular),
          invitados_adultos = COALESCE(?, invitados_adultos),
          invitados_ninos = COALESCE(?, invitados_ninos),
          estatus = COALESCE(?, estatus),
          fecha_modificacion = COALESCE(?, fecha_modificacion),
          evento_id = COALESCE(?, evento_id),
          mesa = COALESCE(?, mesa),
          asistencia = COALESCE(?, asistencia),
          activo = COALESCE(?, activo)
          WHERE id = ?`,
    args: [
      nombre, 
      apellido, 
      telefono_celular, 
      invitados_adultos, 
      invitados_ninos, 
      estatus, 
      fecha_modificacion,
      evento_id,
      mesa,
      asistencia ? 1 : 0,
      activo ? 1 : 0,
      req.params.id
    ]
  });
  
  if (result.rowsAffected === 0) {
    return res.status(404).json({ message: "Invitado no encontrado" });
  }
  
  const updated = await client.execute({
    sql: "SELECT * FROM invitados WHERE id = ?",
    args: [req.params.id]
  });

  res.json({
    message: "success",
    data: updated.rows[0],
    changes: result.rowsAffected
  });
}));

// Modificar consulta GET para filtrar por activo
router.get('/', asyncHandler(async (req, res) => {
  const result = await client.execute(`
    SELECT 
      i.id,
      i.nombre,
      i.apellido,
      i.telefono_celular,
      i.invitados_adultos,
      i.invitados_ninos,
      i.estatus,
      i.fecha_modificacion,
      i.evento_id,
      i.mesa,
      i.asistencia,
      i.activo,
      e.mensaje_invitacion
    FROM invitados i
    LEFT JOIN eventos e ON i.evento_id = e.id
    WHERE i.activo = 1 AND i.evento_id = 1
  `);

  res.json({
    message: "success todos",
    data: result.rows
  });
}));


// Eliminar por ID
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await client.execute({
    sql: "DELETE FROM invitados WHERE id = ?",
    args: [req.params.id]
  });
  
  if (result.rowsAffected === 0) {
    return res.status(404).json({ message: "Invitado no encontrado" });
  }
  
  res.json({
    message: "deleted",
    changes: result.rowsAffected
  });
}));

export default router;