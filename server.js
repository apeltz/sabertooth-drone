const express = require('express');
const app = express();
const fs = require('fs');

app.use('/client', express.static('client'));

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync(__dirname + '/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || PORT, function() {
	console.log('Server listening on port', PORT)
});
