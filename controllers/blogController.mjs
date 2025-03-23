import Blog from '../models/blog.mjs';

const getBlogPage = async (req, res) => {
    try {
        const blogs = await Blog.find();

        const dates = [...new Set(blogs.map((blog) => blog.date ? blog.date.toDateString() : 'Unknown'))];

        res.render('blog', {
            dates,
            blogs,
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getBlogDetail = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        res.render('blog-detail', { blog });
    } catch (error) {
        console.error('Error fetching blog detail:', error);
        res.status(500).send('Internal Server Error');
    }
};

export {getBlogPage, getBlogDetail  };
