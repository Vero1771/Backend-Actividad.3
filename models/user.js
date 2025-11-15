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
}

module.exports = UserStore;
