// middlewares/subirFotos.js
import multer from 'multer';
import { storage } from '../config.js';

// Filtra los tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/webm'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);  // El archivo está permitido
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Tipo de archivo no permitido. Solo imágenes y videos.'));
  }
};

// Configuración de multer con almacenamiento y filtro de archivo
const upload = multer({ storage, fileFilter });

// Exportar upload como el default export
export default upload;
