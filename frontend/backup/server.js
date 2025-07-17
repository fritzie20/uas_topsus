const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/predict', (req, res) => {
  const py = spawn('python', [__dirname + '/predict.py']);
  const input = JSON.stringify(req.body);
  let dataString = '';

  py.stdin.write(input);
  py.stdin.end();

  py.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  py.stdout.on('end', () => {
    console.log('Python stdout:', dataString); // LOG output Python mentah
    try {
      const result = JSON.parse(dataString);
      res.json(result);
    } catch (error) {
      console.error('Error parsing Python output:', error);
      res.status(500).json({ error: 'Failed to parse Python output', details: dataString });
    }
  });


  py.stderr.on('data', (err) => {
    console.error('Python error:', err.toString());
    res.status(500).json({ error: 'Python prediction error', details: err.toString() });
  });

  py.on('error', (err) => {
    console.error('Failed to start Python process:', err.toString());
    res.status(500).json({ error: 'Failed to start Python process', details: err.toString() });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
