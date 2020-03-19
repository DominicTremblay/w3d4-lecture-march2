const express = require('express');
const router = express.Router();
const { movieQuotesDb, quoteComments, usersDb } = require('../db/inMemoryDb');
const {
  createNewQuote,
  updateQuote,
  addNewUser,
  findUserByEmail,
  authenticateUser,
} = require('../helpers/appHelpers');

// CRUD operations

// List all the quotes
// READ
// GET /quotes

router.get('/', (req, res) => {
  const quoteList = Object.values(movieQuotesDb);

  // get the current user
  // read the user id value from the cookies

  //const userId = req.cookies['user_id'];

  const userId = req.session.user_id;

  const loggedInUser = usersDb[userId];

  const templateVars = { quotesArr: quoteList, currentUser: loggedInUser };

  res.render('quotes', templateVars);

  // res.json(movieQuotesDb);
});

// Display the add quote form
// READ
// GET /quotes/new

router.get('/new', (req, res) => {
  // get the current user
  // read the user id value from the cookies

  //const userId = req.cookies['user_id'];

  const userId = req.session.user_id;

  const loggedInUser = usersDb[userId];

  const templateVars = { currentUser: loggedInUser };

  res.render('new_quote', templateVars);
});

// Add a new quote
// CREATE
// POST /quotes

router.post('/', (req, res) => {
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
router.get('/:id', (req, res) => {
  const quoteId = req.params.id;
  // get the current user
  // read the user id value from the cookies

  //const userId = req.cookies['user_id'];

  const userId = req.session.user_id;

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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const quoteId = req.params.id;

  delete movieQuotesDb[quoteId];

  res.redirect('/quotes');
});

// Delete the quote

module.exports = router;
