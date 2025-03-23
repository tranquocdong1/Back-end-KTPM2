import Checkout from "../models/checkout.mjs";

// Show the checkout page
export const checkOutPage = (req, res) => {
  res.render('checkout');  // Render the checkout page
};

// // Get checkout details by ID
// export const getCheckoutDetail = async (req, res) => {
//   try {
//     const checkout = await Checkout.findById(req.params.id);
//     if (!checkout) {
//       return res.status(404).send('Checkout not found');
//     }
//     res.render('checkout-detail', { checkout });  // Render checkout details page
//   } catch (error) {        
//     res.status(500).send('Error fetching checkout details');
//   }
// };

// // Create a new checkout order
// export const createCheckout = async (req, res) => {
//   try {
//     const { firstname, lastname, phone, email } = req.body;
//     const newCheckout = new Checkout({ firstname, lastname, phone, email });
//     await newCheckout.save();
//     res.status(201).json({ message: 'Checkout order created successfully!' });
//   } catch (error) {
//     res.status(500).send('Error creating checkout order');
//   }
// };

// // Update payment status
// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const { paymentStatus } = req.body;
//     const checkout = await Checkout.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true });
//     if (!checkout) {
//       return res.status(404).send('Checkout order not found');
//     }
//     res.status(200).json({ message: 'Payment status updated successfully!' });
//   } catch (error) {
//     res.status(500).send('Error updating payment status');
//   }
// };
