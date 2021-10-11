let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  books: { type: mongoose.Types.ObjectId, ref: 'Book' },
  comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
});

let User = mongoose.model('User', userSchema);

module.exports = User;