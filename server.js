const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Products API
app.get('/api/products', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Unable to fetch products' });
    }
    res.json(JSON.parse(data));
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
