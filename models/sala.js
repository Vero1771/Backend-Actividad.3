const pool = require('../db/connection');

class SalaStore {
  static findAll() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_sala, nombre, capacidad, precio FROM salas')
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_sala, name: r.nombre, capacity: r.capacidad, price: Number(r.precio) })) ))
        .catch(err => reject(err));
    });
  }

  static create({ name, capacity, price }) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO salas (nombre, capacidad, precio) VALUES (?, ?, ?)', [name, capacity || null, price || 0])
        .then(([result]) => resolve({ id: result.insertId, name, capacity: capacity ? Number(capacity) : null, price: price !== undefined ? Number(price) : 0 }))
        .catch(err => reject(err));
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_sala, nombre, capacidad, precio FROM salas WHERE id_sala = ?', [id])
        .then(([rows]) => {
          if (rows.length === 0) return resolve(null);
          const r = rows[0];
          resolve({ id: r.id_sala, name: r.nombre, capacity: r.capacidad, price: Number(r.precio) });
        })
        .catch(err => reject(err));
    });
  }

  static update(id, { name, capacity, price }) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];
      if (name !== undefined) { fields.push('nombre = ?'); params.push(name); }
      if (capacity !== undefined) { fields.push('capacidad = ?'); params.push(capacity); }
      if (price !== undefined) { fields.push('precio = ?'); params.push(price); }
      if (fields.length === 0) return this.findById(id).then(resolve).catch(reject);
      params.push(id);
      pool.query(`UPDATE salas SET ${fields.join(', ')} WHERE id_sala = ?`, params)
        .then(() => this.findById(id).then(resolve).catch(reject))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM salas WHERE id_sala = ?', [id])
        .then(([result]) => resolve(result.affectedRows > 0))
        .catch(err => reject(err));
    });
  }
}

module.exports = SalaStore;
