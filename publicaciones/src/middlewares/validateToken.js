import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config/config.js';

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

    req.user = decoded;
    req.token = token;
    next();
  });
};
