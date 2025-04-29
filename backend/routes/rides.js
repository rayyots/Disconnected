import express from 'express';
import { completeRide, getRideHistory } from '../controllers/rides.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.post('/complete', completeRide);
router.get('/history', getRideHistory);

export default router;