const pool = require('../db/connection');

class MetodoPago {
  static findAll() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_metodo, nombre FROM metodos_pago')
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_metodo, nombre: r.nombre }))))
        .catch(err => reject(err));
    });
  }

  static create({ nombre }) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO metodos_pago (nombre) VALUES (?)', [nombre])
        .then(([result]) => resolve({ id: result.insertId, nombre }))
        .catch(err => reject(err));
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_metodo, nombre FROM metodos_pago WHERE id_metodo = ?', [id])
        .then(([rows]) => {
          if (rows.length === 0) return resolve(null);
          const r = rows[0];
          resolve({ id: r.id_metodo, nombre: r.nombre });
        })
        .catch(err => reject(err));
    });
  }

  static update(id, { nombre }) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];
      if (nombre !== undefined) { fields.push('nombre = ?'); params.push(nombre); }
      if (fields.length === 0) return this.findById(id).then(resolve).catch(reject);
      params.push(id);
      pool.query(`UPDATE metodos_pago SET ${fields.join(', ')} WHERE id_metodo = ?`, params)
        .then(() => this.findById(id).then(resolve).catch(reject))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM metodos_pago WHERE id_metodo = ?', [id])
        .then(([result]) => resolve(result.affectedRows > 0))
        .catch(err => reject(err));
    });
  }
}

module.exports = MetodoPago;
