const User = require('../models/User')
const CompanyUser = require('../models/CompanyUser')

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    res.json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user companies
// @route   GET /api/users/companies
// @access  Private
exports.getUserCompanies = async (req, res, next) => {
  try {
    const companyUsers = await CompanyUser.find({
      user: req.user._id,
      isActive: true
    }).populate('company', 'name businessType logo')

    const companies = companyUsers.map(cu => cu.company)

    res.json({
      success: true,
      companies
    })
  } catch (error) {
    next(error)
  }
}

