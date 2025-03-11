const db = require('./db');

const sql = `INSERT INTO invitados (nombre, apellido, telefono_celular, invitados_adultos, invitados_ninos, estatus, fecha_modificacion)
             VALUES (?, ?, ?, ?, ?, ?, ?)`;
const params = [
  "Hans",
  "Carbajal",
  "1234567890",
  2,
  1,
  "Pendiente",
  "2025-02-28T12:00:00Z"
];

db.run(sql, params, function(err) {
  if (err) {
    return console.error("Error al insertar:", err.message);
  }
  console.log("Insertado con éxito, ID:", this.lastID);
});
