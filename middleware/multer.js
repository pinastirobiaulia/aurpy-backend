const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const crypto = require('crypto');

// URI MongoDB
//const mongoURI = process.env.MONGODB_ATLAS;
const mongoURI = 'mongodb+srv://pinastiaul:vmjHXEGrffgQbqgH@aurpy.pzccrez.mongodb.net/?retryWrites=true&w=majority&appName=aurpy';

// Buat storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads' // Nama koleksi di MongoDB
                };
                //console.log('File Info:', fileInfo);
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Batas ukuran file 50MB dalam bytes
});

module.exports = upload;