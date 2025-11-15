const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.cookies.token;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(401).json({ error: 'Debe autenticarse' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role) return res.status(401).json({ error: 'No hay ningún rol presente' });
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ warning: 'Acceso denegado: rol no autorizado' });
  };
}

module.exports = { authenticateToken, authorizeRoles };
