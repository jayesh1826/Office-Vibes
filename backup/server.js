const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8001;

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Endpoint for songs data
app.get('/api/songs', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'songs.json'));
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`?? Office Vibes is running!`);
  console.log(`?? http://localhost:${PORT}`);
  console.log(`=================================`);
});
