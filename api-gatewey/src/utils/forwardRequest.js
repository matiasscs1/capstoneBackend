import fetch from 'node-fetch';

/**
 * Reenvía una solicitud simple con o sin cuerpo JSON, asegurándose de manejar las cookies.
 */
export async function forwardRequest({ req, res, method = 'GET', url, sendBody = false }) {
  try {
    const headers = {
      'Authorization': req.headers.authorization || '',
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
      credentials: 'include', // Asegura que las cookies se incluyan en la solicitud
    };

    if (sendBody) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);

    // Reenviar cookies de la respuesta del microservicio
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      res.setHeader('Set-Cookie', cookies); // Reenvía la cookie al cliente
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(`Error en forwardRequest [${method} ${url}]:`, err.message);
    res.status(500).json({ message: 'Error reenviando solicitud' });
  }
}
