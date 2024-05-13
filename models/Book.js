const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'Author' }
});

module.exports = mongoose.model('Book', bookSchema);
