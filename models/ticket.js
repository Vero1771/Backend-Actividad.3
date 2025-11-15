const pool = require('../db/connection');

class Ticket {
  static findAll() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_ticket, id_venta, id_funcion, asiento, precio FROM tickets')
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_ticket, id_venta: r.id_venta, id_funcion: r.id_funcion, asiento: r.asiento, precio: r.precio }))))
        .catch(err => reject(err));
    });
  }

  static create({ id_venta, id_funcion, asiento, precio }) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO tickets (id_venta, id_funcion, asiento, precio) VALUES (?, ?, ?, ?)', [id_venta || null, id_funcion || null, asiento || null, precio || null])
        .then(([result]) => resolve({ id: result.insertId, id_venta: id_venta ? Number(id_venta) : null, id_funcion: id_funcion ? Number(id_funcion) : null, asiento, precio: precio ? Number(precio) : null }))
        .catch(err => reject(err));
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_ticket, id_venta, id_funcion, asiento, precio FROM tickets WHERE id_ticket = ?', [id])
        .then(([rows]) => {
          if (rows.length === 0) return resolve(null);
          const r = rows[0];
          resolve({ id: r.id_ticket, id_venta: r.id_venta, id_funcion: r.id_funcion, asiento: r.asiento, precio: r.precio });
        })
        .catch(err => reject(err));
    });
  }

  static update(id, { id_venta, id_funcion, asiento, precio }) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];
      if (id_venta !== undefined) { fields.push('id_venta = ?'); params.push(id_venta || null); }
      if (id_funcion !== undefined) { fields.push('id_funcion = ?'); params.push(id_funcion || null); }
      if (asiento !== undefined) { fields.push('asiento = ?'); params.push(asiento); }
      if (precio !== undefined) { fields.push('precio = ?'); params.push(precio); }
      if (fields.length === 0) return this.findById(id).then(resolve).catch(reject);
      params.push(id);
      pool.query(`UPDATE tickets SET ${fields.join(', ')} WHERE id_ticket = ?`, params)
        .then(() => this.findById(id).then(resolve).catch(reject))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM tickets WHERE id_ticket = ?', [id])
        .then(([result]) => resolve(result.affectedRows > 0))
        .catch(err => reject(err));
    });
  }

  static findByVentaId(id_venta) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_ticket, id_venta, id_funcion, asiento, precio FROM tickets WHERE id_venta = ?', [id_venta])
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_ticket, id_venta: r.id_venta, id_funcion: r.id_funcion, asiento: r.asiento, precio: r.precio }))))
        .catch(err => reject(err));
    });
  }
}

module.exports = Ticket;
