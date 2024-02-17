const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser")
const fs = require('fs');

// create our express app
const app = express();
const port = 3000; 

// Set up Handlebars view engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


// Import your bookRoutes
const bookRoutes = require('./routes/book');

// route
const routes = require('./routes/routes')
app.use('/', routes)
app.use('/books', bookRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
