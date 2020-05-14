const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid/v4');


module.exports = (db) => {
  const createNewQuote = (content) => {
    const quoteId = uuid().substr(0, 8);

    // creating the new quote object
    const newQuote = {
      id: quoteId,
      quote: content,
    };

    // Add the newQuote object to movieQuotesDb

    db.movieQuotesDb[quoteId] = newQuote;

    return quoteId;
  };

  const updateQuote = (quoteId, content) => {
    // updating the quote key in the quote object
    db.movieQuotesDb[quoteId].quote = content;

    return true;
  };

  // Register the user in the db
  const addNewUser = (name, email, password) => {
    // Generate a random id
    const userId = uuid().substr(0, 8);

    const newUserObj = {
      id: userId,
      name,
      email,
      password: bcrypt.hashSync(password, saltRounds),
    };

    // Add the user Object into the usersDb

    db.usersDb[userId] = newUserObj;

    // return the id of the user

    return userId;
  };

  const findUserByEmail = (email) => {
    // loop through the usersDb object
    for (let userId in db.usersDb) {
      // compare the emails, if they match return the user obj
      if (db.usersDb[userId].email === email) {
        return db.usersDb[userId];
      }
    }

    // after the loop, return false
    return false;
  };

  const authenticateUser = (email, password) => {
    // retrieve the user with that email
    const user = findUserByEmail(email);

    // if we got a user back and the passwords match then return the userObj
    if (user && bcrypt.compareSync(password, user.password)) {
      // user is authenticated
      return user;
    } else {
      // Otherwise return false
      return false;
    }
  };

  const getUser = (userId) => db.usersDb[userId];

  const deleteQuote = (quoteId) => delete db.movieQuotesDb[quoteId];

  const getMovieQuote = (quoteId) => db.movieQuotesDb[quoteId];

  const getQuoteList = () =>  Object.values(db.movieQuotesDb);

  return {
    authenticateUser,
    findUserByEmail,
    addNewUser,
    updateQuote,
    createNewQuote,
    getUser,
    deleteQuote,
    getMovieQuote,
    getQuoteList
  };
};
