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

