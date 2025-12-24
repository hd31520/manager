const { createPaymentIntent, createRazorpayOrder, verifyPayment } = require('../services/paymentService')
const Transaction = require('../models/Transaction')

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'bdt', metadata } = req.body

    const result = await createPaymentIntent(amount, currency, metadata)

    res.json({
      success: true,
      ...result
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay-order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body

    const order = await createRazorpayOrder(amount, currency, receipt)

    res.json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, paymentMethod = 'stripe' } = req.body

    const verified = await verifyPayment(paymentIntentId, paymentMethod)

    res.json({
      success: true,
      verified
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get transactions
// @route   GET /api/payments/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { companyId, type, page = 1, limit = 10 } = req.query
    const { skip, limit: limitNum } = require('../utils/helpers').paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (type) query.type = type

    const transactions = await Transaction.find(query)
      .populate('performedBy', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ date: -1 })

    const total = await Transaction.countDocuments(query)

    res.json({
      success: true,
      count: transactions.length,
      total,
      transactions
    })
  } catch (error) {
    next(error)
  }
}

