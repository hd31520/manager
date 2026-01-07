const Role = require('../models/Role')
const { paginate } = require('../utils/helpers')

// @desc    Create role
// @route   POST /api/roles
// @access  Private
exports.createRole = async (req, res, next) => {
  try {
    const { companyId, name, description, permissions } = req.body
    const currentUser = req.user

    // If companyId not provided, use user's first active company
    let targetCompanyId = companyId
    if (!targetCompanyId) {
      const CompanyUser = require('../models/CompanyUser')
      const userCompany = await CompanyUser.findOne({
        user: currentUser._id,
        isActive: true
      })
      if (!userCompany) {
        return res.status(403).json({
          success: false,
          message: 'No company found. Please create or join a company first.'
        })
      }
      targetCompanyId = userCompany.company
    }

    // Verify user has access to this company
    const CompanyUser = require('../models/CompanyUser')
    const companyUser = await CompanyUser.findOne({
      company: targetCompanyId,
      user: currentUser._id,
      isActive: true
    })

    if (!companyUser && currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create roles for this company'
      })
    }

    // Check if role name already exists
    const existingRole = await Role.findOne({ company: targetCompanyId, name })
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      })
    }

    const role = await Role.create({
      company: targetCompanyId,
      name,
      description,
      permissions: permissions || {}
    })

    res.status(201).json({
      success: true,
      role
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get roles
// @route   GET /api/roles
// @access  Private
exports.getRoles = async (req, res, next) => {
  try {
    const { companyId, page = 1, limit = 10 } = req.query
    const { skip, limit: limitNum } = paginate(page, limit)
    const currentUser = req.user

    let query = {}
    
    // If companyId provided, use it but verify user has access
    if (companyId) {
      // Check if user has access to this company
      const CompanyUser = require('../models/CompanyUser')
      const companyUser = await CompanyUser.findOne({
        company: companyId,
        user: currentUser._id,
        isActive: true
      })
      
      if (!companyUser && currentUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this company'
        })
      }
      
      query.company = companyId
    } else {
      // If no companyId provided, get user's companies and return roles for all
      // Or use the first active company
      const CompanyUser = require('../models/CompanyUser')
      const companyUsers = await CompanyUser.find({
        user: currentUser._id,
        isActive: true
      })
      
      if (companyUsers.length === 0 && currentUser.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No company found. Please create or join a company first.'
        })
      }
      
      const companyIds = companyUsers.map(cu => cu.company)
      query.company = { $in: companyIds }
    }

    const roles = await Role.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 })

    const total = await Role.countDocuments(query)

    res.json({
      success: true,
      count: roles.length,
      total,
      roles
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private
exports.getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }

    // Check if user has access to this company
    const CompanyUser = require('../models/CompanyUser')
    const companyUser = await CompanyUser.findOne({
      company: role.company,
      user: req.user._id,
      isActive: true
    })

    if (!companyUser && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this role'
      })
    }

    res.json({
      success: true,
      role
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private
exports.updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }

    // Check if user has access to this company
    const CompanyUser = require('../models/CompanyUser')
    const companyUser = await CompanyUser.findOne({
      company: role.company,
      user: req.user._id,
      isActive: true
    })

    if (!companyUser && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this role'
      })
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      role: updatedRole
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private
exports.deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      })
    }

    // Check if user has access to this company
    const CompanyUser = require('../models/CompanyUser')
    const companyUser = await CompanyUser.findOne({
      company: role.company,
      user: req.user._id,
      isActive: true
    })

    if (!companyUser && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this role'
      })
    }

    if (role.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default role'
      })
    }

    await role.deleteOne()

    res.json({
      success: true,
      message: 'Role deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

