const Venta = require('../models/venta');
const Ticket = require('../models/ticket');
const { badRequest, isValidDateString, isNonNegativeNumber, isPositiveInteger } = require('../utils/validators');

class VentaController {
  static index() {
    return Venta.findAll().then(r => r);
  }

  static create(data) {
    if (data.id_metodo !== undefined && data.id_metodo !== null && !isPositiveInteger(data.id_metodo)) return Promise.reject(badRequest('id_metodo must be a positive integer'));
    if (data.fecha !== undefined && data.fecha !== null && !isValidDateString(data.fecha)) return Promise.reject(badRequest('fecha must be a valid date'));
    if (data.total !== undefined && data.total !== null && !isNonNegativeNumber(data.total)) return Promise.reject(badRequest('total must be a non-negative number'));
    return Venta.create({ id_metodo: data.id_metodo, fecha: data.fecha, total: data.total }).then(r => r);
  }

  static findById(id) {
    return Venta.findById(id).then(r => r);
  }

  static update(id, data) {
    if (data.id_metodo !== undefined && data.id_metodo !== null && !isPositiveInteger(data.id_metodo)) return Promise.reject(badRequest('id_metodo must be a positive integer'));
    if (data.fecha !== undefined && data.fecha !== null && !isValidDateString(data.fecha)) return Promise.reject(badRequest('fecha must be a valid date'));
    if (data.total !== undefined && data.total !== null && !isNonNegativeNumber(data.total)) return Promise.reject(badRequest('total must be a non-negative number'));
    return Venta.update(id, { id_metodo: data.id_metodo, fecha: data.fecha, total: data.total }).then(r => r);
  }

  static delete(id) {
    return Venta.delete(id).then(r => r);
  }

  static findByDateRange(start, end) {
    if (start !== undefined && start !== null && start !== '' && !isValidDateString(start)) return Promise.reject(badRequest('start must be a valid date'));
    if (end !== undefined && end !== null && end !== '' && !isValidDateString(end)) return Promise.reject(badRequest('end must be a valid date'));
    return Venta.findByDateRange(start, end).then(r => r);
  }

  static findByIdWithMetodo(id) {
    return Venta.findByIdWithMetodo(id).then(r => r);
  }

  static ticketsByVenta(id) {
    return Ticket.findByVentaId(id).then(r => r);
  }
}

module.exports = VentaController;
