import express from 'express';
import { 
  getUserData,
  updateDataPreference,
  getSavedAddresses,
  saveAddress,
  deleteAddress
} from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/data', getUserData);
router.post('/data-preference', updateDataPreference);
router.get('/addresses', getSavedAddresses);
router.post('/addresses', saveAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;