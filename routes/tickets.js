var express = require('express');
var router = express.Router();
const TicketController = require('../controllers/ticketController');
const VentaController = require('../controllers/ventaController');
const FuncionController = require('../controllers/funcionController');

router.get('/api', (req, res) => {
  TicketController.index()
    .then(list => res.json(list))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api', (req, res) => {
  TicketController.create(req.body)
    .then(created => res.status(201).json(created))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.get('/api/:id', (req, res) => {
  TicketController.findById(req.params.id)
    .then(item => {
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.put('/api/:id', (req, res) => {
  TicketController.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.delete('/api/:id', (req, res) => {
  TicketController.delete(req.params.id)
    .then(ok => res.json({ deleted: ok }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// tickets by venta
router.get('/api/byVenta/:id', (req, res) => {
  TicketController.findByVenta(req.params.id)
    .then(list => res.json(list))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

module.exports = router;

// --- View routes (EJS) ---
router.get('/', (req, res) => {
  TicketController.index()
    .then(tickets => res.render('tickets/index', { tickets }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/new', (req, res) => {
  const prefillVenta = req.query.id_venta;
  Promise.all([VentaController.index(), FuncionController.index()])
    .then(([ventas, funciones]) => res.render('tickets/new', { ventas, funciones, prefillVenta }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/create', (req, res) => {
  TicketController.create(req.body)
    .then(() => res.redirect('/tickets'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id/edit', (req, res) => {
  Promise.all([TicketController.findById(req.params.id), VentaController.index(), FuncionController.index()])
    .then(([ticket, ventas, funciones]) => {
      if (!ticket) return res.status(404).send('Not found');
      res.render('tickets/edit', { ticket, ventas, funciones });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/update', (req, res) => {
  TicketController.update(req.params.id, req.body)
    .then(() => res.redirect('/tickets'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/delete', (req, res) => {
  TicketController.delete(req.params.id)
    .then(() => res.redirect('/tickets'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id', (req, res) => {
  TicketController.findById(req.params.id)
    .then(ticket => {
      if (!ticket) return res.status(404).send('Not found');
      res.render('tickets/show', { ticket });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});
