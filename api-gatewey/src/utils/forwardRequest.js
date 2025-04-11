import fetch from 'node-fetch';

/**
 * Reenvía una solicitud simple con o sin cuerpo JSON, asegurándose de manejar las cookies y encabezados.
 */
export async function forwardRequest({ req, res, method = 'GET', url, sendBody = false }) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Obtener token desde encabezado Authorization
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;

    } else {
      console.log('No se encontró token para reenviar al microservicio.');
    }

    const options = {
      method,
      headers,
      credentials: 'include',
    };

    if (sendBody) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);

    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(`Error en forwardRequest [${method} ${url}]:`, err.message);
    res.status(500).json({ message: 'Error reenviando solicitud' });
  }
}
