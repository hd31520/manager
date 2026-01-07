const express = require('express')
const router = express.Router()
const {
  createPaymentIntent,
  createRazorpayOrder,
  verifyPayment,
  getTransactions
} = require('../controllers/paymentController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/create-intent', createPaymentIntent)
router.post('/razorpay-order', createRazorpayOrder)
router.post('/verify', verifyPayment)
router.get('/transactions', getTransactions)

module.exports = router

