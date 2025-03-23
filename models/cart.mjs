// cart.mjs
import mongoose from 'mongoose';
import { productDBConnection } from '../config/connectDB.mjs';
import Product from '../models/product.mjs';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu tới model User
    required: true,
    unique: true, // Đảm bảo mỗi user chỉ có một giỏ hàng
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
});

const Cart = productDBConnection.model('Cart', cartSchema);

export default Cart;