import axios from 'axios';

const baseURL = 'https://api.sightengine.com/1.0/check.json';

const getParams = (imageUrl) => ({
  url: imageUrl,
  models: 'nudity,wad,offensive',
  api_user: process.env.SIGHTENGINE_USER,
  api_secret: process.env.SIGHTENGINE_SECRET,
});

// 🔍 Analiza imágenes
export const analizarContenidoImagen = async (imageUrl) => {
  try {
    const { data } = await axios.get(baseURL, { params: getParams(imageUrl) });

    const esInapropiada =
      data.nudity?.safe < 0.85 ||
      data.weapon > 0.5 ||
      data.alcohol > 0.5 ||
      data.drugs > 0.5;

    return { esInapropiada, detalles: data };
  } catch (err) {
    console.error('Error al analizar imagen con Sightengine:', err);
    return { esInapropiada: false, detalles: { error: err.message } };
  }
};

// 🔍 Analiza un frame de un video (pasale una imagen temporal)
export const analizarFrameDeVideo = async (frameUrl) => {
  return analizarContenidoImagen(frameUrl);
};
