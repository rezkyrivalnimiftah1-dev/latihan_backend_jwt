const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categorycontroller');
const auth = require('../midlewares/auth');
const { validateCategoryCreate, validateCategoryUpdate } = require('../midlewares/validation');

router.get('/', categoryController.getAll);            // public
router.get('/:id', categoryController.getById);        // public
router.post('/', auth, validateCategoryCreate, categoryController.create); // protected
router.put('/:id', auth, validateCategoryUpdate, categoryController.update); // protected
router.delete('/:id', auth, categoryController.remove); // protected

module.exports = router;