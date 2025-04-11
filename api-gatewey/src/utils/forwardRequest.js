import fetch from 'node-fetch';

export async function forwardRequest({ req, res, method = 'GET', url, sendBody = false }) {
  try {
    const contentType = req.headers['content-type'] || '';

    // Reusar headers originales, sin 'host'
    const headers = { ...req.headers };
    delete headers['host'];

    // Añadir token si viene en Authorization o cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
      credentials: 'include',
    };

    if (sendBody) {
      if (contentType.includes('application/json')) {
        // JSON: enviar el body como string
        options.body = JSON.stringify(req.body);
        headers['Content-Type'] = 'application/json'; // Asegurarse que esté bien
      } else {
        // Otro (ej. multipart/form-data): reenviar el stream tal cual
        options.body = req;
      }
    }

    const response = await fetch(url, options);

    // Reenviar cookies si llegan
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.setHeader('Set-Cookie', setCookie);
    }

    // Manejo de respuesta según content-type
    const respType = response.headers.get('content-type') || '';
    const isJson = respType.includes('application/json');

    const responseData = isJson ? await response.json() : await response.text();
    res.status(response.status).send(responseData);
  } catch (err) {
    console.error(`Error en forwardRequest [${method} ${url}]:`, err.message);
    res.status(500).json({ message: 'Error reenviando solicitud' });
  }
}
