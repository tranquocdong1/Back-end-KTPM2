import express from 'express';
import {contactPage, submitMessage} from '../controllers/contactController.mjs';

const router = express.Router();

// Route cho trang About
router.get('/contact', contactPage);
router.post('/contact/submit', submitMessage);

export default router;
