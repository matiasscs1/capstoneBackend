import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { cloudinary } from '../config.js';
import { analizarContenidoImagen } from './sightengineService.js';

export const analizarFrameDeVideo = async (videoUrl) => {
  const tempDir = path.resolve('temp');
  const tempVideoPath = path.join(tempDir, 'video_temp.mp4');
  const tempFramePath = path.join(tempDir, 'frame_temp.jpg');

  // 🔽 Descargamos el video
  const writer = fs.createWriteStream(tempVideoPath);
  const response = await axios.get(videoUrl, { responseType: 'stream' });
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  // 🎬 Extraemos un frame (segundo 3)
  await new Promise((resolve, reject) => {
    ffmpeg(tempVideoPath)
      .screenshots({
        timestamps: ['3'],
        filename: 'frame_temp.jpg',
        folder: tempDir,
        size: '640x?'
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // ☁️ Subimos el frame a Cloudinary
  const result = await cloudinary.uploader.upload(tempFramePath, {
    folder: 'temp-frames',
    resource_type: 'image'
  });

  const frameUrl = result.secure_url;

// 🔎 Analizamos con Sightengine (vía URL)
const { esInapropiada, detalles } = await analizarContenidoImagen(frameUrl);

// 🧹 Eliminamos de Cloudinary si es inapropiado
if (esInapropiada) {
  const publicId = result.public_id;
  await cloudinary.uploader.destroy(publicId);
}

  return { esInapropiada, detalles };
};
