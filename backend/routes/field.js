const express = require('express');
const router = express.Router();
const fieldController = require('../controllers/fieldController');
const { isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);

// Admin routes (remove isAdmin middleware temporarily for testing)
router.post('/', fieldController.createField);
router.put('/:id', fieldController.updateField);
router.delete('/:id', fieldController.deleteField);

module.exports = router;
