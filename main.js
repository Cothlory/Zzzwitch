const express = require('express');
const fs = require('fs');
const app = express();

const FILENAME = 'zzz.json';

app.get('/log', (req, res) => {
  const event = req.query.event;
  if (event !== 'sleep' && event !== 'wake') {
    return res.status(400).send('Invalid event');
  }

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const timestamp = now.toISOString();

  let data = {};
  if (fs.existsSync(FILENAME)) {
    data = JSON.parse(fs.readFileSync(FILENAME));
  }

  if (!data[date]) data[date] = { sleep: [], wake: [] };
  data[date][event].push(timestamp);

  fs.writeFileSync(FILENAME, JSON.stringify(data, null, 2));
  res.send(`Logged ${event} at ${timestamp}`);
});

app.listen(8080, () => console.log('Listen on 8080'));
