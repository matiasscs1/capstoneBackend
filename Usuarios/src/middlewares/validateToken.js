import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
  // 1. Intentar primero desde Authorization header
  let token = req.headers.authorization?.split(' ')[1];

  // 2. Si no hay header, buscar en cookies
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Autorización denegada: token faltante.' });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });

    // Verificar que el rol del usuario sea 'estudiante' o 'profesor'
    if (!['estudiante', 'profesor'].includes(decoded.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
    }

    req.user = decoded; // Agregar la información del usuario decodificada al request
    req.token = token;   // Opcional: Guardar el token si es necesario en el flujo
    next();
  });
};
