const prisma = require('../prismaClient');

// Admin: Create new field
exports.createField = async (req, res) => {
  const { name, location, description } = req.body;
  try {
    const field = await prisma.field.create({
      data: {
        name,
        location,
        description
      }
    });
    res.status(201).json({ message: 'Field created successfully', field });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all fields
exports.getAllFields = async (req, res) => {
  try {
    const fields = await prisma.field.findMany({
      include: {
        schedules: true
      }
    });
    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get field by ID with schedules
exports.getFieldById = async (req, res) => {
  const { id } = req.params;
  try {
    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) },
      include: {
        schedules: {
          where: {
            date: {
              gte: new Date() // Only get future schedules
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    });
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.status(200).json(field);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update field
exports.updateField = async (req, res) => {
  const { id } = req.params;
  const { name, location, description } = req.body;
  try {
    const field = await prisma.field.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        description
      }
    });
    res.status(200).json({ message: 'Field updated successfully', field });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Admin: Delete field
exports.deleteField = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.field.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Field deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
