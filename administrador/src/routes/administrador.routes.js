import { Router } from 'express';
const router = Router();

router.get('/admin/ping', (req, res) => {
  res.json({ message: 'Microservicio de administrador funcionando 🎯' });
});

export default router;
