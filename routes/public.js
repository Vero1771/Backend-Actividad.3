const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');

// Public homepage
router.get('/', (req, res) => {
  res.render('public/index', { title: 'Bienvenido al Cine' });
});

// Public last5 view
router.get('/movies/last5', (req, res) => {
  const sortBy = req.query.sort || 'year';
  MovieController.last5(sortBy)
    .then(movies => res.render('movies/last5', { movies, sortBy }))
    .catch(err => res.status(err.status || 500).send(err.message || err));
});

// Public API for last5
router.get('/api/movies/last5', (req, res) => {
  const sortBy = req.query.sort || 'year';
  MovieController.last5(sortBy)
    .then(movies => res.json({ sortBy, movies }))
    .catch(err => res.status(err.status || 500).json({ error: err.message || err }));
});

module.exports = router;
