var express = require('express');
var router = express.Router();
const SalaController = require('../controllers/salaController');
const { authenticateToken, authorizeRoles } = require('../utils/auth');

// --- API (JSON) ---
router.get('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.index()
		.then(salas => res.json(salas))
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.create(req.body)
		.then(created => res.status(201).json(created))
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.get('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.findById(req.params.id)
		.then(sala => {
			if (!sala) return res.status(404).json({ error: 'Not found' });
			res.json(sala);
		})
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.put('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.update(req.params.id, req.body)
		.then(updated => {
			if (!updated) return res.status(404).json({ error: 'Not found' });
			res.json(updated);
		})
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.delete('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.delete(req.params.id)
		.then(ok => res.json({ deleted: ok }))
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// --- Views ---
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.index()
		.then(salas => res.render('salas/index', { salas }))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/new', authenticateToken, authorizeRoles('admin'), (req, res) => {
	res.render('salas/new');
});

router.post('/create', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.create(req.body)
		.then(() => res.redirect('/salas'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.findById(req.params.id)
		.then(sala => {
			if (!sala) return res.status(404).send('Not found');
			res.render('salas/show', { sala });
		})
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id/edit', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.editFormData(req.params.id)
		.then(sala => {
			if (!sala) return res.status(404).send('Not found');
			res.render('salas/edit', { sala });
		})
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/update', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.update(req.params.id, req.body)
		.then(() => res.redirect('/salas'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/delete', authenticateToken, authorizeRoles('admin'), (req, res) => {
	SalaController.delete(req.params.id)
		.then(() => res.redirect('/salas'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

module.exports = router;
