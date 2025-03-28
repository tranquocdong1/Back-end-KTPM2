import Checkout from "../models/checkout.mjs";
import Cart from "../models/cart.mjs";

// Show the checkout page
export const checkOutPage = async (req, res) => {
  try {
    // Lấy userId từ session hoặc header (tùy cách xác thực của bạn)
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

    // Lấy thông tin giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    let subtotal = 0;
    let cartItems = [];
    if (cart && cart.items) {
      cartItems = cart.items
        .filter(item => item.productId) // Lọc bỏ các item không hợp lệ
        .map(item => {
          const itemSubtotal = item.productId.price * item.quantity;
          subtotal += itemSubtotal;
          return {
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            image: item.productId.image,
            subtotal: itemSubtotal.toFixed(2),
          };
        });
    }

    // Thêm phí vận chuyển và tính tổng
    const deliveryFee = 10.99; // Phí vận chuyển cố định
    const discount = 0.00; // Giảm giá (nếu có)
    const total = subtotal + deliveryFee - discount;

    // Render trang checkout với dữ liệu giỏ hàng
    res.render('checkout', {
      cartItems,
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải trang checkout');
  }
};