const MetodoPago = require('../models/metodoPago');
const { badRequest, isNonEmptyString } = require('../utils/validators');

class MetodoPagoController {
  static index() {
    return MetodoPago.findAll().then(r => r);
  }

  static create(data) {
    if (!isNonEmptyString(data.nombre)) return Promise.reject(badRequest('nombre is required'));
    return MetodoPago.create({ nombre: data.nombre }).then(r => r);
  }

  static findById(id) {
    return MetodoPago.findById(id).then(r => r);
  }

  static update(id, data) {
    if (data.nombre !== undefined && !isNonEmptyString(data.nombre)) return Promise.reject(badRequest('nombre must be non-empty'));
    return MetodoPago.update(id, { nombre: data.nombre }).then(r => r);
  }

  static delete(id) {
    return MetodoPago.delete(id).then(r => r);
  }
}

module.exports = MetodoPagoController;
