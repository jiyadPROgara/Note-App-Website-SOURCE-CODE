const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
const sanitize = require('mongo-sanitize');
const {CheckCredentials} = "./loginChecker.js";
module.exports = function attachLoginRoutes(app) {
  app.post('/login', async (req, res, next) => {
    try {
      const { username, password } = req.body || {};

      if (!username || !password || !username.trim() || !password.trim()) {
        return res.status(400).json({ error: 'Username or password are NULL' });
      }
       if(!CheckCredentials(username, password)){
          return res.status(400).json({
            error: "Invalid Credentials"
          });
        };
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
      try {
        const username = sanitize(req.bod.username);
        const password = sanitize(req.body.password);
        await client.connect();
        const db = client.db('usersDB');
        const users = db.collection('users');
        const user = await users.findOne({ username, password });

        
       
        req.session.userId = user._id.toString();
        
        return res.status(200).json({ message: `Welcome, ${username}! Login successful.` });
      } catch (mongoError) {
       

        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      next(err);
    }
  });
};
