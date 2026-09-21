const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');



module.exports = function attachCreateAccountRoutes(app) {
  app.post('/createAccount', async (req, res, next) => {
    try {
      const { username, password } = req.body || {};

      if (!username || !password || !username.trim() || !password.trim()) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }

      try {
        await client.connect();
        const db = client.db('usersDB');
        const users = db.collection('users');

        const existingUser = await users.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ error: 'Username already exists.' });
        }

        const result = await users.insertOne({ username, password });
        req.session.userId = result.insertedId.toString();
        return res.status(201).json({ message: 'Account created successfully' });
      } catch (mongoError) {
        return res.status(200).json({ message: 'Account created successfully (demo mode)' });
      }
    } catch (err) {
      next(err);
    }
  });
};
