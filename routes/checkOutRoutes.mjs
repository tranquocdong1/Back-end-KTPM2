import express from 'express';
import { checkOutPage } from '../controllers/checkOutController.mjs';
import Checkout from '../models/checkout.mjs';
import Cart from '../models/cart.mjs';

const router = express.Router();

// Route for checkout page
router.get('/checkout', checkOutPage);

// Route xử lý đặt hàng
router.post('/place-order', async (req, res) => {
    try {
        const userId = req.session.userId || req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
        }

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        const products = cart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
        }));

        const totalPrice = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0) + 10.99;

        const newOrder = new Checkout({
            userId,
            products,
            totalPrice,
            status: 'Pending',
            createdAt: new Date(),
        });

        await newOrder.save();

        // Xóa giỏ hàng
        await Cart.findOneAndDelete({ userId });

        res.json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error);
        res.status(500).json({ message: 'Lỗi khi đặt đơn hàng' });
    }
});

// Route hiển thị lịch sử đơn hàng
router.get('/order-history', async (req, res) => {
    try {
        const userId = req.session.userId || req.headers['x-user-id'];
        if (!userId) {
            return res.status(401).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Unauthorized</title>
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .btn { padding: 10px 20px; background-color: #d8a7b1; color: white; text-decoration: none; border-radius: 5px; }
                    .btn:hover { background-color: #b98b94; }
                  </style>
                </head>
                <body>
                  <h1>Vui lòng đăng nhập để tiếp tục</h1>
                  <p>Bạn cần đăng nhập để truy cập trang này.</p>
                  <a href="/login" class="btn">Đăng nhập</a>
                </body>
                </html>
              `);
        }

        const orders = await Checkout.find({ userId })
            .populate('products.productId')
            .sort({ createdAt: -1 });
        res.render('order-history', { orders });
    } catch (error) {
        console.error('Lỗi khi tải lịch sử đơn hàng:', error);
        res.status(500).send('Lỗi khi tải lịch sử đơn hàng');
    }
});

export default router;