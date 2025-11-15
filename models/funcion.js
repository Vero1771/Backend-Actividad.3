const pool = require('../db/connection');

class FuncionStore {
  static create({ movieId, salaId, datetime }) {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO funciones (id_pelicula, id_sala, fecha_hora) VALUES (?, ?, ?)', [movieId || null, salaId || null, datetime || null])
        .then(([result]) => resolve({ id: result.insertId, movieId: movieId ? Number(movieId) : null, salaId: salaId ? Number(salaId) : null, datetime: datetime || null }))
        .catch(err => reject(err));
    });
  }

  static findAll() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_funcion, id_pelicula, id_sala, fecha_hora FROM funciones')
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_funcion, movieId: r.id_pelicula, salaId: r.id_sala, datetime: r.fecha_hora ? new Date(r.fecha_hora).toISOString() : null }))))
        .catch(err => reject(err));
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT id_funcion, id_pelicula, id_sala, fecha_hora FROM funciones WHERE id_funcion = ?', [id])
        .then(([rows]) => {
          if (rows.length === 0) return resolve(null);
          const r = rows[0];
          resolve({ id: r.id_funcion, movieId: r.id_pelicula, salaId: r.id_sala, datetime: r.fecha_hora ? new Date(r.fecha_hora).toISOString() : null });
        })
        .catch(err => reject(err));
    });
  }

  static update(id, { movieId, salaId, datetime }) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const params = [];
      if (movieId !== undefined) { fields.push('id_pelicula = ?'); params.push(movieId || null); }
      if (salaId !== undefined) { fields.push('id_sala = ?'); params.push(salaId || null); }
      if (datetime !== undefined) { fields.push('fecha_hora = ?'); params.push(datetime || null); }
      if (fields.length === 0) return this.findById(id).then(resolve).catch(reject);
      params.push(id);
      pool.query(`UPDATE funciones SET ${fields.join(', ')} WHERE id_funcion = ?`, params)
        .then(() => this.findById(id).then(resolve).catch(reject))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM funciones WHERE id_funcion = ?', [id])
        .then(([result]) => resolve(result.affectedRows > 0))
        .catch(err => reject(err));
    });
  }

  static findByDateRange(start, end) {
    return new Promise((resolve, reject) => {
      if (!start && !end) return this.findAll().then(resolve).catch(reject);
      const where = [];
      const params = [];
      if (start) { where.push('fecha_hora >= ?'); params.push(start); }
      if (end) { where.push('fecha_hora <= ?'); params.push(end); }
      const sql = `SELECT id_funcion, id_pelicula, id_sala, fecha_hora FROM funciones WHERE ${where.join(' AND ')}`;
      pool.query(sql, params)
        .then(([rows]) => resolve(rows.map(r => ({ id: r.id_funcion, movieId: r.id_pelicula, salaId: r.id_sala, datetime: r.fecha_hora ? new Date(r.fecha_hora).toISOString() : null }))))
        .catch(err => reject(err));
    });
  }
}

module.exports = FuncionStore;
