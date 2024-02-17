const { json } = require('body-parser');
const express = require('express');
const bookRoutes = express.Router();
const fs = require('fs');

module.exports = bookRoutes

const dataPath = './db/database.json' // path to our JSON file

// FUNCTIONS
const saveBookData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const getBookData = () => {
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return (JSON.parse(jsonData));  
};

const deleteBook = (bookId) => {
    const existBooks = getBookData();

    // Check if the book with the given ID exists
    if (existBooks.hasOwnProperty(bookId)) {
        // Delete the book with the specified ID
        delete existBooks[bookId];

        // Save the updated data
        saveBookData(existBooks);
        return true; // Indicate successful deletion
    } else {
        return false; // Indicate book not found
    }
};


//HOME
bookRoutes.get('/', (req, res) => {
    res.render('home');
  })

//INDEX
bookRoutes.get('/books', (req, res) => {
    const books = getBookData();

    res.render('books', { books });
  })


// SEARCH
bookRoutes.get('/books/search', (req, res) => {
    const searchTerm = req.query.searchTerm.toLowerCase();
    const books = getBookData();

    // Filter the books based on the search term
    const filteredBooks = Object.values(books).filter(book => {
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        const overview = book.overview.toLowerCase();

        return title.includes(searchTerm) || author.includes(searchTerm) || overview.includes(searchTerm);
    });

    res.render('books', { books: filteredBooks });
});

//NEW
  bookRoutes.get('/books/new', (req, res) => {
    const existBooks = getBookData();
    const maxBookId = Math.max(...Object.keys(existBooks).map(Number));
    const newBookId = maxBookId + 1;

    res.render('newbook', { newBookId });
})

//SHOW
bookRoutes.get('/books/:id', (req, res) => {
    const existBooks = getBookData();
    const bookId = req.params.id;
    const book = existBooks[bookId];

    res.render('book', { book, bookId });
});

//CREATE
bookRoutes.post('/books/insertbook', (req, res) => {
    const existBooks = getBookData();

    // Find the maximum existing book id
    const maxBookId = Math.max(...Object.keys(existBooks).map(Number));

    // Calculate a new unique book id
    const newBookId = maxBookId + 1;

    // Set the new book with the calculated id and form data
    existBooks[newBookId] = {
        id: newBookId,
        title: req.body.title,
        author: req.body.author,
        pages: req.body.pages,
        year: req.body.year,
        image_url: req.body.image_url,
        rating: req.body.rating,
        overview: req.body.overview,
    };

    // Save the updated data
    saveBookData(existBooks);

    // Redirect to the newly created book's show page
    res.redirect(`/books/${newBookId}`);
});

//EDIT
bookRoutes.get('/books/edit/:id', (req, res) => {
    const existBooks = getBookData();
    const bookId = req.params.id;
    const book = existBooks[bookId];
    console.log(bookId)
    console.log(book)

    res.render('editBook', { book });
});

//UPDATE
bookRoutes.post('/books/update/:id', (req, res) => {
    const existBooks = getBookData();
    const bookId = req.params.id;
    existBooks[bookId] = req.body;
    
    saveBookData(existBooks);
    
    res.redirect('/books');
});

// DELETE
bookRoutes.post('/books/delete/:id', (req, res) => {
    const bookId = req.params.id;

    // Attempt to delete the book with the given ID
    const deletionSuccess = deleteBook(bookId);

    if (deletionSuccess) {
        // Redirect to the books index page after successful deletion
        res.redirect('/books');
    } else {
        // If the book with the given ID does not exist, send a 404 Not Found response
        res.status(404).send('Book not found');
    };
});