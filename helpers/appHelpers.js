const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const { movieQuotesDb, quoteComments, usersDb } = require('../db/inMemoryDb');
const saltRounds = 10;

const createNewQuote = content => {
  const quoteId = uuid().substr(0, 8);

  // {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }

  // creating the new quote object
  const newQuote = {
    id: quoteId,
    quote: content,
  };

  // Add the newQuote object to movieQuotesDb

  movieQuotesDb[quoteId] = newQuote;

  return quoteId;
};

const updateQuote = (quoteId, content) => {
  // d9424e04: {
  //   id: 'd9424e04',
  //   quote: 'Why so serious?',
  // }

  // updating the quote key in the quote object
  movieQuotesDb[quoteId].quote = content;

  return true;
};

const addNewUser = (name, email, password) => {
  // Generate a random id
  const salt = bcrypt.genSaltSync(saltRounds);
  const userId = uuid().substr(0, 8);

  // Create a new user object
  //  {
  //    id: 'eb849b1f',
  //      name: 'Kent Cook',
  //        email: 'really.kent.cook@kitchen.com',
  //          password: 'cookinglessons',
  //  }

  const newUserObj = {
    id: userId,
    name,
    email,
    password: bcrypt.hashSync(password, salt),
  };

  // Add the user Object into the usersDb

  usersDb[userId] = newUserObj;

  // return the id of the user

  return userId;
};

const findUserByEmail = email => {
  // const user = Object.values(usersDb).find(userObj => userObj.email === email)
  //  return user;

  // loop through the usersDb object
  for (let userId in usersDb) {
    // compare the emails, if they match return the user obj
    if (usersDb[userId].email === email) {
      return usersDb[userId];
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

module.exports = {
  createNewQuote,
  updateQuote,
  addNewUser,
  findUserByEmail,
  authenticateUser,
};
