const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// const Book = mongoose.model("Book", {
const BookSchema = new mongoose.Schema({
  namaBuku: {
    type: String,
    required: true,
  },
  penerbit: {
    type: String,
    required: true,
  },
  pengarang: {
    type: String,
    required: true,
  },
  tahunTerbit: {
    type: String,
    required: true,
  },
  tempatTerbit: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  jmlhhlmn: {
    type: String,
    required: true,
  },
  abstrak: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: Schema.Types.ObjectId,
    ref: 'uploads.files',
    required: true,
    
    // type: String,
    // required: true,
  },
  // pdf: PdfSchema,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  imageUrl: { type: Schema.Types.ObjectId, 
    ref: 'uploads.files',
    //required: true, 
  },
});

// module.exports = { Book, ObjectId };

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
