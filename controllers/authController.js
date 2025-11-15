const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

class AuthController {
  static async register(req, res) {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    try {
      const existing = await User.findByEmail(email);
      if (existing) return res.status(409).json({ error: 'User exists' });
      const hash = await bcrypt.hash(password, 10);
      const created = await User.create({ email, passwordHash: hash, role: role || 'user' });
      const token = jwt.sign({ id: created.id, email: created.email, role: created.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.status(201).json({ user: { id: created.id, email: created.email, role: created.role }, token });
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    try {
      const user = await User.findByEmail(email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id_usuario, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      res.json({ user: { id: user.id_usuario, email: user.email, role: user.role }, token });
    } catch (err) {
      res.status(500).json({ error: err.message || err });
    }
  }
}

module.exports = AuthController;
