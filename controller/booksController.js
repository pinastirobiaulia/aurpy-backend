const mongoose = require('mongoose');
const Book = require("../models/books");
const Category = require("../models/category");
const upload = require("../middleware/multer");
const { GridFSBucket } = require('mongodb');
const path = require('path');
const { Readable } = require('stream');
const poppler = require('pdf-poppler');
const fs = require('fs');

//tambahan
// Setup MongoDB connection and GridFSBucket
let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('category');;  // Error di sini menunjukkan bahwa `Book` undefined
    res.status(200).json({ books });
  } catch (err) {
    console.error(err); // Tambahkan logging error
    res.status(404).json({ message: err.message });
  }
};

// Search books
const searchBook = async (req, res) => {
  try {
    if (!req.query.namaBuku) {
      return res.status(400).json({ message: "Wrong Query", status: 400 });
    }
    const result = await Book.find({
      namaBuku: { $regex: req.query.namaBuku, $options: "i" },
    }).populate('category');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id }).populate('category');;
    if (!book) {
      throw new Error("id not found");
    }
    res.status(200).json({ book, message: "buku ditemukan" });
  } catch (err) {
    console.error(err); // Tambahkan logging error
    res.status(404).json({ message: "id not found" });
  }
};

//coba
const addBooks = async (req, res) => {
  const { namaBuku, penerbit, pengarang, tahunTerbit, tempatTerbit, isbn, jmlhhlmn, abstrak, category } = req.body;
  const pdfUrl = req.files['pdfUrl'] ? req.files['pdfUrl'][0].id : null;
  const outputDir = path.join(__dirname, '../temp');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    if (!pdfUrl) {
      throw new Error("PDF file is required");
    }

    const duplikat = await Book.findOne({ namaBuku });
    if (duplikat) {
      throw new Error("Book name already exists");
    }

    const pdfFilePath = path.join(outputDir, `${pdfUrl}.pdf`);
    const downloadStream = gfsBucket.openDownloadStream(mongoose.Types.ObjectId(pdfUrl));
    const writeStream = fs.createWriteStream(pdfFilePath);

    downloadStream.pipe(writeStream)
      .on('error', (err) => {
        console.error('Error writing PDF file:', err);
        throw err;
      })
      .on('finish', async () => {
        const jpgFiles = await convertPdfToJpg(pdfFilePath, outputDir);
        const imageUrls = [];

        for (const jpgFile of jpgFiles) {
          const imageId = await storeImageToGridFS(jpgFile, gfsBucket);
          imageUrls.push(imageId);
        }

        const newBook = new Book({
          namaBuku,
          penerbit,
          pengarang,
          tahunTerbit,
          tempatTerbit,
          isbn,
          jmlhhlmn,
          abstrak,
          pdfUrl,
          imageUrls,
          category,
        });

        const addBook = await newBook.save();
        res.status(201).json({ addBook, message: "Book added successfully" });

        // Clean up temporary files
        fs.unlinkSync(pdfFilePath);
        jpgFiles.forEach(file => fs.unlinkSync(file));
      });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


// Update book
const updateBook = async (req, res) => {
  const { namaBuku, penerbit, pengarang, tahunTerbit, tempatTerbit, isbn, jmlhhlmn, abstrak, category } = req.body;
  const pdfUrl = req.file ? req.file.id : null;
  const imageUrl = req.file ? req.file.id : null;

  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      throw new Error("id not found");
    }

    const duplikat = await Book.findOne({ namaBuku });
    if (book.namaBuku !== namaBuku && duplikat) {
      throw new Error("nama buku sudah ada");
    }

    const updateData = {
      namaBuku,
      penerbit,
      pengarang,
      tahunTerbit,
      tempatTerbit,
      isbn,
      jmlhhlmn,
      abstrak,
      category,
    };

    if (pdfUrl) {
      updateData.pdfUrl = pdfUrl;
    }

    const bookUpdated = await Book.updateOne({ _id: req.params.id }, { $set: updateData });
    res.status(200).json({ bookUpdated, message: "Data Buku Berhasil Di Ubah" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const delBook = await Book.deleteOne({ _id: req.params.id });
    res.status(200).json(delBook);
  } catch (err) {
    console.error(err); // Tambahkan logging error
    res.status(404).json({ message: "id not found" });
  }
};

// Handle bad requests
const reqError = (req, res) => {
  res.status(400).json({ status: 400, message: "cannot request with this end point" });
};

//baru
const downloadFile = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    const pdfId = book.pdfUrl;
    gfsBucket.find({ _id: mongoose.Types.ObjectId(pdfId) }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "File tidak ditemukan" });
      }

      const file = files[0];

      if (file.contentType === 'application/pdf') {
        const downloadStream = gfsBucket.openDownloadStream(mongoose.Types.ObjectId(pdfId));
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + file.filename + '"');
        downloadStream.pipe(res);
      } else {
        res.status(400).json({ message: "Bukan file PDF" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kesalahan server" });
  }
};


// Get image by book ID
const downloadImage = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const imageId = book.imageUrl;
    gfsBucket.find({ _id: mongoose.Types.ObjectId(imageId) }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "File not found" });
      }

      const file = files[0];

      const downloadStream = gfsBucket.openDownloadStream(mongoose.Types.ObjectId(imageId));
      res.setHeader('Content-Type', file.contentType);
      downloadStream.pipe(res);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//pdf to jps
//Fungsi untuk mengkonversi PDF ke JPG bisa
const convertPdfToJpg = async (pdfPath, outputDir) => {
  const options = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: null // null means all pages
  };

  try {
    await poppler.convert(pdfPath, options);
    console.log('PDF berhasil dikonversi ke JPG');
    return `${outputDir}/${options.out_prefix}-1.jpg`; // Contoh untuk halaman pertama
  } catch (error) {
    console.error('Error mengkonversi PDF ke JPG:', error);
    throw error;
  }
};


// Middleware untuk menampilkan PDF sebagai JPG bisa
const displayPdfAsJpg = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }
    const pdfId = book.pdfUrl;

    // Temukan file PDF dari GridFS
    gfsBucket.find({ _id: mongoose.Types.ObjectId(pdfId) }).toArray(async (err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({ message: "File tidak ditemukan" });
      }

      const file = files[0];
      const tempPdfPath = path.join(__dirname, '../temp', `${file.filename}.pdf`); // Pastikan file memiliki ekstensi .pdf
      const outputDir = path.join(__dirname, '../temp');

      // Buat direktori temp jika belum ada
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log(`Saving PDF to ${tempPdfPath}`);

      // Stream untuk menulis file PDF sementara
      const writeStream = fs.createWriteStream(tempPdfPath);
      const downloadStream = gfsBucket.openDownloadStream(mongoose.Types.ObjectId(pdfId));

      // Tambahkan event handler untuk menangani kesalahan dan penyelesaian stream
      writeStream.on('error', (err) => {
        console.error("Error writing PDF file:", err);
        res.status(500).json({ message: "Error writing PDF file" });
      });

      writeStream.on('finish', async () => {
        console.log(`PDF saved to ${tempPdfPath}`);

        try {
          // Konversi PDF ke JPG untuk semua halaman
          const jpgFilePath = await convertPdfToJpg(tempPdfPath, outputDir);

          console.log(`Looking for JPG at ${jpgFilePath}`);

          // Baca file JPG yang dihasilkan
          fs.readFile(jpgFilePath, (err, data) => {
            if (err) {
              console.error("Error reading JPG file:", err);
              return res.status(500).json({ message: "Error membaca file JPG" });
            }

            console.log("JPG file found and read successfully");

            res.setHeader('Content-Type', 'image/jpeg');
            res.send(data);

            // Hapus file sementara setelah selesai mengirimkan response
            fs.unlink(tempPdfPath, (err) => {
              if (err) console.error('Error menghapus file sementara PDF:', err);
            });
            fs.unlink(jpgFilePath, (err) => {
              if (err) console.error('Error menghapus file sementara JPG:', err);
            });
          });
        } catch (conversionError) {
          console.error("Error converting PDF to JPG:", conversionError);
          return res.status(500).json({ message: "Error converting PDF to JPG" });
        }
      });

      // Pipe download stream ke write stream
      downloadStream.pipe(writeStream);
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Kesalahan server" });
  }
};


module.exports = {
  getAllBooks,
  addBooks,
  getBookById,
  updateBook,
  deleteBook,
  reqError,
  searchBook,
  downloadFile,
  downloadImage,
  displayPdfAsJpg // tambahkan endpoint baru
};
