const prisma = require('../prismaClient');

// Create a new booking
exports.createBooking = async (req, res) => {
  const { userId, fieldId, scheduleId } = req.body;
  try {
    // Check if schedule is available
    const schedule = await prisma.schedule.findUnique({
      where: { id: parseInt(scheduleId) },
      include: { booking: true }
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (!schedule.available || schedule.booking) {
      return res.status(400).json({ error: 'Schedule is not available' });
    }

    // Create booking and update schedule
    const booking = await prisma.$transaction(async (prisma) => {
      // Create the booking
      const newBooking = await prisma.booking.create({
        data: {
          userId: parseInt(userId),
          fieldId: parseInt(fieldId),
          scheduleId: parseInt(scheduleId),
          status: 'PENDING'
        }
      });

      // Update schedule availability
      await prisma.schedule.update({
        where: { id: parseInt(scheduleId) },
        data: { available: false }
      });

      return newBooking;
    });

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: parseInt(userId) },
      include: {
        field: true,
        schedule: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        field: true,
        schedule: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        schedule: true
      }
    });

    // If booking is canceled, make schedule available again
    if (status === 'CANCELED') {
      await prisma.schedule.update({
        where: { id: booking.scheduleId },
        data: { available: true }
      });
    }

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cancel booking (for users)
exports.cancelBooking = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    await prisma.$transaction(async (prisma) => {
      // Update booking status
      await prisma.booking.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELED' }
      });

      // Make schedule available again
      await prisma.schedule.update({
        where: { id: booking.scheduleId },
        data: { available: true }
      });
    });

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
