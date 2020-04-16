const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const {movieQuotesDb, quoteComments, usersDb} = require('./db/db')
const dbHelpers = require('./helpers/dbHelpers')(movieQuotesDb, quoteComments, usersDb);

const saltRounds = 10;

// creating an Express app
const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['dcaf45b0-7568-40d7-9b62-d04dc4d7e711', '1d224f9c-43ae-47ba-8ad6-eb10ae8f1a6c']
}))


// const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3005;


// app.use(cookieParser());

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));


// Setting ejs as the template engine
app.set('view engine', 'ejs');

// using the users' routes
app.use(userRoutes(dbHelpers));

// using the quotes' routes
// using a '/quotes/ prefix. So '/quotes/ does not need to be in the actual end points
app.use('/quotes', quoteRoutes(dbHelpers));
// Custom Logger Middleware
const logger = (req, res, next) => {
  
  // printing the content of req.body on every request
  console.log("req.body", req.body);
  
  // attaching a string on the request object
  req.secret = "my secret password is test!";
  next();
} 

app.use(logger);


app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
