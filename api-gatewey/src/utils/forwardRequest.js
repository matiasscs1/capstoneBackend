import fetch from 'node-fetch';

/**
 * Reenvía una solicitud simple con o sin cuerpo JSON.
 */
export async function forwardRequest({ req, res, method = 'GET', url, sendBody = false }) {
  try {
    const headers = {
      'Authorization': req.headers.authorization || '',
      'Content-Type': 'application/json'
    };

    const options = {
      method,
      headers
    };

    if (sendBody) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(`Error en forwardRequest [${method} ${url}]:`, err.message);
    res.status(500).json({ message: 'Error reenviando solicitud' });
  }
}
