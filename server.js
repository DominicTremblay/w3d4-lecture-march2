const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/userRoutes');
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
app.use(morgan('combined'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

app.use(userRoutes(dbHelpers));

// Setting ejs as the template engine
app.set('view engine', 'ejs');

// Custom Logger
const logger = (req, res, next) => {

  // printing the content of req.body on every request
  console.log("req.body", req.body);

  // attaching a string on the request object
  req.secret = "my secret password is test!";
  next();
} 

app.use(logger);

// CRUD operations

// List all the quotes
// READ
// GET /quotes

app.get('/quotes', (req, res) => {
  const quoteList = Object.values(movieQuotesDb);

console.log("SECRET", req.secret);

  // get the current user
  // read the user id value from the cookies

  // const userId = req.cookies['user_id'];

  const userId = req.session['user_id'];

  const loggedInUser = usersDb[userId];

  const templateVars = { quotesArr: quoteList, currentUser: loggedInUser };

  res.render('quotes', templateVars);
});

// Display the add quote form
// READ
// GET /quotes/new

app.get('/quotes/new', (req, res) => {
  // get the current user
  // read the user id value from the cookies

  // const userId = req.cookies['user_id'];

  const userId = req.session['user_id'];

  const loggedInUser = usersDb[userId];

  const templateVars = { currentUser: loggedInUser };

  res.render('new_quote', templateVars);
});

// Add a new quote
// CREATE
// POST /quotes

app.post('/quotes', (req, res) => {
  // extract the quote content from the form.
  // content of the form is contained in an object call req.body
  // req.body is given by the bodyParser middleware
  const quoteStr = req.body.quoteContent;

  // Add a new quote in movieQuotesDb

  createNewQuote(quoteStr);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// Edit a quote

// Display the form
// GET /quotes/:id
app.get('/quotes/:id', (req, res) => {
  const quoteId = req.params.id;
  // get the current user
  // read the user id value from the cookies

  // const userId = req.cookies['user_id'];

  const userId = req.session['user_id'];

  const loggedInUser = usersDb[userId];
  const templateVars = {
    quoteObj: movieQuotesDb[quoteId],
    currentUser: loggedInUser,
  };

  // render the show page
  res.render('quote_show', templateVars);
});

// Update the quote in the movieQuotesDb
// PUT /quotes/:id

app.post('/quotes/:id', (req, res) => {
  // Extract the  id from the url
  const quoteId = req.params.id;

  // Extract the content from the form
  const quoteStr = req.body.quoteContent;

  // Update the quote in movieQuotesDb

  updateQuote(quoteId, quoteStr);

  // redirect to '/quotes'
  res.redirect('/quotes');
});

// DELETE
app.post('/quotes/:id/delete', (req, res) => {
  const quoteId = req.params.id;

  delete movieQuotesDb[quoteId];

  res.redirect('/quotes');
});

// Delete the quote

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
