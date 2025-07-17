const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { isAdmin } = require('../middleware/auth');

// Public routes
router.get('/field/:fieldId', scheduleController.getFieldSchedules);

// Admin routes (remove isAdmin middleware temporarily for testing)
router.get('/', scheduleController.getAllSchedules);
router.post('/', scheduleController.createSchedule);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
