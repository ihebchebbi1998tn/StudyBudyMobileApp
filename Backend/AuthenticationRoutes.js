const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'your-secret-key';

module.exports = (connection) => {
  // Route: Register
  router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, phonenumber } = req.body;
    
    const checkEmailQuery = 'SELECT * FROM Users WHERE LOWER(email) = LOWER(?)';
  
    connection.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error checking email');
      } else {
        if (results.length > 0) {
          res.status(409).send('Email already in use');
        } else {
          const insertQuery = `INSERT INTO Users (firstName, lastName, email, password, phonenumber) VALUES (?, ?, ?, ?, ?)`;
          connection.query(insertQuery, [firstName, lastName, email, password, phonenumber], (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error registering new user');
            } else {
              const userId = result.insertId;
              const token = jwt.sign({ id: userId, email }, jwtSecretKey, { expiresIn: '1h' });
              console.log("token" + token);
              res.status(200).json({ token, userId });
            }
          });
        }
      }
    });
  });

// Login with tokens (works)
router.post('/login', (req, res) => {
    const { identifier, password } = req.body;
    const errors = [];

    if (!identifier) {
        errors.push('identifier');
    }
    if (!password) {
        errors.push('password');
    }

    if (errors.length) {
        res.status(400).json({ errors });
        return;
    }

    // Check if the identifier is an email or phoneNumber
    const isEmail = /\S+@\S+\.\S+/;
    const query = isEmail ? 'SELECT * FROM Users WHERE email = ?' : 'SELECT * FROM Users WHERE phoneNumber = ?';
    const params = [identifier];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        const user = results[0];
        if (results.length === 0) {
            res.status(401).json({ error: 'User not found. Please sign up.' });
            return;
        } else if (user.password !== password) {
            console.log(password + " " + user.password);
            res.status(401).json({ error: 'Incorrect password' });
            return;
        } else {
            // Sign the JWT token with user's email and user's ID
            const token = jwt.sign(
                {
                    identifier: isEmail ? user.email : user.phoneNumber,
                    id: user.userID,
                },
                process.env.JWT_SECRET || 'jwt_secret',
                { expiresIn: '1d' } // Token expires in 1 day
            );
            res.json({ user, token }); // Return the user data and JWT token
        }
    });
});



  return router;
};
