const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;

const corsOptions = {
  origin: 'http://127.0.0.1:5501',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: "mysecretKey",
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: 'lax' // Adjust sameSite attribute as needed
  }
}));
// app.use(session({
//   secret: "mysecretKey",
//     saveUninitialized: true,
//     resave: true
// }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5501');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  database: 'productsdb',
  user: 'root',
  password: ''
});

connection.connect(function (error) {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('MySQL database is connected');
  }
});

const user = {
  username: "Admin"
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Admin' && password === '1234') {
    req.session.user = user;
    req.session.save();
    //res.send("Your are logged in");
    res.json({ success: true })
  }
  else {
    res.send('Invalid username or password');
  }
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user && req.session.user.username === 'Admin') {
    return next();
  } else {
    //res.redirect('admin.html')
    res.status(401).send('You are not authorized to view this page. Please log in.');
  }
}


app.get('/orderList', isAuthenticated, (req, res) => {
  //res.send(req.session.user);
  const sql = `
    SELECT o.id, o.orderDate, p.productName, o.name, o.email, o.phone, o.quantity, o.comments 
    FROM orders o INNER JOIN productMaster p ON o.productId = p.id ORDER BY o.id DESC;`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).send("Error fetching orders");
    } else {
      console.log('Query result:', result);
      res.json(result);
    }
  });
});


// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    } else {
      res.redirect('/admin.html');
    }
  });
});


// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   if (username === 'Admin' && password === '1234') {
//       req.session.isLoggedIn = true;
//       req.session.username = username;
//       res.json({ success: true });
//      // res.redirect('/orderlist');
//   } else {
//       res.send('Invalid username or password');
//   }

// const { username, password } = req.body;

// if (username === 'Admin' && password === '1234') {
//   req.session.isLoggedIn = true;
//   res.json({ success: true });
// }
// else if (username !== 'Admin' && password !== '1234') {
//   res.status(401).send('Username and password are incorrect');
// }
// else if (username !== 'Admin') {
//   res.status(401).send('Please enter correct username');
// }
// else if (password !== '1234') {
//   res.status(401).send('Please enter correct password');
// }
// // else {
// //     res.json({ success: false });
// // }
//});


// app.get('/isloggedin', (req, res) => {
//   res.json({ isLoggedIn: req.session.isLoggedIn || false });
// });

// // Login endpoint
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (username === 'Admin' && password === '1234') {
//     req.session.isLoggedIn = true;
//     res.json({ data: 'Login successful' });
//     // res.redirect('/orderlist.html');
//   }else if (username !== 'Admin' && password !== '1234') {
//     res.status(401).send('Username and password are incorrect');
//   } else if (username !== 'Admin') {
//     res.status(401).send('Please enter correct username');
//   } else if (password !== '1234') {
//     res.status(401).send('Please enter correct password');
//   }
//});

// // Middleware to protect the order list route
// function authMiddleware(req, res, next) {
//   if (req.session.isLoggedIn && req.session.username === 'Admin') {
//       next();
//   } else {
//       res.redirect('/login');
//   }
// }

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
