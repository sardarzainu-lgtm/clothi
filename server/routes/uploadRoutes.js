const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    // Allow all common image formats
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff|tif|heic|heif)$/i;
    const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp|svg\+xml|svg|bmp|ico|tiff|tif|heic|heif)$/i;
    
    const extname = allowedExtensions.test(path.extname(file.originalname));
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only! Please upload a valid image file (jpg, jpeg, png, gif, webp, svg, bmp, ico, tiff, heic, etc.)');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.single('image'), (req, res) => {
    res.send(`http://localhost:5000/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;
