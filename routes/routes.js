const express = require("express")
const router = express.Router();
const fs = require('fs');

const bookRoutes = require('./book.js') // import book route
router.use(bookRoutes) // use book route

module.exports = router;


