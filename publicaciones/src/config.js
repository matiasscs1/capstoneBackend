import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'publicaciones',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'webm'],
    resource_type: 'auto'
  }
});

export { cloudinary, storage };
export const TOKEN_SECRET = 'some secret key';
