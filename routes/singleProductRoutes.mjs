import express from 'express';
import {getSingleProductPage} from '../controllers/singleProductController.mjs';

const router = express.Router();

router.get('/single_product', getSingleProductPage);

export default router;
