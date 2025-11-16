const bcrypt = require('bcrypt');
const User = require('../models/user');

class UserController {
  static async index() {
    return User.findAll();
  }

  static async findById(id) {
    return User.findById(id);
  }

  static async create({ email, password, role = 'user' }) {
    if (!email || !password) throw new Error('email and password required');
    const hash = await bcrypt.hash(password, 10);
    return User.create({ email, passwordHash: hash, role });
  }

  static async update(id, { email, password, role }) {
    const payload = {};
    if (email !== undefined) payload.email = email;
    if (password) payload.passwordHash = await bcrypt.hash(password, 10);
    if (role !== undefined) payload.role = role;
    return User.update(id, payload);
  }

  static async delete(id) {
    return User.delete(id);
  }
}

module.exports = UserController;
