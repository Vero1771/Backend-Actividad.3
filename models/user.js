const pool = require('../db/connection');

class UserStore {
  static createTableIfNeeded() {
    // not executed here; schema.sql should be used to create table
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_usuario, email, password, role FROM usuarios WHERE email = ?', [email])
        .then(([rows]) => resolve(rows.length ? rows[0] : null))
        .catch(reject);
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_usuario, email, password, role FROM usuarios WHERE id_usuario = ?', [id])
        .then(([rows]) => resolve(rows.length ? rows[0] : null))
        .catch(reject);
    });
  }

  static create({ email, passwordHash, role = 'user' }) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO usuarios (email, password, role) VALUES (?, ?, ?)', [email, passwordHash, role])
        .then(([result]) => resolve({ id: result.insertId, email, role }))
        .catch(reject);
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_usuario, email, role FROM usuarios')
        .then(([rows]) => resolve(rows))
        .catch(reject);
    });
  }

  static update(id, { email, passwordHash, role }) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      if (email !== undefined) { fields.push('email = ?'); values.push(email); }
      if (passwordHash !== undefined) { fields.push('password = ?'); values.push(passwordHash); }
      if (role !== undefined) { fields.push('role = ?'); values.push(role); }
      if (!fields.length) return resolve(null);
      values.push(id);
      const sql = `UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuario = ?`;
      pool.query(sql, values)
        .then(([result]) => resolve(result.affectedRows ? { id, email, role } : null))
        .catch(reject);
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id])
        .then(([result]) => resolve(!!result.affectedRows))
        .catch(reject);
    });
  }
}

module.exports = UserStore;
