const Ticket = require('../models/ticket');
const { badRequest, isPositiveInteger, isNonEmptyString, isNonNegativeNumber } = require('../utils/validators');

class TicketController {
  static index() {
    return Ticket.findAll().then(r => r);
  }

  static create(data) {
    if (data.id_venta !== undefined && data.id_venta !== null && !isPositiveInteger(data.id_venta)) return Promise.reject(badRequest('id_venta must be a positive integer'));
    if (data.id_funcion !== undefined && data.id_funcion !== null && !isPositiveInteger(data.id_funcion)) return Promise.reject(badRequest('id_funcion must be a positive integer'));
    if (data.asiento !== undefined && data.asiento !== null && !isNonEmptyString(data.asiento)) return Promise.reject(badRequest('asiento must be non-empty'));
    if (data.precio !== undefined && data.precio !== null && !isNonNegativeNumber(data.precio)) return Promise.reject(badRequest('precio must be a non-negative number'));
    return Ticket.create({ id_venta: data.id_venta, id_funcion: data.id_funcion, asiento: data.asiento, precio: data.precio }).then(r => r);
  }

  static findById(id) {
    return Ticket.findById(id).then(r => r);
  }

  static update(id, data) {
    if (data.id_venta !== undefined && data.id_venta !== null && !isPositiveInteger(data.id_venta)) return Promise.reject(badRequest('id_venta must be a positive integer'));
    if (data.id_funcion !== undefined && data.id_funcion !== null && !isPositiveInteger(data.id_funcion)) return Promise.reject(badRequest('id_funcion must be a positive integer'));
    if (data.asiento !== undefined && data.asiento !== null && !isNonEmptyString(data.asiento)) return Promise.reject(badRequest('asiento must be non-empty'));
    if (data.precio !== undefined && data.precio !== null && !isNonNegativeNumber(data.precio)) return Promise.reject(badRequest('precio must be a non-negative number'));
    return Ticket.update(id, { id_venta: data.id_venta, id_funcion: data.id_funcion, asiento: data.asiento, precio: data.precio }).then(r => r);
  }

  static delete(id) {
    return Ticket.delete(id).then(r => r);
  }

  static findByVenta(id_venta) {
    return Ticket.findByVentaId(id_venta).then(r => r);
  }
}

module.exports = TicketController;
