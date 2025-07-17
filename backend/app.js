const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/field');
const scheduleRoutes = require('./routes/schedule');
const bookingRoutes = require('./routes/booking');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
