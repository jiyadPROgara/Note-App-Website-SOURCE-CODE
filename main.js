const express = require('express');
const path = require('path');
const secureSession = require('./SecureSession');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(secureSession);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

require('./login.js')(app);
require('./newAcc.js')(app);
require('./note.js')(app);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
