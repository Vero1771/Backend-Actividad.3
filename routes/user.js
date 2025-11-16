const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../utils/auth');
const FuncionController = require('../controllers/funcionController');
const MetodoPagoController = require('../controllers/metodoPagoController');
const VentaController = require('../controllers/ventaController');
const TicketController = require('../controllers/ticketController');
const SalaStore = require('../models/sala');

// User dashboard: list funciones (view-only)
router.get('/', authenticateToken, authorizeRoles('user'), (req, res) => {
  const { start, end } = req.query;
  FuncionController.index({ start, end })
    .then(funciones => res.render('user/dashboard', { funciones, start, end }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

// Buy form: choose seats for a funcion
router.get('/buy', authenticateToken, authorizeRoles('user'), (req, res) => {
  const id = req.query.funcionId;
  if (!id) return res.status(400).send('funcionId required');
  FuncionController.findById(id)
    .then(async func => {
      if (!func) return res.status(404).send('Not found');
      const sala = func.salaId ? await SalaStore.findById(func.salaId) : null;
      const movie = func.movieId ? await require('../models/movie').findById(func.movieId) : null;
      // attach movie and sala into func for view convenience
      func.movie = movie;
      func.sala = sala;
      res.render('user/buy', { func, sala });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

// Checkout: compute total and show payment options
router.post('/checkout', authenticateToken, authorizeRoles('user'), (req, res) => {
  const { funcionId, seats } = req.body; // seats: newline or comma separated
  if (!funcionId || !seats) return res.status(400).send('funcionId and seats required');
  const seatList = String(seats).split(/\r?\n|,/).map(s => s.trim()).filter(s => s.length);
  FuncionController.findById(funcionId)
    .then(async func => {
      if (!func) return res.status(404).send('Funcion not found');
      const sala = func.salaId ? await SalaStore.findById(func.salaId) : null;
      const movie = func.movieId ? await require('../models/movie').findById(func.movieId) : null;
      func.movie = movie;
      func.sala = sala;
      const price = sala ? Number(sala.price) : 0;
      const total = seatList.length * price;
      const metodos = await MetodoPagoController.index();
      res.render('user/checkout', { funcion: func, seats: seatList, price, total, metodos });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

// Complete purchase: create venta and tickets (immutable for user)
router.post('/complete', authenticateToken, authorizeRoles('user'), async (req, res) => {
  try {
    const { funcionId, seats, id_metodo } = req.body;
    const seatList = String(seats).split(/\r?\n|,/).map(s => s.trim()).filter(s => s.length);
    const func = await FuncionController.findById(funcionId);
    if (!func) return res.status(404).send('Funcion not found');
      const sala = func.salaId ? await SalaStore.findById(func.salaId) : null;
      const movie = func.movieId ? await require('../models/movie').findById(func.movieId) : null;
      func.movie = movie;
      func.sala = sala;
      const price = sala ? Number(sala.price) : 0;
    const total = seatList.length * price;
    // create venta
    const venta = await VentaController.create({ id_metodo: id_metodo ? Number(id_metodo) : null, fecha: new Date().toISOString(), total });
    // create tickets linked to venta
    for (const asiento of seatList) {
      await TicketController.create({ id_venta: venta.id, id_funcion: funcionId ? Number(funcionId) : null, asiento, precio: price });
    }
    res.render('user/complete', { venta, seats: seatList, total });
  } catch (err) {
    res.status(err.status || 500).send(err.message || err);
  }
});

module.exports = router;
