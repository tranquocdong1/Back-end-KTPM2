import express from 'express';
import {getAboutPage} from '../controllers/aboutController.mjs';

const router = express.Router();

// Route cho trang About
router.get('/about', getAboutPage);

export default router;
