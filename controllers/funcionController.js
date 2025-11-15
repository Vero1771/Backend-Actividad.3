const FuncionStore = require('../models/funcion');
const MovieStore = require('../models/movie');
const SalaStore = require('../models/sala');
const { badRequest, isPositiveInteger, isValidDateString } = require('../utils/validators');

class FuncionController {
  // devuelve lista de funciones enriquecida; acepta filtro start/end opcional
  static index({ start, end } = {}) {
    const finder = (start || end) ? FuncionStore.findByDateRange(start, end) : FuncionStore.findAll();
    return finder.then(funciones => {
      return Promise.all(funciones.map(f => {
        const moviePromise = f.movieId ? MovieStore.findById(f.movieId) : Promise.resolve(null);
        const salaPromise = f.salaId ? SalaStore.findById(f.salaId) : Promise.resolve(null);
        return Promise.all([moviePromise, salaPromise]).then(([movie, sala]) => ({ ...f, movie, sala }));
      }));
    });
  }

  static newFormData() {
    return Promise.all([MovieStore.findAll(), SalaStore.findAll()]).then(([movies, salas]) => ({ movies, salas }));
  }

  static create(data) {
    const { movieId, salaId, datetime } = data;
    if (movieId !== undefined && movieId !== null && !isPositiveInteger(movieId)) return Promise.reject(badRequest('movieId must be a positive integer'));
    if (salaId !== undefined && salaId !== null && !isPositiveInteger(salaId)) return Promise.reject(badRequest('salaId must be a positive integer'));
    if (!datetime || !isValidDateString(datetime)) return Promise.reject(badRequest('datetime is required and must be a valid date'));
    return FuncionStore.create({ movieId, salaId, datetime }).then(r => r);
  }

  static findById(id) {
    return FuncionStore.findById(id).then(r => r);
  }

  static editFormData(id) {
    return FuncionStore.findById(id).then(func => {
      if (!func) return null;
      return Promise.all([MovieStore.findAll(), SalaStore.findAll()]).then(([movies, salas]) => ({ func, movies, salas }));
    });
  }

  static update(id, data) {
    const { movieId, salaId, datetime } = data;
    if (movieId !== undefined && movieId !== null && !isPositiveInteger(movieId)) return Promise.reject(badRequest('movieId must be a positive integer'));
    if (salaId !== undefined && salaId !== null && !isPositiveInteger(salaId)) return Promise.reject(badRequest('salaId must be a positive integer'));
    if (datetime !== undefined && datetime !== null && !isValidDateString(datetime)) return Promise.reject(badRequest('datetime must be a valid date'));
    return FuncionStore.update(id, { movieId, salaId, datetime }).then(r => r);
  }

  static delete(id) {
    return FuncionStore.delete(id).then(r => r);
  }

  // unlink movie or sala from a funcion (set to null)
  static unlink(id, which) {
    return FuncionStore.findById(id).then(func => {
      if (!func) return null;
      if (which === 'movie') return FuncionStore.update(id, { movieId: null }).then(() => FuncionStore.findById(id));
      if (which === 'sala') return FuncionStore.update(id, { salaId: null }).then(() => FuncionStore.findById(id));
      return FuncionStore.findById(id);
    });
  }
}

module.exports = FuncionController;
