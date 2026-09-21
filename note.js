const path = require('path');
const {Checker, loginChecker} = require("./loginChecker");
const login = require('./login');

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.redirect('/');
  next();
}

module.exports = function attachNoteRoute(app) {
  app.get('/note-app', requireLogin, loginChecker, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
};
