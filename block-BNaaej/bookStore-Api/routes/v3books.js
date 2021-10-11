var express = require('express');
var _ = require('lodash');
var User = require('../models/User');
var Book = require('../models/Book');

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

//delete a comment
router.get('/:id/comment/delete/:commId', async (req, res, next) => {
  let bookId = req.params.id;
  let commentId = req.params.commId;
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    const updatedUser = await User.findByIdAndUpdate(deletedComment.createdBy, {
      $pull: { comments: deletedComment.id },
    });
    res.json({ deletedComment, updatedUser });
  } catch (error) {
    next(error);
  }
});

//list books by category

router.get('/list/:category', async (req, res, next) => {
  let category = req.params.category;
  try {
    let books = await Book.find({ categories: category });
    res.json({ books });
  } catch (error) {
    next(error);
  }
});

//count books for each category

router.get('/count/:category', async (req, res, next) => {
  let category = req.params.category;
  try {
    let books = await Book.find({ categories: category }).count();
    res.json({ books });
  } catch (error) {
    next(error);
  }
});

//list of books by auther

router.get('/list/author/:id', async (req, res, next) => {
  let authorId = req.params.id;
  try {
    let user = User.findById(authorId).populate('books');
    res.json({ books: user.books });
  } catch (error) {
    next(error);
  }
});

//list of all tags

router.get('/tagslist', async (req, res, next) => {
  try {
    console.log('test');
    var tags = await Book.find({}).distinct('tags');
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
});

// Get all tags

// router.get('/tags/Taglist', async (req, res, next) => {
//   try {
//     var tags = await Book.find({}).distinct('tags');
//     res.status(200).json({ tags });
//   } catch (error) {
//     next(error);
//   }
// });

//list of tags in ascending/descending order
router.get('/tags/tagslist/:type', (req, res, next) => {
  let type = req.params.type;

  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    if (type === 'asc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }

    if (type === 'desc') {
      arrOftags = arrOftags.sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }

        // names must be equal
        return 0;
      });

      return res.json({ arrOftags });
    }
  });
});

//filter books by tags

router.get('/list/tags/:name', (req, res, next) => {
  let name = req.params.name;

  Book.find({ tags: name }, (err, books) => {
    if (err) return next(err);

    res.json({ books });
  });
});

//count of number of books of each  tags

router.get('/tags/tagslist/count', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);

    let arrOftags = books.reduce((acc, cv) => {
      acc.push(cv.tags);
      return acc;
    }, []);

    arrOftags = _.uniq(_.flattenDeep(arrOftags));

    let objOfcount = {};

    arrOftags.forEach((tag) => {
      Book.find({ tags: tag }, (err, booksByTags) => {
        if (err) return next(err);

        objOfcount[tag] = booksByTags.length;
      });
    });

    return res.json(objOfcount);
  });
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