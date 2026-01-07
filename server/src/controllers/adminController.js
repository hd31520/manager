const User = require('../models/User')
const Company = require('../models/Company')
const Subscription = require('../models/Subscription')
const { paginate } = require('../utils/helpers')

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalCompanies = await Company.countDocuments()
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' })
    const totalRevenue = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$monthlyFee' } } }
    ])

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCompanies,
        activeSubscriptions,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (role) query.role = role
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      count: users.length,
      total,
      users
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private (Admin only)
exports.getCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)

    let query = {}
    if (status) query['subscription.status'] = status
    if (search) {
      query.name = { $regex: search, $options: 'i' }
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

// @desc    Suspend company
// @route   PUT /api/admin/companies/:id/suspend
// @access  Private (Admin only)
exports.suspendCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      })
    }

    company.subscription.status = 'suspended'
    company.isActive = false
    await company.save()

    const subscription = await Subscription.findOne({ company: company._id })
    if (subscription) {
      subscription.status = 'suspended'
      await subscription.save()
    }

    res.json({
      success: true,
      message: 'Company suspended successfully'
    })
  } catch (error) {
    next(error)
  }
}

