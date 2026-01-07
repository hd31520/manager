const Company = require('../models/Company')
const CompanyUser = require('../models/CompanyUser')
const Subscription = require('../models/Subscription')
const Worker = require('../models/Worker')
const { SUBSCRIPTION_PLANS } = require('../config/payments')
const { paginate } = require('../utils/helpers')

// @desc    Create company
// @route   POST /api/companies
// @access  Private
exports.createCompany = async (req, res, next) => {
  try {
    const { name, businessType, email, phone, address } = req.body

    // Create company
    const company = await Company.create({
      name,
      businessType,
      owner: req.user._id,
      email,
      phone,
      address
    })

    // Create subscription (default basic plan)
    const plan = SUBSCRIPTION_PLANS.basic
    const subscription = await Subscription.create({
      company: company._id,
      plan: 'basic',
      workerLimit: plan.workerLimit,
      monthlyFee: plan.monthlyFee,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    // Update company subscription
    company.subscription = {
      plan: 'basic',
      workerLimit: plan.workerLimit,
      monthlyFee: plan.monthlyFee,
      status: 'active',
      nextBillingDate: subscription.nextBillingDate
    }
    await company.save()

    // Create default roles for the company (owner, manager, worker)
    const Role = require('../models/Role')
    const defaultRoles = [
      {
        company: company._id,
        name: 'owner',
        description: 'Company owner with all permissions',
        isDefault: true
      },
      {
        company: company._id,
        name: 'manager',
        description: 'Manager with operational permissions',
        isDefault: false
      },
      {
        company: company._id,
        name: 'worker',
        description: 'Worker with limited access',
        isDefault: false
      }
    ]

    // Insert default roles if they don't already exist
    await Role.insertMany(defaultRoles).catch(() => {})

    // Find the owner role id for assignment
    const ownerRole = await Role.findOne({ company: company._id, name: 'owner' })

    // Add owner to company (assign owner role even if user's global role differs)
    await CompanyUser.create({
      company: company._id,
      user: req.user._id,
      role: ownerRole?._id || null,
      isActive: true
    })

    res.status(201).json({
      success: true,
      company
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all companies (for admin) or user's companies
// @route   GET /api/companies
// @access  Private
exports.getCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    
    // If not admin, only get user's companies
    if (req.user.role !== 'admin') {
      const companyUsers = await CompanyUser.find({ user: req.user._id, isActive: true })
      const companyIds = companyUsers.map(cu => cu.company)
      query._id = { $in: companyIds }
    }

    const companies = await Company.find(query)
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Company.countDocuments(query)

    res.json({
      success: true,
      count: companies.length,
      total,
      companies
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'name email phone')

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    // Check access
    if (req.user.role !== 'admin' && company.owner._id.toString() !== req.user._id.toString()) {
      const companyUser = await CompanyUser.findOne({
        company: company._id,
        user: req.user._id,
        isActive: true
      })

      if (!companyUser) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this company'
        })
      }
    }

    res.json({
      success: true,
      company
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    // Check authorization
    if (req.user.role !== 'admin' && company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      })
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.json({
      success: true,
      company
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    // Check authorization
    if (req.user.role !== 'admin' && company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this company'
      })
    }

    await company.deleteOne()

    res.json({
      success: true,
      message: 'Company deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get company stats
// @route   GET /api/companies/:id/stats
// @access  Private
exports.getCompanyStats = async (req, res, next) => {
  try {
    const companyId = req.params.id

    // Get worker count
    const workerCount = await Worker.countDocuments({ company: companyId, status: 'active' })

    // Get product count
    const Product = require('../models/Product')
    const productCount = await Product.countDocuments({ company: companyId, isActive: true })

    // Get today's sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const Order = require('../models/Order')
    const Memo = require('../models/Memo')
    
    const todayOrders = await Order.find({
      company: companyId,
      createdAt: { $gte: today, $lt: tomorrow }
    })
    const todayMemos = await Memo.find({
      company: companyId,
      createdAt: { $gte: today, $lt: tomorrow }
    })

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0) +
                      todayMemos.reduce((sum, memo) => sum + memo.total, 0)

    res.json({
      success: true,
      stats: {
        workers: workerCount,
        products: productCount,
        todaySales
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get active users count for a company
// @route   GET /api/companies/:id/users-count
// @access  Private
exports.getCompanyUsersCount = async (req, res, next) => {
  try {
    const companyId = req.params.id
    const count = await CompanyUser.countDocuments({ company: companyId, isActive: true })

    res.json({
      success: true,
      count
    })
  } catch (error) {
    next(error)
  }
}

