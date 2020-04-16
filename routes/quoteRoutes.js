const express = require('express');
const router = express.Router();

// CRUD operations on Quotes

module.exports = (dbHelpers) => {
  // List all the quotes
  // READ
  // GET /quotes

  router.get('/', (req, res) => {
    console.log('GET Quotes');

    const quoteList = dbHelpers.getQuoteList();

    // get the current user
    // read the user id value from the cookies

    // const userId = req.cookies['user_id'];

    const userId = req.session['user_id'];

    // Get the user object from the usersDb
    const loggedInUser = dbHelpers.getCurrentUser(userId);

    const templateVars = { quotesArr: quoteList, currentUser: loggedInUser };

    res.render('quotes', templateVars);
  });

  // Display the add quote form
  // READ
  // GET /quotes/new

  router.get('/new', (req, res) => {
    // get the current user
    // read the user id value from the cookies

    // const userId = req.cookies['user_id'];

    const userId = req.session['user_id'];

    const loggedInUser = dbHelpers.getCurrentUser(userId);

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

    dbHelpers.createNewQuote(quoteStr);

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

    // const userId = req.cookies['user_id'];

    const userId = req.session['user_id'];

    const loggedInUser = dbHelpers.getCurrentUser(userId);
    const templateVars = {
      quoteObj: dbHelpers.getMovieQuote(quoteId),
      currentUser: loggedInUser,
    };

    // render the show page
    res.render('quote_show', templateVars);
  });

  // Update the quote in the movieQuotesDb
  // PUT /quotes/:id

  router.post('/:id', (req, res) => {
    // Extract the  id from the url
    const quoteId = req.params.id;

    // Extract the content from the form
    const quoteStr = req.body.quoteContent;

    // Update the quote in movieQuotesDb

    dbHelpers.updateQuote(quoteId, quoteStr);

    // redirect to '/quotes'
    res.redirect('/quotes');
  });

  // Delete the quote
  router.post('/:id/delete', (req, res) => {
    const quoteId = req.params.id;

    dbHelpers.deleteQuote(quoteId);

    res.redirect('/quotes');
  });

  return router;
};
