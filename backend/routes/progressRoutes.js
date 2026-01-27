import express from 'express';
import {
  getDashboard,
} from '../controllers/progressController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getDashboard);

export default router;
