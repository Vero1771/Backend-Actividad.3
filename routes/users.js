var express = require('express');
var router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../utils/auth');

// --- API routes ---
router.get('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.index()
    .then(list => res.json(list))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.create(req.body)
    .then(created => res.status(201).json(created))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.get('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.findById(req.params.id)
    .then(item => {
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.put('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) return res.status(404).json({ error: 'Not found or nothing to update' });
      res.json(updated);
    })
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.delete('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const targetId = Number(req.params.id);
  const currentId = Number(req.user && req.user.id);
  if (currentId && targetId === currentId) return res.status(400).json({ error: 'No puede borrarse a sí mismo' });
  UserController.delete(req.params.id)
    .then(ok => res.json({ deleted: ok }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// --- View routes (EJS) ---
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.index()
    .then(users => res.render('users/index', { users }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/new', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.render('users/new');
});

router.post('/create', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.create(req.body)
    .then(() => res.redirect('/users'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id/edit', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.findById(req.params.id)
    .then(user => {
      if (!user) return res.status(404).send('Not found');
      res.render('users/edit', { user });
    })
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/update', authenticateToken, authorizeRoles('admin'), (req, res) => {
  UserController.update(req.params.id, req.body)
    .then(() => res.redirect('/users'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/delete', authenticateToken, authorizeRoles('admin'), (req, res) => {
  const targetId = Number(req.params.id);
  const currentId = Number(req.user && req.user.id);
  if (currentId && targetId === currentId) return res.status(400).send('No puede borrarse a sí mismo');
  UserController.delete(req.params.id)
    .then(() => res.redirect('/users'))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

module.exports = router;
