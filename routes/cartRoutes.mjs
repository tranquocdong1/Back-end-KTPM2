import express from 'express';
import Cart from '../models/cart.mjs'; 
import Product from '../models/product.mjs'; 

const router = express.Router();

// Middleware để kiểm tra xác thực người dùng cho tất cả các route
const checkAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.session.userId;
  if (!userId) {
    if (req.headers['content-type'] === 'application/json' || req.headers['x-requested-with'] === 'XMLHttpRequest') {
      return res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
    }
    return res.status(401).send('Vui lòng đăng nhập để tiếp tục');
  }
  req.userId = userId; // Lưu userId vào req để sử dụng trong các handler
  next();
};

// Route hiển thị trang web
router.get('/cart', checkAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    let subtotal = 0;
    if (cart && cart.items) {
      cart.items = cart.items.filter(item => item.productId);
      cart.items.forEach(item => {
        if (item.productId && item.productId.price) {
          subtotal += item.productId.price * item.quantity;
        }
      });
    }

    res.render('cart', { cart: cart || { items: [] }, subtotal: subtotal.toFixed(2) });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi khi tải giỏ hàng');
  }
});

// API cho mobile
router.get('/api/cart', checkAuth, async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('X-User-Id:', req.headers['x-user-id']);
  console.log('UserId:', req.userId);
  
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');

    let subtotal = 0;
    let items = [];

    if (cart && cart.items) {
      items = cart.items
        .filter(item => item.productId)
        .map(item => {
          if (item.productId && item.productId.price) {
            const itemSubtotal = item.productId.price * item.quantity;
            subtotal += itemSubtotal;

            return {
              productId: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              quantity: item.quantity,
              image: item.productId.image,
              subtotal: itemSubtotal,
            };
          }
          return null;
        })
        .filter(item => item !== null);
    }

    res.json({
      items,
      subtotal: subtotal.toFixed(2),
      count: items.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi tải giỏ hàng' });
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add-to-cart', checkAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Thiếu productId hoặc quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      // Nếu user chưa có giỏ hàng, tạo mới
      cart = new Cart({
        userId: req.userId,
        items: [{ productId: product._id, quantity: parseInt(quantity) }],
      });
    } else {
      // Nếu đã có giỏ hàng, kiểm tra sản phẩm trong giỏ
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += parseInt(quantity);
      } else {
        cart.items.push({ productId: product._id, quantity: parseInt(quantity) });
      }
    }

    await cart.save();
    
    // Trả về định dạng phù hợp với loại client
    if (req.headers['content-type'] === 'application/json' || req.headers['accept'] === 'application/json') {
      return res.status(200).json({ 
        message: 'Sản phẩm đã được thêm vào giỏ hàng',
        success: true 
      });
    }
    return res.redirect('/cart');
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server', success: false });
  }
});

// Xóa sản phẩm khỏi giỏ hàng (web)
router.post('/remove-from-cart', checkAuth, async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      if (item.productId && item.productId.price) {
        subtotal += item.productId.price * item.quantity;
      }
    });

    if (req.headers['accept'] === 'application/json') {
      return res.json({ message: 'Sản phẩm đã được xóa', subtotal: subtotal.toFixed(2) });
    }
    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
  }
});

// API xóa sản phẩm khỏi giỏ hàng (mobile)
router.post('/api/remove-from-cart', checkAuth, async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId');

    let subtotal = 0;
    let items = [];

    if (cart && cart.items) {
      items = cart.items
        .filter(item => item.productId)
        .map(item => {
          if (item.productId && item.productId.price) {
            const itemSubtotal = item.productId.price * item.quantity;
            subtotal += itemSubtotal;

            return {
              _id: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              quantity: item.quantity,
              image: item.productId.image,
              subtotal: itemSubtotal,
            };
          }
          return null;
        })
        .filter(item => item !== null);
    }

    res.json({
      message: 'Sản phẩm đã được xóa',
      items,
      subtotal: subtotal.toFixed(2),
      count: items.length,
      success: true,
    });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({
      message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng',
      items: [],
      subtotal: '0.00',
      count: 0,
      success: false,
    });
  }
});

// Thêm API endpoint mới để lấy thông tin cart cho mobile
router.post('/api/add-to-cart', checkAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Thiếu productId hoặc quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        items: [{ productId: product._id, quantity: parseInt(quantity) }],
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += parseInt(quantity);
      } else {
        cart.items.push({ productId: product._id, quantity: parseInt(quantity) });
      }
    }

    await cart.save();
    
    // Lấy cart đã cập nhật với thông tin sản phẩm đầy đủ
    cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    
    let subtotal = 0;
    let items = [];

    if (cart && cart.items) {
      items = cart.items
        .filter(item => item.productId)
        .map(item => {
          if (item.productId && item.productId.price) {
            const itemSubtotal = item.productId.price * item.quantity;
            subtotal += itemSubtotal;

            return {
              productId: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              quantity: item.quantity,
              image: item.productId.image,
              subtotal: itemSubtotal,
            };
          }
          return null;
        })
        .filter(item => item !== null);
    }

    res.json({
      message: 'Sản phẩm đã được thêm vào giỏ hàng',
      items,
      subtotal: subtotal.toFixed(2),
      count: items.length,
      success: true,
    });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      success: false,
      items: [],
      subtotal: '0.00',
      count: 0 
    });
  }
});

export default router;