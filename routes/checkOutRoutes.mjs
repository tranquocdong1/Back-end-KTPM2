import express from 'express';
// import { checkOutPage, getCheckoutDetail, createCheckout, updatePaymentStatus } from '../controllers/checkOutController.mjs';
import { checkOutPage } from '../controllers/checkOutController.mjs';


const router = express.Router();

// Route for checkout page
router.get('/checkout', checkOutPage);

// // Route to get checkout details by ID
// router.get('/:id', getCheckoutDetail);

// // Route to create a new checkout order
// router.post('/create', createCheckout);

// // Route to update payment status of checkout order
// router.put('/:id', updatePaymentStatus);

// Route to delete checkout order
router.delete('/:id', async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);
    if (!checkout) {
      return res.status(404).send('Checkout order not found');
    }
    res.send('Checkout order deleted');
  } catch (error) {
    res.status(500).send('Error deleting checkout order');
  }
});

export default router;
