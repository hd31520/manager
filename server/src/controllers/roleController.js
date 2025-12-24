const Role = require('../models/Role')
const { paginate } = require('../utils/helpers')

// @desc    Create role
// @route   POST /api/roles
// @access  Private
exports.createRole = async (req, res, next) => {
  try {
    const { companyId, name, description, permissions } = req.body

    // Check if role name already exists
    const existingRole = await Role.findOne({ company: companyId, name })
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      })
    }

    const role = await Role.create({
      company: companyId,
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

    let query = {}
    if (companyId) query.company = companyId

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
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
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

