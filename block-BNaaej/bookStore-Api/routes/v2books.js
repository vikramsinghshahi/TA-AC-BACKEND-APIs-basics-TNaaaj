var express = require('express');
var User = require('../models/User');
const Book = require('../models/Book');
const Comment = require('../models/Comment');

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

//creating new comment

router.post('/:id/comment/new', async (req, res, next) => {
  let bookId = req.params.id;
  let data = req.body;
  try {
    const createdComment = await Comment.create(data);
    let updatedBook = await Book.findByIdAndUpdate(bookId, {
      $push: { comments: createdComment.id },
    });
    res.json({ createdComment, updatedBook });
  } catch (error) {
    next(error);
  }
});

//get list of all comments of current book

router.get('/:id/comments', async (req, res, next) => {
  let bookId = req.params.id;
  try {
    let book = await Book.findById(bookId).populate('comments');
    res.json({ book });
  } catch (error) {
    next(error);
  }
});

//edit a comment

router.get('/:id/comment/edit/:commId', async (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  try {
    const comment = await Comment.findById(commentId);
    res.json({ comment });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/comment/edit/:commId', async (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  let data = req.body;
  try {
    let updatedComment = Comment.findByIdAndUpdate(commentId);
    res.json({ updatedComment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;