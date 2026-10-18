import multer from 'multer';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Single `image` field, memory storage, images only, max 5 MB. */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
    fileFilter: (req, file, cb) => {
        if (/^image\/(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(file.mimetype)) return cb(null, true);
        const err = new Error('Only image files are allowed (jpg, png, webp)');
        err.code = 'INVALID_FILE_TYPE';
        cb(err);
    },
});

export default upload;
