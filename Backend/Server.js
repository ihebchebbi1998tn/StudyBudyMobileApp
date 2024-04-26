const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'your-secret-key';

const authenticationRoutes = require('./AuthenticationRoutes');
// const coursesRoutes = require('./routes/coursesRoutes');

app.use(cors());
app.use(bodyParser.json());

// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'user',
//   password: 'root',
//   database: 'studybuddy'
// });


// Database Connection Pooling
const pool = mysql.createPool({
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'user',
  password: 'root',
  database: 'studybuddy'
});

app.use('/auth', authenticationRoutes(pool));
//app.use('/courses' , CoursesRoutes(pool))



// connection.connect((err) => {
//   if (err) {
//     console.error('MySQL connection error:', err);
//   } else {
//     console.log('Connected to MySQL database');
//   }
// });

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
module.exports = router;
