const Product = require('../models/Product')
const Inventory = require('../models/Inventory')
const { paginate } = require('../utils/helpers')

// @desc    Create product
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res, next) => {
  try {
    const { companyId, name, sku, barcode, description, category, price, inventory, supplier, batch } = req.body

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ company: companyId, sku })
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      })
    }

    const product = await Product.create({
      company: companyId,
      name,
      sku,
      barcode,
      description,
      category,
      price: {
        selling: price?.selling || 0,
        cost: price?.cost || 0,
        currency: 'BDT'
      },
      inventory: {
        quantity: inventory?.quantity || 0,
        minStock: inventory?.minStock || 0,
        maxStock: inventory?.maxStock,
        unit: inventory?.unit || 'pcs',
        location: inventory?.location
      },
      supplier,
      batch
    })

    // Create inventory record
    if (inventory?.quantity > 0) {
      await Inventory.create({
        company: companyId,
        product: product._id,
        type: 'in',
        quantity: inventory.quantity,
        previousQuantity: 0,
        newQuantity: inventory.quantity,
        reason: 'Initial stock',
        performedBy: req.user._id
      })
    }

    res.status(201).json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10, category, search, lowStock } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (category) query.category = category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ]
    }
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$inventory.quantity', '$inventory.minStock'] }
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      count: products.length,
      total,
      products
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get total stock value for a company
// @route   GET /api/products/stock-value
// @access  Private
exports.getProductsStockValue = async (req, res, next) => {
  try {
    const { companyId } = req.query

    const match = {}
    if (companyId) match.company = require('mongoose').Types.ObjectId(companyId)

    // Aggregate total = sum( inventory.quantity * price.cost )
    const result = await Product.aggregate([
      { $match: match },
      { $project: { qty: '$inventory.quantity', cost: '$price.cost' } },
      { $project: { value: { $multiply: [{ $ifNull: ['$qty', 0] }, { $ifNull: ['$cost', 0] }] } } },
      { $group: { _id: null, totalValue: { $sum: '$value' } } }
    ])

    const totalValue = result[0]?.totalValue || 0

    res.json({
      success: true,
      totalValue
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('company', 'name')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.json({
      success: true,
      product
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Soft delete
    product.isActive = false
    await product.save()

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update inventory
// @route   PUT /api/products/:id/inventory
// @access  Private
exports.updateInventory = async (req, res, next) => {
  try {
    const { type, quantity, reason, location } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    const previousQuantity = product.inventory.quantity
    let newQuantity = previousQuantity

    if (type === 'in') {
      newQuantity = previousQuantity + quantity
    } else if (type === 'out') {
      newQuantity = Math.max(0, previousQuantity - quantity)
    } else if (type === 'adjustment') {
      newQuantity = quantity
    }

    product.inventory.quantity = newQuantity
    await product.save()

    // Create inventory record
    await Inventory.create({
      company: product.company,
      product: product._id,
      type,
      quantity: Math.abs(newQuantity - previousQuantity),
      previousQuantity,
      newQuantity,
      reason,
      location: location ? { to: location } : undefined,
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

