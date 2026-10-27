const express = require('express');
const router =express.Router();

const movieController= require('../controllers/moviecontroller');
const auth= require('../midlewares/auth');

const {validateMovieCreate, validateMovieUpdate} = require('../midlewares/validation');

router.get('/', movieController.getAll);               // public
router.get('/:id', movieController.getById);           // public
router.post('/', auth, validateMovieCreate, movieController.create); // protected
router.put('/:id', auth, validateMovieUpdate, movieController.update); // protected
router.delete('/:id', auth, movieController.remove);   // protected

module.exports = router;