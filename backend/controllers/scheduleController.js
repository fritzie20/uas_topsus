const prisma = require('../prismaClient');

// Admin: Create schedule
exports.createSchedule = async (req, res) => {
  const { fieldId, date, startTime, endTime } = req.body;
  try {
    const schedule = await prisma.schedule.create({
      data: {
        fieldId: parseInt(fieldId),
        date: new Date(date),
        startTime,
        endTime,
        available: true
      }
    });
    res.status(201).json({ message: 'Schedule created successfully', schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get available schedules for a field
exports.getFieldSchedules = async (req, res) => {
  const { fieldId } = req.params;
  const { date } = req.query;
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        fieldId: parseInt(fieldId),
        date: date ? new Date(date) : undefined,
        available: true
      },
      include: {
        field: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all schedules (for admin)
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        field: true,
        booking: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update schedule
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, available } = req.body;
  try {
    const schedule = await prisma.schedule.update({
      where: { id: parseInt(id) },
      data: {
        date: date ? new Date(date) : undefined,
        startTime,
        endTime,
        available
      }
    });
    res.status(200).json({ message: 'Schedule updated successfully', schedule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin: Delete schedule
exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.schedule.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
