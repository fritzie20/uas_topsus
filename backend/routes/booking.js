const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuth, isAdmin } = require('../middleware/auth');

// User routes (remove auth middleware temporarily for testing)
router.post('/', bookingController.createBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.put('/:id/cancel/:userId', bookingController.cancelBooking);

// Admin routes
router.get('/', bookingController.getAllBookings);
router.put('/:id/status', bookingController.updateBookingStatus);

module.exports = router;
