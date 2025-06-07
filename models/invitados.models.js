// models/invitado.model.js

/**
 * Clase que representa un Invitado.
 */
export default class Invitado {
    /**
     * Crea una instancia de Invitado.
     * @param {Object} data - Objeto con los datos del invitado.
     * @param {number} [data.id] - Identificador único (opcional, generado por la BD).
     * @param {string} data.nombre - Nombre del invitado.
     * @param {string} data.apellido - Apellido del invitado.
     * @param {string} data.telefono_celular - Teléfono celular (máximo 10 caracteres).
     * @param {number} data.invitados_adultos - Número de invitados adultos (entre 0 y 10).
     * @param {number} data.invitados_ninos - Número de invitados niños (entre 0 y 10).
     * @param {string} data.estatus - Estado del invitado ('Confirmado', 'Pendiente' o 'Cancelado').
     * @param {string} data.fecha_modificacion - Fecha y hora de la última modificación (formato ISO8601).
     * @param {number} data.evento_id - Identificador del evento al que pertenece el invitado.
     * @param {string} [data.mesa] - Mesa asignada al invitado.
     * @param {boolean} [data.asistencia=false] - Indica si asistió al evento.
     * @param {boolean} [data.activo=true] - Indica si el registro está activo (soft delete).
     */
    constructor({
      id = null,
      nombre,
      apellido,
      telefono_celular,
      invitados_adultos,
      invitados_ninos,
      estatus,
      fecha_modificacion,
      evento_id,
      mesa = null,
      asistencia = false,
      activo = true,
    }) {
      this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.telefono_celular = telefono_celular;
      this.invitados_adultos = invitados_adultos;
      this.invitados_ninos = invitados_ninos;
      this.estatus = estatus;
      this.fecha_modificacion = fecha_modificacion;
      this.evento_id = evento_id;
      this.mesa = mesa;
      this.asistencia = asistencia;
      this.activo = activo;
    }
  }
  