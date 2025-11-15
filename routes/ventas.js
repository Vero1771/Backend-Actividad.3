var express = require('express');
var router = express.Router();
const VentaController = require('../controllers/ventaController');
const MetodoPagoController = require('../controllers/metodoPagoController');

// CRUD API
router.get('/api', (req, res) => {
  VentaController.index()
    .then(list => res.json(list))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api', (req, res) => {
  VentaController.create(req.body)
    .then(created => res.status(201).json(created))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// ventas in date range with metodo_nombre
router.get('/api/range', (req, res) => {
  const { start, end } = req.query;
  VentaController.findByDateRange(start, end)
    .then(list => res.json({ start, end, ventas: list }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.get('/api/:id', (req, res) => {
  VentaController.findByIdWithMetodo(req.params.id)
    .then(item => {
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.put('/api/:id', (req, res) => {
  VentaController.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.delete('/api/:id', (req, res) => {
  VentaController.delete(req.params.id)
    .then(ok => res.json({ deleted: ok }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// tickets for a venta
router.get('/api/:id/tickets', (req, res) => {
  VentaController.ticketsByVenta(req.params.id)
    .then(tickets => res.json(tickets))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

module.exports = router;

// --- View routes (EJS) ---
router.get('/', (req, res) => {
  VentaController.index()
    .then(ventas => res.render('ventas/index', { ventas }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/new', (req, res) => {
  MetodoPagoController.index()
    .then(metodos => res.render('ventas/new', { metodos }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/create', (req, res) => {
  VentaController.create(req.body)
    .then(() => res.redirect('/ventas'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id', (req, res) => {
  Promise.all([VentaController.findByIdWithMetodo(req.params.id), VentaController.ticketsByVenta(req.params.id)])
    .then(([venta, tickets]) => {
      if (!venta) return res.status(404).send('Not found');
      res.render('ventas/show', { venta, tickets });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id/edit', (req, res) => {
  Promise.all([VentaController.findById(req.params.id), MetodoPagoController.index()])
    .then(([venta, metodos]) => {
      if (!venta) return res.status(404).send('Not found');
      res.render('ventas/edit', { venta, metodos });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/update', (req, res) => {
  VentaController.update(req.params.id, req.body)
    .then(() => res.redirect('/ventas'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/delete', (req, res) => {
  VentaController.delete(req.params.id)
    .then(() => res.redirect('/ventas'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});
