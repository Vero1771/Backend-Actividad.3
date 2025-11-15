var express = require('express');
var router = express.Router();
const FuncionController = require('../controllers/funcionController');
const { authenticateToken, authorizeRoles } = require('../utils/auth');

// --- API (JSON) ---

router.get('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
	const { start, end } = req.query;
	FuncionController.index({ start, end })
		.then(funciones => res.json({ start, end, funciones }))
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.create(req.body)
		.then(created => res.status(201).json(created))
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});


router.get('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.findById(req.params.id)
		.then(func => {
			if (!func) return res.status(404).json({ error: 'Not found' });
			const movieP = func.movieId ? require('../models/movie').findById(func.movieId) : Promise.resolve(null);
			const salaP = func.salaId ? require('../models/sala').findById(func.salaId) : Promise.resolve(null);
				Promise.all([movieP, salaP])
					.then(([movie, sala]) => res.json({ ...func, movie, sala }))
					.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
		})
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.put('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.update(req.params.id, req.body)
		.then(updated => {
			if (!updated) return res.status(404).json({ error: 'Not found' });
			res.json(updated);
		})
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.delete('/api/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.delete(req.params.id)
		.then(ok => res.json({ deleted: ok }))
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

router.post('/api/:id/unlink', authenticateToken, authorizeRoles('admin'), (req, res) => {
	const which = req.query.which;
	FuncionController.unlink(req.params.id, which)
		.then(func => {
			if (!func) return res.status(404).json({ error: 'Not found' });
			res.json(func);
		})
		.catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

// --- Views ---
router.get('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
	const { start, end } = req.query;
	FuncionController.index({ start, end })
		.then(funciones => res.render('funciones/index', { funciones, start, end }))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/new', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.newFormData()
		.then(data => res.render('funciones/new', data))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/create', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.create(req.body)
		.then(() => res.redirect('/funciones'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.get('/:id/edit', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.editFormData(req.params.id)
		.then(data => {
			if (!data) return res.status(404).send('Not found');
			res.render('funciones/edit', { func: data.func, movies: data.movies, salas: data.salas });
		})
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/update', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.update(req.params.id, req.body)
		.then(() => res.redirect('/funciones'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/delete', authenticateToken, authorizeRoles('admin'), (req, res) => {
	FuncionController.delete(req.params.id)
		.then(() => res.redirect('/funciones'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

router.post('/:id/unlink', authenticateToken, authorizeRoles('admin'), (req, res) => {
	const which = req.query.which;
	FuncionController.unlink(req.params.id, which)
		.then(() => res.redirect('/funciones'))
		.catch(err => res.status(err.status || 500).send(err.message || err));
});

module.exports = router;
