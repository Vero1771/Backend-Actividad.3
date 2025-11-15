var express = require('express');
var router = express.Router();
const MetodoPagoController = require('../controllers/metodoPagoController');
const { authenticateToken, authorizeRoles } = require('../utils/auth');

router.get('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.index()
    .then(list => res.json(list))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.create(req.body)
    .then(created => res.status(201).json(created))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.get('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.findById(req.params.id)
    .then(item => {
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.put('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.delete('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.delete(req.params.id)
    .then(ok => res.json({ deleted: ok }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// --- View routes (EJS) ---
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.index()
    .then(metodos => res.render('metodos_pago/index', { metodos }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/new', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.render('metodos_pago/new');
});

router.post('/create', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.create(req.body)
    .then(() => res.redirect('/metodos_pago'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id/edit', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.findById(req.params.id)
    .then(metodo => {
      if (!metodo) return res.status(404).send('Not found');
      res.render('metodos_pago/edit', { metodo });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/update', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.update(req.params.id, req.body)
    .then(() => res.redirect('/metodos_pago'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/delete', authenticateToken, authorizeRoles('admin'), (req, res) => {
  MetodoPagoController.delete(req.params.id)
    .then(() => res.redirect('/metodos_pago'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

module.exports = router;