const SalaStore = require('../models/sala');
const { badRequest, isNonEmptyString, isPositiveInteger, isNonNegativeNumber } = require('../utils/validators');

class SalaController {
  static index() {
    return SalaStore.findAll().then(r => r);
  }

  static newFormData() {
    return {};
  }

  static create(data) {
    const { name, capacity } = data;
    if (!isNonEmptyString(name)) return Promise.reject(badRequest('name is required'));
    if (capacity !== undefined && capacity !== null && !isPositiveInteger(capacity)) return Promise.reject(badRequest('capacity must be a positive integer'));
    const price = data.price !== undefined ? Number(data.price) : undefined;
    if (price !== undefined && !isNonNegativeNumber(price)) return Promise.reject(badRequest('price must be a non-negative number'));
    return SalaStore.create({ name, capacity: capacity !== undefined ? Number(capacity) : null, price }).then(r => r);
  }

  static findById(id) {
    return SalaStore.findById(id).then(r => r);
  }

  static editFormData(id) {
    return SalaStore.findById(id).then(r => r);
  }

  static update(id, data) {
    if (data.name !== undefined && !isNonEmptyString(data.name)) return Promise.reject(badRequest('name must be non-empty'));
    if (data.capacity !== undefined && data.capacity !== null && !isPositiveInteger(data.capacity)) return Promise.reject(badRequest('capacity must be a positive integer'));
    const price = data.price !== undefined ? Number(data.price) : undefined;
    if (price !== undefined && !isNonNegativeNumber(price)) return Promise.reject(badRequest('price must be a non-negative number'));
    return SalaStore.update(id, { name: data.name, capacity: data.capacity !== undefined ? Number(data.capacity) : undefined, price }).then(r => r);
  }

  static delete(id) {
    return SalaStore.delete(id).then(r => r);
  }
}

module.exports = SalaController;
