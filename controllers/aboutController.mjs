// aboutController.mjs
export const getAboutPage = (req, res) => {
    res.render('about', { title: 'About Page' });
};
