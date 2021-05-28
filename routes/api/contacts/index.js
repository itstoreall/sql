const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/contacts');
const guard = require('../../../helpers/guard');
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateContactFavorite,
} = require('./validation');

// GET
router.get('/', guard, ctrl.getAll);

// GET by ID
router.get('/:id', guard, ctrl.getById);

// POST
router.post('/', guard, validateCreateContact, ctrl.create);

// DELETE
router.delete('/:id', guard, ctrl.remove);

// PUT
router.put('/:id', guard, validateUpdateContact, ctrl.update);

// PATCH
router.patch(
  '/:id/favorite',
  guard,
  validateUpdateContactFavorite,
  ctrl.update,
);

module.exports = router;
