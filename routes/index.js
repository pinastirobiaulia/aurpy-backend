const bookRoutes = require("express").Router();
const {
  getAllBooks,
  addBooks,
  getBookById,
  updateBook,
  deleteBook,
  reqError,
  searchBook,
  downloadFile,
  downloadImage,
} = require("../controller/booksController");
const {
  getAllCategories,
  addCategory,
  searchCategories,
  updateCategories,
  deleteCategories,
} = require("../controller/categoriesController");
const { verifyToken, verifyRole2 } = require("../middleware/auth");

// Import the configured multer instance
const upload = require("../middleware/multer");

bookRoutes.get("/books", getAllBooks);
bookRoutes.get("/books/id/:id", getBookById);

//coba baru
bookRoutes.post("/books/tambah", upload.fields([{ name: 'pdfUrl' }, { name: 'imageUrl' }]), addBooks);
bookRoutes.put("/books/ubah/:id", upload.fields([{ name: 'pdfUrl' }, { name: 'imageUrl' }]), updateBook);

bookRoutes.delete("/books/hapus/:id", deleteBook);
bookRoutes.get("/books/search", searchBook);
bookRoutes.get("/books/view/:id", downloadFile); 
bookRoutes.get("/books/image/:id", downloadImage);

// Kategori routes
bookRoutes.get("/categories", getAllCategories);
bookRoutes.post("/categories/tambah", addCategory);
bookRoutes.get("/categories/search", searchCategories);
bookRoutes.put("/categories/ubah/:id", updateCategories); // Add this route for updating category
bookRoutes.delete("/categories/hapus/:id", deleteCategories);

bookRoutes.use("/", reqError);

module.exports = bookRoutes;