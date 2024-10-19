const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { verifyMessage } = require('ethers');
const cors = require('cors');

const app = express(); // Initialize express

// Apply CORS middleware after initializing app
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure: true in production if using HTTPS
}));

// Endpoint to get nonce
app.get('/api/nonce', (req, res) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  req.session.nonce = nonce;
  res.json({ nonce });
});

// Endpoint to verify signature and log in
app.post('/api/login', (req, res) => {
  const { address, signature } = req.body;
  const message = `I am signing my one-time nonce: ${req.session.nonce}`;

  try {
    const recoveredAddress = verifyMessage(message, signature);
    console.log("recoveredAddress", recoveredAddress)
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      req.session.address = address;
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Signature verification failed' });
    }
  } catch (error) {
    console.error('Error verifying message:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Endpoint to check session
app.get('/api/session', (req, res) => {
  if (req.session.address) {
    res.json({ address: req.session.address });
  } else {
    res.status(401).json({ error: 'Not signed in' });
  }
});

// Endpoint to log out
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Start the server
app.listen(4000, () => {
  console.log('Server running on port 4000');
});
