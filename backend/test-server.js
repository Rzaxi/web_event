console.log('Starting test server...');

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Test server is working!');
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
