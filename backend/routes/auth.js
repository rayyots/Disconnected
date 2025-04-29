import express from 'express';
import { verifyPhone, login } from '../controllers/auth.js';

const router = express.Router();

router.post('/verify', verifyPhone);
router.post('/login', login);

export default router;