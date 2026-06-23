// Minimal Express server to serve static frontend and provide an example API
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your existing frontend files from the repo root
app.use(express.static(path.join(__dirname, '..')));

// Example API: POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required' });
  }

  const entry = { name, email, message, receivedAt: new Date().toISOString() };

  const file = path.join(__dirname, 'contacts.json');
  const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  data.push(entry);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  console.log('Contact received:', entry);
  res.json({ ok: true });
});

// Fallback: serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
