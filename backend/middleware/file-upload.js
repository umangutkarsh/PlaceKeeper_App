const multer = require('multer');
const { v1 : uuidv1 } = require('uuid');

const MIME_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg'
};

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv1() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : Error('Mime-Type is invalid');
        cb(error, isValid);
    }
});

module.exports = fileUpload;