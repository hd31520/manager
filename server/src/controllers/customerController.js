const Customer = require('../models/Customer')
const { paginate } = require('../utils/helpers')

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      company: req.body.companyId
    })

    res.status(201).json({
      success: true,
      customer
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10, search } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (companyId) query.company = companyId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const customers = await Customer.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Customer.countDocuments(query)

    res.json({
      success: true,
      count: customers.length,
      total,
      customers
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }

    res.json({
      success: true,
      customer
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }

    res.json({
      success: true,
      customer
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }

    customer.isActive = false
    await customer.save()

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

