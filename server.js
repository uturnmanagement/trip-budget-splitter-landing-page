const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize SQLite database
const db = new sqlite3.Database('./waitlist.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Leads table ready.');
      }
    });
  }
});

// POST /api/waitlist - Handle waitlist submissions
app.post('/api/waitlist', (req, res) => {
  const { firstName, email } = req.body;

  // Validation
  if (!firstName || !firstName.trim()) {
    return res.status(400).json({ error: 'First name is required.' });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Check for duplicate email
  db.get('SELECT email FROM leads WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Server error.' });
    }
    if (row) {
      return res.status(409).json({ error: 'This email is already on the waitlist.' });
    }

    // Insert new lead
    db.run('INSERT INTO leads (first_name, email) VALUES (?, ?)', [firstName.trim(), email.trim()], function(err) {
      if (err) {
        console.error('Insert error:', err.message);
        return res.status(500).json({ error: 'Server error.' });
      }
      res.status(201).json({ message: 'You\'re on the waitlist!' });
    });
  });
});

// GET /admin - Simple admin page to view leads
app.get('/admin', (req, res) => {
  db.all('SELECT first_name, email, created_at FROM leads ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).send('Server error.');
    }

    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin - Waitlist Leads</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f4f4f4; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; background: white; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Waitlist Leads</h1>
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Email</th>
              <th>Signup Date</th>
            </tr>
          </thead>
          <tbody>
    `;

    rows.forEach(row => {
      html += `
        <tr>
          <td>${row.first_name}</td>
          <td>${row.email}</td>
          <td>${new Date(row.created_at).toLocaleString()}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});