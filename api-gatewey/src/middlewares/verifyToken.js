import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {


    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    return res.status(403).json({ message: 'Token inválido' });
  }
};

export default verifyToken;
