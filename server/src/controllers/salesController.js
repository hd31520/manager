const Order = require('../models/Order')
const Memo = require('../models/Memo')
const Product = require('../models/Product')
const Inventory = require('../models/Inventory')
const Customer = require('../models/Customer')
const Transaction = require('../models/Transaction')
const { paginate } = require('../utils/helpers')

// @desc    Create order
// @route   POST /api/sales/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { companyId, customer, items, payment, delivery, notes } = req.body

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        })
      }

      // Check inventory
      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.inventory.quantity}`
        })
      }

      const itemTotal = (item.unitPrice * item.quantity) - (item.discount || 0)
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        total: itemTotal
      })
    }

    const discount = req.body.discount || { type: 'fixed', value: 0, amount: 0 }
    const tax = req.body.tax || { rate: 0, amount: 0 }
    const shipping = req.body.shipping || 0

    const total = subtotal - discount.amount + tax.amount + shipping

    // Create order
    const order = await Order.create({
      company: companyId,
      customer,
      items: orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      payment: {
        method: payment.method,
        status: payment.method === 'due' ? 'pending' : 'paid',
        paidAmount: payment.method === 'due' ? 0 : total,
        dueAmount: payment.method === 'due' ? total : 0
      },
      orderType: req.body.orderType || 'offline',
      delivery,
      notes,
      createdBy: req.user._id
    })

    // Update inventory
    for (const item of items) {
      const product = await Product.findById(item.product)
      product.inventory.quantity -= item.quantity
      await product.save()

      await Inventory.create({
        company: companyId,
        product: product._id,
        type: 'out',
        quantity: item.quantity,
        previousQuantity: product.inventory.quantity + item.quantity,
        newQuantity: product.inventory.quantity,
        reason: 'Order sale',
        referenceId: order._id,
        performedBy: req.user._id
      })
    }

    // Update customer
    if (customer) {
      const customerDoc = await Customer.findById(customer)
      if (customerDoc) {
        customerDoc.totalPurchases += total
        customerDoc.lastPurchaseDate = new Date()
        if (payment.method === 'due') {
          customerDoc.dueAmount += total
        }
        await customerDoc.save()
      }
    }

    // Create transaction
    if (payment.method !== 'due') {
      await Transaction.create({
        company: companyId,
        type: 'income',
        amount: total,
        description: `Order ${order.orderNumber}`,
        reference: 'order',
        referenceId: order._id,
        paymentMethod: payment.method,
        performedBy: req.user._id
      })
    }

    res.status(201).json({
      success: true,
      order: await Order.findById(order._id).populate('customer', 'name phone')
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create memo
// @route   POST /api/sales/memos
// @access  Private
exports.createMemo = async (req, res, next) => {
  try {
    const { companyId, customer, customerName, customerPhone, items, discount, tax, paymentMethod, notes } = req.body

    let subtotal = 0
    const memoItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        })
      }

      const itemTotal = item.unitPrice * item.quantity
      subtotal += itemTotal

      memoItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal
      })
    }

    const total = subtotal - (discount || 0) + (tax || 0)
    const paidAmount = paymentMethod === 'due' ? 0 : total
    const dueAmount = paymentMethod === 'due' ? total : 0

    const memo = await Memo.create({
      company: companyId,
      customer,
      customerName,
      customerPhone,
      items: memoItems,
      subtotal,
      discount: discount || 0,
      tax: tax || 0,
      total,
      paidAmount,
      dueAmount,
      paymentMethod,
      status: paymentMethod === 'due' ? 'pending' : 'paid',
      notes,
      createdBy: req.user._id
    })

    // Update inventory
    for (const item of items) {
      const product = await Product.findById(item.product)
      product.inventory.quantity -= item.quantity
      await product.save()

      await Inventory.create({
        company: companyId,
        product: product._id,
        type: 'out',
        quantity: item.quantity,
        previousQuantity: product.inventory.quantity + item.quantity,
        newQuantity: product.inventory.quantity,
        reason: 'Memo sale',
        referenceId: memo._id,
        performedBy: req.user._id
      })
    }

    res.status(201).json({
      success: true,
      memo
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get orders
// @route   GET /api/sales/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10, status, customer } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (status) query.status = status
    if (customer) query.customer = customer

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .populate('createdBy', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      count: orders.length,
      total,
      orders
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get sales stats
// @route   GET /api/sales/stats
// @access  Private
exports.getSalesStats = async (req, res, next) => {
  try {
    const { companyId } = req.query
    const mongoose = require('mongoose')

    // Validate companyId if provided
    if (companyId && !mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid companyId' })
    }

    const match = {}
    if (companyId) {
      // FIXED: Create ObjectId properly with 'new' keyword
      try {
        match.company = new mongoose.Types.ObjectId(companyId)
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid companyId format' })
      }
    }

    // Total sales and orders
    let totals = []
    try {
      totals = await Order.aggregate([
        { $match: match },
        { $group: { _id: null, totalSales: { $sum: '$total' }, totalOrders: { $sum: 1 }, avgOrder: { $avg: '$total' } } }
      ])
    } catch (err) {
      console.error('getSalesStats: totals aggregation failed', { err: err.message, query: req.query })
      throw err
    }

    // Active customers (distinct customers with orders)
    let activeCustomersAgg = []
    try {
      activeCustomersAgg = await Order.aggregate([
        { $match: match },
        { $group: { _id: '$customer' } },
        { $count: 'activeCustomers' }
      ])
    } catch (err) {
      console.error('getSalesStats: activeCustomers aggregation failed', { err: err.message, query: req.query })
      throw err
    }

    const totalSales = totals[0]?.totalSales || 0
    const totalOrders = totals[0]?.totalOrders || 0
    const avgOrder = totals[0]?.avgOrder || 0
    const activeCustomers = activeCustomersAgg[0]?.activeCustomers || 0

    // Monthly series (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0,0,0,0)

    let monthly = []
    try {
      monthly = await Order.aggregate([
        { $match: { ...match, createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$total' }, orders: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    } catch (err) {
      console.error('getSalesStats: monthly aggregation failed', { err: err.message, query: req.query })
      throw err
    }

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders,
        activeCustomers,
        avgOrder,
        monthly
      }
    })
  } catch (error) {
    console.error('getSalesStats error:', error, 'query:', req.query)
    // Surface more helpful message to client in development
    const message = error?.message || 'Failed to compute sales stats'
    return res.status(500).json({ success: false, message, ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}) })
  }
}

// @desc    Get memos
// @route   GET /api/sales/memos
// @access  Private
exports.getMemos = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10, status } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (status) query.status = status

    const memos = await Memo.find(query)
      .populate('customer', 'name phone')
      .populate('createdBy', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Memo.countDocuments(query)

    res.json({
      success: true,
      count: memos.length,
      total,
      memos
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get one sample order for debugging
// @route   GET /api/sales/sample
// @access  Private
exports.getOrderSample = async (req, res, next) => {
  try {
    const { companyId } = req.query
    const mongoose = require('mongoose')

    if (!companyId) {
      return res.status(400).json({ success: false, message: 'companyId is required' })
    }
    if (!mongoose.isValidObjectId(companyId)) {
      return res.status(400).json({ success: false, message: 'Invalid companyId' })
    }

    const order = await Order.findOne({ company: companyId }).sort({ createdAt: -1 }).limit(1)
    if (!order) {
      return res.status(404).json({ success: false, message: 'No orders found for this company' })
    }

    res.json({ success: true, order })
  } catch (error) {
    console.error('getOrderSample error:', error, 'query:', req.query)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}

// @desc    Update order status
// @route   PUT /api/sales/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      order
    })
  } catch (error) {
    next(error)
  }
}