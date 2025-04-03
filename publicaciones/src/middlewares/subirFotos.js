import multer from 'multer';
import { storage } from '../config/config.js';
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/webm'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Enviamos el error a Express
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Tipo de archivo no permitido. Solo imágenes y videos.'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
