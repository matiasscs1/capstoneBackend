import {Router} from 'express'

import { register, login, logout } from '../controller/auth.controller.js'

const router = Router()


router.post('/api/register', register);
router.post('/api/login', login);
router.post('/api/logout', logout);

export default router;

