import {Router} from 'express'

import { register, login, logout, profile } from '../controller/auth.controller.js'
import { authRequired } from '../middlewares/validateToken.js';
import {validateSchema} from '../middlewares/validateSchema.js';
import {loginSchemaZod, registroUsuarioSchemaZod} from '../schemas/auth.shema.js';

const router = Router()


router.post('/api/register', validateSchema(registroUsuarioSchemaZod),  register);
router.post('/api/login', validateSchema(loginSchemaZod),login);
router.post('/api/logout', logout);
router.get('/api/profile', authRequired , profile);

export default router;

