const MovieStore = require('../models/movie');
const { badRequest, isNonEmptyString, isNonNegativeNumber, isInteger } = require('../utils/validators');

class MovieController {
  static index() {
    return MovieStore.findAll().then(movies => movies);
  }

  static newFormData() {
    return {};
  }

  static create(data) {
    const { title, duration, year } = data;
    if (!isNonEmptyString(title)) return Promise.reject(badRequest('title is required'));
    if (duration !== undefined && !isNonNegativeNumber(duration)) return Promise.reject(badRequest('duration must be a non-negative number'));
    if (year !== undefined && !isInteger(year)) return Promise.reject(badRequest('year must be an integer'));
    return MovieStore.create({ title, duration: duration !== undefined ? Number(duration) : null, year: year !== undefined ? Number(year) : null }).then(r => r);
  }

  static findById(id) {
    return MovieStore.findById(id).then(r => r);
  }

  static update(id, data) {
    if (data.title !== undefined && !isNonEmptyString(data.title)) return Promise.reject(badRequest('title must be non-empty string'));
    if (data.duration !== undefined && !isNonNegativeNumber(data.duration)) return Promise.reject(badRequest('duration must be a non-negative number'));
    if (data.year !== undefined && !isInteger(data.year)) return Promise.reject(badRequest('year must be an integer'));
    return MovieStore.update(id, {
      title: data.title,
      duration: data.duration !== undefined ? Number(data.duration) : undefined,
      year: data.year !== undefined ? Number(data.year) : undefined
    }).then(r => r);
  }

  static delete(id) {
    return MovieStore.delete(id).then(r => r);
  }

  static last5(sortBy = 'year') {
    return MovieStore.last5(sortBy).then(r => r);
  }

  static top5(year) {
    return MovieStore.top5ByYear(year).then(r => r);
  }
}

module.exports = MovieController;
