import express from 'express';
import { checkOutPage } from '../controllers/checkOutController.mjs';

const router = express.Router();

// Route for checkout page
router.get('/checkout', checkOutPage);

export default router;