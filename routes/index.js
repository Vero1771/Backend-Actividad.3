var express = require('express');
var router = express.Router();
const { authenticateToken, authorizeRoles } = require('../utils/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  // dashboard admin: protected
  authenticateToken(req, res, function() {
    authorizeRoles('admin')(req, res, function() {
      res.render('index', { title: 'Dashboard - Sistema de Gestión de Cine' });
    });
  });
});

module.exports = router;
