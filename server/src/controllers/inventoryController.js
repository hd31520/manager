const Inventory = require('../models/Inventory')
const Product = require('../models/Product')
const { paginate } = require('../utils/helpers')

// @desc    Get inventory history
// @route   GET /api/inventory
// @access  Private
exports.getInventoryHistory = async (req, res, next) => {
  try {
    const { companyId, productId, type, page = 1, limit = 10 } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (productId) query.product = productId
    if (type) query.type = type

    const inventory = await Inventory.find(query)
      .populate('product', 'name sku')
      .populate('performedBy', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Inventory.countDocuments(query)

    res.json({
      success: true,
      count: inventory.length,
      total,
      inventory
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get stock alerts
// @route   GET /api/inventory/alerts
// @access  Private
exports.getStockAlerts = async (req, res, next) => {
  try {
    const { companyId } = req.query

    const products = await Product.find({
      company: companyId,
      isActive: true
    })

    const lowStock = products.filter(p => 
      p.inventory.quantity <= p.inventory.minStock && p.inventory.quantity > 0
    )

    const outOfStock = products.filter(p => 
      p.inventory.quantity === 0
    )

    res.json({
      success: true,
      alerts: {
        lowStock: lowStock.length,
        outOfStock: outOfStock.length,
        products: {
          lowStock,
          outOfStock
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Transfer stock
// @route   POST /api/inventory/transfer
// @access  Private
exports.transferStock = async (req, res, next) => {
  try {
    const { companyId, productId, quantity, fromLocation, toLocation, reason } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    if (product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      })
    }

    const previousQuantity = product.inventory.quantity
    product.inventory.quantity -= quantity
    product.inventory.location = toLocation
    await product.save()

    await Inventory.create({
      company: companyId,
      product: productId,
      type: 'transfer',
      quantity,
      previousQuantity,
      newQuantity: product.inventory.quantity,
      reason,
      location: { from: fromLocation, to: toLocation },
      performedBy: req.user._id
    })

    res.json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

