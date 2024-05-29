const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
//const cookieParser = require('cookie-parser');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  store: new SQLiteStore(),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

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

// // Middleware to check if user is authenticated
// function isAuthenticated(req, res, next) {
//   console.log('Checking authentication:', req.session.isAuthenticated);
//   if (req.session.isAuthenticated) {
//     next();
//   } else {
//     console.log('User not authenticated. Redirecting to login.');
//     res.redirect('/admin.html');
//   }
// }


// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'Admin' && password === '1234') {
    req.session.isLoggedIn = true;
    res.json({ data: 'Login successful' });
    // res.redirect('/orderlist.html');
  }else if (username !== 'Admin' && password !== '1234') {
    res.status(401).send('Username and password are incorrect');
  } else if (username !== 'Admin') {
    res.status(401).send('Please enter correct username');
  } else if (password !== '1234') {
    res.status(401).send('Please enter correct password');
  }

});

// Logout endpoint
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    } else {
      res.redirect('/admin.html');  // Ensure this matches your file name
    }
  });
});

// app.get('/orderlist.html', (req, res) => {
//   //res.sendFile(path.join(__dirname, 'public', 'orderlist.html'));
//   if (req.session.isLoggedIn) {
//     alert("inside session")
//     next();
//   } else {
//     res.redirect('/login.html');
//   }
// });

app.get('/orderlist.html', (req, res) => {
  if (req.session.isLoggedIn) {
    return res.status(401).send('Unauthorized page it isssssssssssss');
  }
})

app.get('/orderList', (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).send('Unauthorized page it isssssssssssss');
  }

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


app.get('/getProductsList',  (req, res) => {
  const sql = "SELECT id, productName FROM productMaster WHERE isDisable = 0";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching product list:", err);
      res.status(500).send("Error fetching product list");
    } else {
      res.json(results);
    }
  });
});

app.post('/submitForm', (req, res) => {
  const { productId, name, email, phone, quantity, comments } = req.body;
  const insertQuery = "INSERT INTO orders (productId, name, email, phone, quantity, comments) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(insertQuery, [productId, name, email, phone, quantity, comments], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data");
    } else {
      console.log("1 record inserted");
      res.sendStatus(200);
      const productQuery = "SELECT productName FROM productMaster WHERE id = ?";
      connection.query(productQuery, [productId], (err, result) => {
        if (err) {
          console.error("Error fetching product name:", err);
          res.status(500).send("Error fetching product name");
        } else {
          const productName = result[0].productName;
          sendEmails(name, email, phone, productName, quantity, comments);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
