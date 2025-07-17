const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@sportfield.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@sportfield.com',
        password: hashedPassword,
        role: 'ADMIN'
      },
    });

    console.log('Admin account created:', admin);

    // Create a sample field
    const field = await prisma.field.create({
      data: {
        name: 'Lapangan Futsal A',
        location: 'Jl. Sport Center No. 1',
        description: 'Lapangan futsal dengan rumput sintetis berkualitas tinggi',
      },
    });

    // Create some sample schedules for today and tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await Promise.all([
      // Today's schedules
      prisma.schedule.create({
        data: {
          fieldId: field.id,
          date: today,
          startTime: '08:00',
          endTime: '09:00',
          available: true,
        },
      }),
      prisma.schedule.create({
        data: {
          fieldId: field.id,
          date: today,
          startTime: '09:00',
          endTime: '10:00',
          available: true,
        },
      }),
      // Tomorrow's schedules
      prisma.schedule.create({
        data: {
          fieldId: field.id,
          date: tomorrow,
          startTime: '08:00',
          endTime: '09:00',
          available: true,
        },
      }),
      prisma.schedule.create({
        data: {
          fieldId: field.id,
          date: tomorrow,
          startTime: '09:00',
          endTime: '10:00',
          available: true,
        },
      }),
    ]);

    console.log('Sample field and schedules created:', { field, schedules });
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
