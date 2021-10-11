var express = require('express');
var User = require('../models/User');
const Book = require('../models/Book');

var router = express.Router();

/* GET list of all books. */

router.get('/', async (req, res, next) => {
  try {
    let books = await Book.find({});
    res.json({ books });
  } catch (error) {
    next(err);
  }
});

// Create a book

router.post('/', async (req, res, next) => {
  let data = req.body;
  try {
    let createdBook = await Book.create(data);
    res.status(200).json({ createdBook });
  } catch (error) {
    next(error);
  }
});

//update a Book
router.put('/:id', async (req, res, next) => {
  let data = req.body;
  let bookId = req.params.id;
  try {
    let Book = await Book.findByIdAndUpdate(bookId, data);
    res.json({ Book });
  } catch (error) {
    next(error);
  }
});

//delete a book

router.delete('/:id', async (req, res, next) => {
  let boodId = req.params.id;
  try {
    let deletedBook = Book.findByIdAndDelete(bookId);
    res.json({ deletedBook });
  } catch (error) {
    next(error);
  }
});

//get book by id

router.get('/:id', async (req, res, next) => {
  let bookId = req.params.id;
  try {
    let book = await Book.findById(bookId);
    res.json({ book });
  } catch (error) {
    next(error);
  }
});

module.exports = router;