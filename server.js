const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const cookieSession = require('cookie-session');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes= require('./routes/quoteRoutes');
const db = require('./db/db');
const dbHelpers = require('./helpers/dbHelpers')(db);


const PORT = process.env.PORT || 3005;

// creating an Express app
const app = express();


// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

app.use(cookieSession({
  name: 'session',
  keys: ['8752481f-8b80-4786-a1cf-9424f140672b', 'cb6dffee-5151-46f8-b066-bec7fc89ff5d']
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Static assets (images, css files) are being served from the public folder
app.use(express.static('public'));

// Use the routes

app.use(userRoutes(dbHelpers));
app.use(quoteRoutes(dbHelpers));

// Setting ejs as the template engine
app.set('view engine', 'ejs');


// CRUD operations

// List all the quotes
// READ
// GET /quotes

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
