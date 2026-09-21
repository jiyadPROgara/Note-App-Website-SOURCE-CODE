const session = require('express-session');

// The browser receives a random session-ID cookie named connect.sid.
// The user's MongoDB _id stays server-side in req.session.
module.exports = session({
  secret: process.env.SESSION_SECRET || 'change-this-development-secret-before-deploying',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // Change to true when the deployed site uses HTTPS.
  },
});
