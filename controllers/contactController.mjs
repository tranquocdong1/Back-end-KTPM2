import Message from '../models/message.mjs';

export const contactPage = (req, res) => {
    res.render('contact', { title: 'Contact Page' });
};

export const submitMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });

        const savedMessage = await newMessage.save();

        res.status(200).json({
            success: true,
            message: 'Message sent successfully!'
        });
    } catch (error) {
        console.error('Error details:', error);

        res.status(500).json({
            success: false,
            message: 'Error sending message. Please try again.',
            error: error.message
        });
    }
};
