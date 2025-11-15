const pool = require('../db/connection');

class Venta {
  static findAll() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_venta, id_metodo, fecha, total FROM ventas')
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_venta, id_metodo: r.id_metodo, fecha: r.fecha ? new Date(r.fecha).toISOString() : null, total: r.total }))))
        .catch(err => reject(err));
    });
  }

  static create({ id_metodo, fecha, total }) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO ventas (id_metodo, fecha, total) VALUES (?, ?, ?)', [id_metodo || null, fecha || null, total || null])
        .then(([result]) => resolve({ id: result.insertId, id_metodo: id_metodo ? Number(id_metodo) : null, fecha: fecha || null, total: total ? Number(total) : null }))
        .catch(err => reject(err));
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_venta, id_metodo, fecha, total FROM ventas WHERE id_venta = ?', [id])
        .then(([rows]) => {
          if (rows.length === 0) return resolve(null);
          const r = rows[0];
          resolve({ id: r.id_venta, id_metodo: r.id_metodo, fecha: r.fecha ? new Date(r.fecha).toISOString() : null, total: r.total });
        })
        .catch(err => reject(err));
    });
  }

  static update(id, { id_metodo, fecha, total }) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];
      if (id_metodo !== undefined) { fields.push('id_metodo = ?'); params.push(id_metodo || null); }
      if (fecha !== undefined) { fields.push('fecha = ?'); params.push(fecha || null); }
      if (total !== undefined) { fields.push('total = ?'); params.push(total); }
      if (fields.length === 0) return this.findById(id).then(resolve).catch(reject);
      params.push(id);
      pool.query(`UPDATE ventas SET ${fields.join(', ')} WHERE id_venta = ?`, params)
        .then(() => this.findById(id).then(resolve).catch(reject))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM ventas WHERE id_venta = ?', [id])
        .then(([result]) => resolve(result.affectedRows > 0))
        .catch(err => reject(err));
    });
  }

  static findByDateRange(start, end) {
    return new Promise((resolve, reject) => {
      if (!start && !end) return this.findAll().then(resolve).catch(reject);
      const where = [];
      const params = [];
      if (start) { where.push('fecha >= ?'); params.push(start); }
      if (end) { where.push('fecha <= ?'); params.push(end); }
      const sql = `SELECT v.id_venta, v.id_metodo, v.fecha, v.total, m.nombre AS metodo_nombre FROM ventas v LEFT JOIN metodos_pago m ON v.id_metodo = m.id_metodo WHERE ${where.join(' AND ')}`;
      pool.query(sql, params)
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_venta, id_metodo: r.id_metodo, fecha: r.fecha ? new Date(r.fecha).toISOString() : null, total: r.total, metodo_nombre: r.metodo_nombre }))))
        .catch(err => reject(err));
    });
  }

  static findByIdWithMetodo(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT v.id_venta, v.id_metodo, v.fecha, v.total, m.nombre AS metodo_nombre FROM ventas v LEFT JOIN metodos_pago m ON v.id_metodo = m.id_metodo WHERE v.id_venta = ?`;
      pool.query(sql, [id])
        .then(([rows]) => {
          if (rows.length === 0) return resolve(null);
          const r = rows[0];
          resolve({ id: r.id_venta, id_metodo: r.id_metodo, fecha: r.fecha ? new Date(r.fecha).toISOString() : null, total: r.total, metodo_nombre: r.metodo_nombre });
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = Venta;
