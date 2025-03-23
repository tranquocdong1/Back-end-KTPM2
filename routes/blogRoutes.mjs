import express from 'express';
import { getBlogPage, getBlogDetail } from '../controllers/blogController.mjs';
import Blog from '../models/blog.mjs';

const router = express.Router();

// Existing routes
router.get('/blog', getBlogPage);
router.get('/blog/:id', getBlogDetail);

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.render('index', { blogs });
    } catch (error) {
        res.status(500).send('Error fetching blogs');
    }
});

router.post('/add', async (req, res) => {
    try {
        const { title, description, image, date, content } = req.body;
        const blog = new Blog({ title, description, image, date, content });
        await blog.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error adding blog:', error);
        res.status(500).send('Error adding blog');
    }
});

// New API routes for mobile app
// Get all blogs as JSON
router.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 }); // Sort by date descending
        res.json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs for API:', error);
        res.status(500).json({ error: 'Error fetching blogs' });
    }
});

// Get single blog by ID as JSON
router.get('/api/blog/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ blog });
    } catch (error) {
        console.error('Error fetching blog detail for API:', error);
        res.status(500).json({ error: 'Error fetching blog detail' });
    }
});

export default router;